'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ product }) {
  const variants = product.variants || [];
  const multipleVariants = variants.length > 1;
  const defaultVariant = variants[0];
  const [selectedId, setSelectedId] = useState(defaultVariant?.id || '');

  const selectedVariant = useMemo(() => {
    return variants.find((variant) => variant.id === selectedId) || defaultVariant;
  }, [variants, selectedId, defaultVariant]);

  return (
    <div className="card">
      <Link href={`/products/${product.id}`} className="card-image">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="card-body">
        <div className="card-kicker">{product.tagline}</div>
        <h3 className="card-title">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="card-copy">{product.description}</p>

        {multipleVariants ? (
          <div className="card-variant">
            <p className="card-variant-label">Välj styrka</p>
            <div className="card-variant-options">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  className={`card-variant-option ${
                    selectedId === variant.id ? 'selected' : ''
                  }`}
                  onClick={() => setSelectedId(variant.id)}
                  aria-pressed={selectedId === variant.id}
                >
                  <span>{variant.label}</span>
                  <span className="card-variant-meta">{variant.duration}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="card-meta">
          <span className="price">{formatPrice(selectedVariant.price)}</span>
          <AddToCartButton productId={product.id} variantId={selectedVariant.id} />
        </div>
      </div>
    </div>
  );
}
