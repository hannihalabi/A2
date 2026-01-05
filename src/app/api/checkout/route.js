import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductVariant, productsById } from '@/lib/products';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

const DISCOUNT_END_DATE = '2026-01-05';
const DISCOUNT_END_HOUR = 18;

function getStockholmNow() {
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(new Date());
  const values = parts.reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  return {
    date: `${values.year}-${values.month}-${values.day}`,
    hour: Number(values.hour)
  };
}

function isDiscountActive(code) {
  if (code !== 'MAND25') return false;
  const { date, hour } = getStockholmNow();
  if (date < DISCOUNT_END_DATE) return true;
  if (date > DISCOUNT_END_DATE) return false;
  return hour < DISCOUNT_END_HOUR;
}

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
    const discountRate = isDiscountActive(normalizedCode) ? 0.25 : 0;
    const activeCode = discountRate ? normalizedCode : '';

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
                discountCode: activeCode || 'NONE'
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

    const itemCount = lineItems.reduce((sum, item) => sum + item.quantity, 0);
    const shippingAmount = itemCount > 2 ? 24000 : 12000;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_creation: 'always',
      customer_update: {
        address: 'auto',
        name: 'auto',
        shipping: 'auto'
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['SE']
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: shippingAmount, currency: 'sek' },
            display_name: 'Frakt (spårbart)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 5 }
            }
          }
        }
      ],
      phone_number_collection: {
        enabled: true
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Kassan kunde inte starta.' }, { status: 500 });
  }
}
