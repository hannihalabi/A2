import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import AddToCartButton from '@/components/AddToCartButton';
import { productsById } from '@/lib/products';
import { formatPrice } from '@/lib/format';

export default function ProductPage({ params }) {
  const product = productsById[params.id];

  if (!product) {
    notFound();
  }

  return (
    <div className="page">
      <SiteHeader />
      <main className="content detail">
        <div className="detail-image">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="detail-copy">
          <Link className="button button-ghost" href="/">
            Back to collection
          </Link>
          <p className="card-kicker">{product.tagline}</p>
          <h1>{product.name}</h1>
          <p className="hero-copy">{product.story}</p>
          <div className="card-meta">
            <span className="price">{formatPrice(product.price)}</span>
            <AddToCartButton productId={product.id} label="Add to cart" />
          </div>
          <div className="detail-highlights">
            {product.highlights.map((item) => (
              <div key={item} className="detail-highlight">
                {item}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
