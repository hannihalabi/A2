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
        <h1>Payment complete</h1>
        <p className="hero-copy">
          Thanks for your order. A confirmation email is on the way with tracking details.
        </p>
        <Link className="button button-primary" href="/">
          Return to the collection
        </Link>
      </main>
    </div>
  );
}
