'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { useCart } from '@/components/cart-context';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="page">
      <SiteHeader />
      <main className="content status-page">
        <h1>Betalningen lyckades</h1>
        <p className="hero-copy">
          Tack för din beställning. En bekräftelse skickas med leveransinformation.
        </p>
        <Link className="button button-primary" href="/">
          Tillbaka till sortimentet
        </Link>
      </main>
    </div>
  );
}
