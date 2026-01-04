'use client';

import { useCart } from './cart-context';

export default function AddToCartButton({ productId, label = 'Add to cart' }) {
  const { addItem } = useCart();

  return (
    <button className="button button-small" onClick={() => addItem(productId)}>
      {label}
    </button>
  );
}
