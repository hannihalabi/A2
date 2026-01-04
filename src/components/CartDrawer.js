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
  const estimatedTaxLabel = useMemo(
    () => (empty ? formatPrice(0) : formatPrice(tax)),
    [tax, empty]
  );

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
          items: lineItems.map((item) => ({
            id: item.id,
            variantId: item.variant.id,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || 'Kassan kunde inte starta.');
      }

      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error('Kassan saknar session.');
    } catch (err) {
      setError(err.message || 'Kassan kunde inte starta.');
      setIsLoading(false);
    }
  }

  return (
    <div className={`drawer ${open ? 'drawer-open' : ''}`} aria-hidden={!open}>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="cart-panel" role="dialog" aria-label="Shopping cart">
        <div className="cart-header">
          <div>
            <p className="cart-title">Din varukorg</p>
            <p className="cart-subtitle">
              {itemCount} produkt{itemCount === 1 ? '' : 'er'}
            </p>
          </div>
          <button className="button button-ghost" onClick={onClose}>
            Stäng
          </button>
        </div>

        <div className="cart-items">
          {empty ? (
            <div className="cart-empty">
              <p>Varukorgen är tom.</p>
              <p className="muted">Välj en produkt för att komma igång.</p>
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
                    <p className="muted">
                      {item.variant.label} - {item.variant.duration}
                    </p>
                    <p className="muted">{formatPrice(item.variant.price)}</p>
                  </div>
                  <div className="qty-controls">
                    <button
                      className="button button-ghost"
                      onClick={() =>
                        updateQuantity(item.id, item.variant.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="button button-ghost"
                      onClick={() =>
                        updateQuantity(item.id, item.variant.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="button button-link"
                      onClick={() => removeItem(item.id, item.variant.id)}
                    >
                      Ta bort
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
              <span>Delsumma</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          <div className="totals-row">
            <span>Moms (estimerad)</span>
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
            {isLoading ? 'Tar dig vidare...' : 'Till Stripe Checkout'}
          </button>
          <p className="muted footnote">Slutlig moms räknas i Stripe Checkout.</p>
        </div>
      </aside>
    </div>
  );
}
