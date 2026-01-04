'use client';

import { useCart } from './cart-context';

export default function AddToCartButton({
  productId,
  variantId,
  label = 'Lägg i varukorg'
}) {
  const { addItem } = useCart();

  return (
    <button className="button button-small" onClick={() => addItem(productId, variantId)}>
      {label}
    </button>
  );
}
