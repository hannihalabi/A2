'use client';

import { useState } from 'react';
import Link from 'next/link';
import CartDrawer from './CartDrawer';
import { useCart } from './cart-context';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <header className="nav">
        <Link href="/" className="brand" aria-label="Hem">
          🦋
        </Link>
        <div className="nav-actions">
          <button className="button button-ghost" onClick={() => setOpen(true)}>
            Varukorg
            <span className="cart-count">{itemCount}</span>
          </button>
        </div>
      </header>
      <button className="floating-cart" onClick={() => setOpen(true)} aria-label="Varukorg">
        <span className="floating-cart-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 6l.9 4.2c.1.5.6.8 1.1.8h6.9c.5 0 1-.3 1.1-.8l.9-4.2H7.2zM6 4h12c.6 0 1 .5.9 1.1l-1.3 6.2c-.2 1-1.1 1.7-2.1 1.7H9.2c-1 0-1.9-.7-2.1-1.7L5.4 3H3.5c-.6 0-1-.4-1-1s.4-1 1-1H6z" />
          </svg>
        </span>
        <span className="floating-cart-badge">{itemCount}</span>
      </button>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
