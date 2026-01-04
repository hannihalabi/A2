# A2 Shop

A four-item e-commerce demo built with Next.js and Stripe Checkout (SEK pricing).

## Setup

1. Install dependencies
   
   ```bash
   npm install
   ```

2. Create `.env.local`

   ```bash
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_... # optional
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. Run the dev server

   ```bash
   npm run dev
   ```

## Stripe webhook (optional)

Use the Stripe CLI to forward events locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks
```

Then trigger a test event:

```bash
stripe trigger checkout.session.completed
```

## Deploy to Vercel

- Push this repo to GitHub.
- Import it into Vercel.
- Set the same environment variables in Vercel.
- Update `NEXT_PUBLIC_BASE_URL` to your deployed domain.
