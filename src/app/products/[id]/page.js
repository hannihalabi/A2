import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import ProductDetail from '@/components/ProductDetail';
import { productsById } from '@/lib/products';

export default function ProductPage({ params }) {
  const product = productsById[params.id];

  if (!product) {
    notFound();
  }

  return (
    <div className="page">
      <SiteHeader />
      <ProductDetail product={product} />
    </div>
  );
}
