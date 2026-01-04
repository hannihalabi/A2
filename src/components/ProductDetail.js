'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import { formatPrice } from '@/lib/format';

export default function ProductDetail({ product }) {
  const variants = product.variants || [];
  const [selectedId, setSelectedId] = useState(variants[0]?.id || '');
  const gallery = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(gallery[0]);

  const selectedVariant = useMemo(() => {
    return variants.find((variant) => variant.id === selectedId) || variants[0];
  }, [variants, selectedId]);

  useEffect(() => {
    setActiveImage(gallery[0]);
  }, [product.id, gallery]);

  return (
    <main className="content detail">
      <div className="detail-image">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="detail-copy">
        <Link className="button button-ghost" href="/">
          Tillbaka till sortimentet
        </Link>
        <p className="card-kicker">{product.tagline}</p>
        <h1>{product.name}</h1>
        <p className="hero-copy">{product.story}</p>

        {variants.length > 1 ? (
          <div className="variant-grid">
            {variants.map((variant) => (
              <label
                key={variant.id}
                className={`variant-option ${selectedId === variant.id ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="variant"
                  value={variant.id}
                  checked={selectedId === variant.id}
                  onChange={() => setSelectedId(variant.id)}
                />
                <div className="variant-title">{variant.label}</div>
                <div className="variant-meta">{variant.duration}</div>
                <div className="variant-price">{formatPrice(variant.price)}</div>
              </label>
            ))}
          </div>
        ) : (
          <div className="detail-highlight">
            {variants[0]?.label} - {variants[0]?.duration}
          </div>
        )}

        <div className="card-meta">
          <span className="price">{formatPrice(selectedVariant.price)}</span>
          <AddToCartButton productId={product.id} variantId={selectedVariant.id} />
        </div>
        <div className="detail-highlights">
          {product.highlights.map((item) => (
            <div key={item} className="detail-highlight">
              {item}
            </div>
          ))}
        </div>
        {gallery.length > 1 ? (
          <div className="detail-gallery">
            {gallery.map((src) => (
              <button
                key={src}
                type="button"
                className={`detail-thumb ${activeImage === src ? 'active' : ''}`}
                onClick={() => setActiveImage(src)}
                aria-label="Byt produktbild"
              >
                <Image src={src} alt="" fill sizes="72px" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
