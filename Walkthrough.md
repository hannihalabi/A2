# Walkthrough

This document summarizes the work completed so far on the A2 storefront.

## 1) Project setup
- Initialized a Next.js App Router project (JS) with Stripe server routes.
- Added project structure under `src/app`, `src/components`, `src/lib`.
- Configured `jsconfig.json` for the `@/` alias.

## 2) Product catalog
- Built a 4-product catalog with variants in `src/lib/products.js`.
- Added variants for Trizapetide and Retatrutide (10 mg / 20 mg).
- Single-variant products for Nässprej (30 mg) and Melanotan 2 (10 mg).

## 3) Cart + checkout
- Cart state with localStorage persistence in `src/components/cart-context.js`.
- Cart drawer UI in `src/components/CartDrawer.js`.
- Stripe Checkout session creation in `src/app/api/checkout/route.js`.
- Stripe webhook endpoint in `src/app/api/webhooks/route.js` (optional).

## 4) Discount code
- Added a discount field in checkout.
- Code `MAND25` applies 25% discount and updates totals.
- Discount is applied in Stripe line items at checkout time.

## 5) Shipping details
- Stripe Checkout now requires:
  - full billing address
  - shipping address (SE)
  - phone number
- Added a free shipping option in Checkout to ensure address capture.

## 6) UI / UX changes
- Switched site theme to a pink, softer palette in `src/app/globals.css`.
- Added floating cart button on mobile (bottom-right).
- Added product variant selection directly on cards (two buttons).
- Adjusted mobile layout to show 1 product per row.

## 7) Media updates
- Product images now use local assets in `public/`:
  - Trizapetide: `public/tirzepetide/tirze-1.png`
  - Retatrutide: `public/retatrutide/Retatrutide.png`
  - Nässprej: `public/nasspray/nasspray.jpeg`
  - Melanotan 2: `public/melanotan/Melanotan-2.jpeg`
- Added hero image loop for desktop.
- Added hero video for mobile:
  - source at `public/hero-video/video-1.mp4`
  - full-screen on mobile before hero text

## 8) Pages
- Home page in `src/app/page.js`.
- Product detail page in `src/app/products/[id]/page.js`.
- Success and cancel pages in `src/app/success/page.js` and `src/app/cancel/page.js`.

## 9) Deployment notes
- Vercel hosting recommended for Stripe Checkout.
- Required env vars:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_BASE_URL`
  - optional: `STRIPE_WEBHOOK_SECRET`

## 10) Known items to verify
- Mobile hero video autoplay on real devices.
- Stripe Checkout address capture on Apple Pay.
- Discount code behavior end-to-end in production.

