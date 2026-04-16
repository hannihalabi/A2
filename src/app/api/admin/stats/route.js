import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export async function GET(req) {
  const auth = req.headers.get('x-admin-auth');
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all completed checkout sessions (paginate through all)
    const sessions = [];
    let hasMore = true;
    let startingAfter = undefined;

    while (hasMore) {
      const params = {
        limit: 100,
        expand: ['data.line_items'],
      };
      if (startingAfter) params.starting_after = startingAfter;

      const page = await stripe.checkout.sessions.list(params);
      const completed = page.data.filter(s => s.payment_status === 'paid');
      sessions.push(...completed);

      hasMore = page.has_more;
      if (page.data.length > 0) {
        startingAfter = page.data[page.data.length - 1].id;
      }
    }

    // Aggregate totals
    let totalRevenue = 0;
    let totalOrders = sessions.length;
    const revenueByMonth = {};
    const productSales = {};

    for (const session of sessions) {
      const amount = session.amount_total || 0;
      totalRevenue += amount;

      // Group by month
      const date = new Date(session.created * 1000);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + amount;

      // Product breakdown from line items
      if (session.line_items && session.line_items.data) {
        for (const item of session.line_items.data) {
          const name = item.description || item.price?.product?.name || 'Okänd produkt';
          if (!productSales[name]) {
            productSales[name] = { quantity: 0, revenue: 0 };
          }
          productSales[name].quantity += item.quantity || 1;
          productSales[name].revenue += item.amount_total || 0;
        }
      }
    }

    // Sort months chronologically
    const monthlyData = Object.entries(revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month, revenue }));

    // Sort products by revenue
    const productData = Object.entries(productSales)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    // Recent orders (last 10)
    const recentOrders = sessions.slice(0, 10).map(s => ({
      id: s.id,
      created: s.created,
      amount: s.amount_total,
      customerEmail: s.customer_details?.email || '–',
      currency: s.currency
    }));

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      monthlyData,
      productData,
      recentOrders
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Kunde inte hämta statistik.' }, { status: 500 });
  }
}
