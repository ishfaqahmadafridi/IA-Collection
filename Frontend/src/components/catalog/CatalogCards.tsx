import CatalogProductCard from './CatalogProductCard';
import type { CatalogCardsProps } from '../../types/catalog';
export default function CatalogCards({ products }: CatalogCardsProps) {
  if (!products.length) return <p role="status" className="py-8">No products found.</p>;
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {products.map(product => <CatalogProductCard key={product.id} product={product} />)}
  </div>;
}
