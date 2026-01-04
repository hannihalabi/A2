'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import AddToCartButton from './AddToCartButton';

export default function ProductCard({ product }) {
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
        <div className="card-meta">
          <span className="price">{formatPrice(product.price)}</span>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
