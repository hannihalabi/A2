import Link from 'next/link';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import SiteHeader from '@/components/SiteHeader';
import HeroImageLoop from '@/components/HeroImageLoop';

export default function HomePage() {
  const heroProduct = products[0];

  return (
    <div className="page">
      <SiteHeader />
      <main className="content">
        <section className="hero">
          <div>
            <span className="pill">Utvalt sortiment av kvalitet</span>
            <h1 className="hero-title">Viktnedgång. På ett effektivare sätt</h1>
            <p className="hero-copy">
              A2 Shop samlar ett koncentrerat urval med tydliga styrkor och snabb checkout.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#collection">
                Se sortimentet
              </a>
              <Link className="button button-ghost" href={`/products/${heroProduct.id}`}>
                Utforska produkten
              </Link>
            </div>
          </div>
          <div className="hero-card">
            <HeroImageLoop />
          </div>
        </section>

        <section id="collection" className="section">
          <div className="section-head">
            <h2>Köp dina produkter idag. Snabb leverans</h2>
            <p>
              Välj en produkt eller kombinera flera. Allt är redo för snabb checkout.
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
        Säker betalning via Stripe Checkout. Leveransinformation visas i kassan.
      </footer>
    </div>
  );
}
