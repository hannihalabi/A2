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

  const getSavings = (variant) => {
    if (!variant?.compareAtPrice) return null;
    const savings = variant.compareAtPrice - variant.price;
    return savings > 0 ? savings : null;
  };

  const selectedSavings = getSavings(selectedVariant);

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
            {variants.map((variant) => {
              const variantSavings = getSavings(variant);
              return (
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
                  <div className="variant-price">
                    <span className="variant-price-current">
                      {formatPrice(variant.price)}
                    </span>
                    {variantSavings ? (
                      <>
                        <span className="price-compare">
                          Ord. {formatPrice(variant.compareAtPrice)}
                        </span>
                        <span className="price-savings">
                          Rabatt -{formatPrice(variantSavings)}
                        </span>
                      </>
                    ) : null}
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="detail-highlight">
            {variants[0]?.label} - {variants[0]?.duration}
          </div>
        )}

        <div className="card-meta">
          <div className="price-stack">
            <div className="price-row">
              <span className="price">{formatPrice(selectedVariant.price)}</span>
              {selectedSavings ? (
                <span className="price-compare">
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
              ) : null}
            </div>
            {selectedSavings ? (
              <>
                <span className="price-savings">Rabatt -{formatPrice(selectedSavings)}</span>
              </>
            ) : null}
          </div>
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
