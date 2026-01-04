import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';

export default function CancelPage() {
  return (
    <div className="page">
      <SiteHeader />
      <main className="content status-page">
        <h1>Checkout canceled</h1>
        <p className="hero-copy">
          No charges were made. Your cart is still saved when you are ready.
        </p>
        <Link className="button button-primary" href="/">
          Return to cart
        </Link>
      </main>
    </div>
  );
}
