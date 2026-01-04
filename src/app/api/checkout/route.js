import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductVariant, productsById } from '@/lib/products';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export async function POST(req) {
  try {
    const { items, discountCode } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Varukorgen är tom.' }, { status: 400 });
    }

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(
      /\/$/,
      ''
    );
    const normalizedCode =
      typeof discountCode === 'string' ? discountCode.trim().toUpperCase() : '';
    const discountRate = normalizedCode === 'MAND25' ? 0.25 : 0;

    const lineItems = items
      .map((item) => {
        const product = productsById[item.id];
        const variant = getProductVariant(item.id, item.variantId);
        const quantity = Number(item.quantity);

        if (!product || !variant || !Number.isFinite(quantity) || quantity <= 0) {
          return null;
        }

        const imageUrl = product.image.startsWith('http')
          ? product.image
          : `${baseUrl}${product.image}`;
        const unitAmount = Math.max(
          0,
          Math.round(variant.price * (1 - discountRate))
        );

        return {
          price_data: {
            currency: 'sek',
            product_data: {
              name: `${product.name} ${variant.label}`,
              description: `${product.description} (${variant.duration})`,
              images: [imageUrl],
              metadata: {
                productId: product.id,
                variantId: variant.id,
                discountCode: normalizedCode || 'NONE'
              }
            },
            unit_amount: unitAmount
          },
          quantity
        };
      })
      .filter(Boolean);

    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'Inga giltiga produkter hittades.' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Kassan kunde inte starta.' }, { status: 500 });
  }
}
