'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './cart-context';
import { formatPrice } from '@/lib/format';

export default function CartDrawer({ open, onClose }) {
  const {
    lineItems,
    subtotal,
    discountCode,
    discountAmount,
    shippingAmount,
    total,
    itemCount,
    updateQuantity,
    removeItem,
    applyDiscount
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [discountInput, setDiscountInput] = useState(discountCode || '');
  const [discountError, setDiscountError] = useState('');

  const empty = lineItems.length === 0;
  const discountLabel = discountCode ? `Rabatt (${discountCode})` : 'Rabatt';
  const shippingLabel = 'Frakt (spårbart)';

  useEffect(() => {
    setDiscountInput(discountCode || '');
  }, [discountCode]);

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

  function handleApplyDiscount() {
    if (!discountInput.trim()) {
      applyDiscount('');
      setDiscountError('');
      return;
    }

    const result = applyDiscount(discountInput);
    if (!result.ok) {
      setDiscountError(
        result.reason === 'expired' ? 'Rabattkoden har gått ut.' : 'Ogiltig rabattkod.'
      );
      return;
    }
    setDiscountError('');
  }

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
          })),
          discountCode
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
          <div className="cart-discount">
            <label htmlFor="discount-code">Rabattkod</label>
            <div className="discount-input">
              <input
                id="discount-code"
                type="text"
                placeholder="Skriv kod"
                value={discountInput}
                onChange={(event) => setDiscountInput(event.target.value)}
                autoComplete="off"
              />
              <button
                className="button button-ghost"
                type="button"
                onClick={handleApplyDiscount}
                disabled={isLoading}
              >
                Aktivera
              </button>
            </div>
            {discountError ? <p className="error">{discountError}</p> : null}
          </div>
          <div className="totals">
            <div className="totals-row">
              <span>Delsumma</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 ? (
              <div className="totals-row">
                <span>{discountLabel}</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            ) : null}
            {shippingAmount > 0 ? (
              <div className="totals-row">
                <span>{shippingLabel}</span>
                <span>{formatPrice(shippingAmount)}</span>
              </div>
            ) : null}
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
        </div>
      </aside>
    </div>
  );
}
