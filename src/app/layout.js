import './globals.css';
import { Space_Grotesk, Fraunces } from 'next/font/google';
import { CartProvider } from '@/components/cart-context';

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
  title: 'A2 Shop',
  description: 'Fyra produkter med Stripe Checkout.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
