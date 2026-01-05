import './globals.css';
import Script from 'next/script';
import { Space_Grotesk, Fraunces } from 'next/font/google';
import { CartProvider } from '@/components/cart-context';
import Analytics from '@/components/Analytics';

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
      <body>
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}
        <CartProvider>
          {children}
          {gaId ? <Analytics gaId={gaId} /> : null}
        </CartProvider>
      </body>
    </html>
  );
}
