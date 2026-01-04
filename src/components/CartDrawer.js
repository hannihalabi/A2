'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart-context';
import { formatPrice } from '@/lib/format';

export default function CartDrawer({ open, onClose }) {
  const {
    lineItems,
    subtotal,
    tax,
    total,
    itemCount,
    updateQuantity,
    removeItem
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const empty = lineItems.length === 0;
  const estimatedTaxLabel = useMemo(() => (empty ? '$0.00' : formatPrice(tax)), [tax, empty]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  async function handleCheckout() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lineItems.map((item) => ({ id: item.id, quantity: item.quantity }))
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Checkout failed.');
      }

      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error('Checkout session missing.');
    } catch (err) {
      setError(err.message || 'Checkout failed.');
      setIsLoading(false);
    }
  }

  return (
    <div className={`drawer ${open ? 'drawer-open' : ''}`} aria-hidden={!open}>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="cart-panel" role="dialog" aria-label="Shopping cart">
        <div className="cart-header">
          <div>
            <p className="cart-title">Your cart</p>
            <p className="cart-subtitle">{itemCount} item{itemCount === 1 ? '' : 's'}</p>
          </div>
          <button className="button button-ghost" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="cart-items">
          {empty ? (
            <div className="cart-empty">
              <p>Nothing here yet.</p>
              <p className="muted">Pick from the four-piece edit to get started.</p>
            </div>
          ) : (
            lineItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <Link href={`/products/${item.id}`} className="cart-item-image">
                  <Image src={item.image} alt={item.name} fill sizes="96px" />
                </Link>
                <div className="cart-item-info">
                  <div>
                    <p className="cart-item-name">{item.name}</p>
                    <p className="muted">{formatPrice(item.price)}</p>
                  </div>
                  <div className="qty-controls">
                    <button
                      className="button button-ghost"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="button button-ghost"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="button button-link"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="totals-row">
              <span>Estimated tax</span>
              <span>{estimatedTaxLabel}</span>
            </div>
            <div className="totals-row totals-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          {error ? <p className="error">{error}</p> : null}
          <button
            className="button button-primary"
            onClick={handleCheckout}
            disabled={empty || isLoading}
          >
            {isLoading ? 'Redirecting...' : 'Checkout with Stripe'}
          </button>
          <p className="muted footnote">Tax finalizes at Stripe checkout.</p>
        </div>
      </aside>
    </div>
  );
}
