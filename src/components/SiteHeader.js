'use client';

import { useState } from 'react';
import Link from 'next/link';
import CartDrawer from './CartDrawer';
import { useCart } from './cart-context';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <header className="nav">
      <Link href="/" className="brand">
        Sable & Stone
      </Link>
      <div className="nav-actions">
        <button className="button button-ghost" onClick={() => setOpen(true)}>
          Cart
          <span className="cart-count">{itemCount}</span>
        </button>
      </div>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
