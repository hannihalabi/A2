import './globals.css';
import Script from 'next/script';
import { Space_Grotesk, Fraunces } from 'next/font/google';
import { CartProvider } from '@/components/cart-context';
import Analytics from '@/components/Analytics';
import { Suspense } from 'react';

const bodyFont = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body'
});

const displayFont = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display'
});

export const metadata = {
  title: 'Mandziie 🦋',
  description: 'Produkter med Stripe Checkout.'
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="beforeInteractive"
            />
            <Script id="ga-init" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
      </head>
      <body>
        <CartProvider>
          {children}
          {gaId ? (
            <Suspense fallback={null}>
              <Analytics gaId={gaId} />
            </Suspense>
          ) : null}
        </CartProvider>
      </body>
    </html>
  );
}
