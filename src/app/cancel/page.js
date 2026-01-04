import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';

export default function CancelPage() {
  return (
    <div className="page">
      <SiteHeader />
      <main className="content status-page">
        <h1>Köpet avbröts</h1>
        <p className="hero-copy">
          Ingen betalning genomfördes. Din varukorg finns kvar när du är redo.
        </p>
        <Link className="button button-primary" href="/">
          Tillbaka till varukorgen
        </Link>
      </main>
    </div>
  );
}
