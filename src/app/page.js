import Link from 'next/link';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import SiteHeader from '@/components/SiteHeader';

export default function HomePage() {
  const heroProduct = products[0];

  return (
    <div className="page">
      <SiteHeader />
      <main className="content">
        <section className="hero">
          <div className="hero-content">
            <span className="pill">Utvalda tjänster</span>
            <h1 className="hero-title">Tjänster för vardag, hälsa och välmående</h1>
            <p className="hero-copy">
              Här hittar du coaching, kostupplägg och skönhetsbehandlingar i tydliga paket. Enkel och snabb checkout.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#collection">
                Se tjänsterna
              </a>
              <Link className="button button-ghost" href={`/products/${heroProduct.id}`}>
                Utforska tjänsten
              </Link>
            </div>
          </div>
        </section>

        <section id="collection" className="section">
          <div className="section-head">
            <h2>Boka rätt tjänst för dig</h2>
            <p>
              Välj ett paket eller kombinera flera tjänster. Allt är redo för snabb checkout.
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
        Säker betalning via Stripe Checkout. Bokningsinformation visas i kassan.
      </footer>
    </div>
  );
}
