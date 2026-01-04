import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import SiteHeader from '@/components/SiteHeader';
import { formatPrice } from '@/lib/format';

export default function HomePage() {
  const heroProduct = products[0];

  return (
    <div className="page">
      <SiteHeader />
      <main className="content">
        <section className="hero">
          <div>
            <span className="pill">Seasonal studio edit</span>
            <h1 className="hero-title">Four essentials, curated for slow mornings.</h1>
            <p className="hero-copy">
              Sable &amp; Stone distills modern interiors into a focused edit: light, texture,
              and comfort, each piece tuned to work together.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#collection">
                Shop the edit
              </a>
              <Link className="button button-ghost" href={`/products/${heroProduct.id}`}>
                Explore the hero piece
              </Link>
            </div>
          </div>
          <div className="hero-card">
            <Image
              src={heroProduct.image}
              alt={heroProduct.name}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              priority
            />
            <div className="hero-card-content">
              <p className="card-kicker">Featured</p>
              <h3 className="card-title">{heroProduct.name}</h3>
              <p className="card-copy">{heroProduct.description}</p>
              <div className="card-meta">
                <span className="price">{formatPrice(heroProduct.price)}</span>
                <Link className="button button-small" href={`/products/${heroProduct.id}`}>
                  View details
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="collection" className="section">
          <div className="section-head">
            <h2>Four pieces. No filler.</h2>
            <p>
              Every item is handpicked to layer light, warmth, and texture. Add one or build
              the full set.
            </p>
          </div>
          <div className="grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <footer className="footer">
        Crafted for a seamless checkout with Stripe. Free studio delivery on the full edit.
      </footer>
    </div>
  );
}
