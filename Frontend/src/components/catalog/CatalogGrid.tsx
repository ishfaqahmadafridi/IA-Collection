import { Link } from 'react-router-dom';
import { useCatalogGrid } from '../../hooks/catalog/useCatalogGrid';
import CatalogCards from './CatalogCards';
import type { CatalogFilters } from '../../types/catalog';
export default function CatalogGrid(filters: CatalogFilters) {
  const { products, selected, loading, error, retry } = useCatalogGrid(filters);
  if (loading) return <p role="status" className="py-8">Loading products…</p>;
  if (error) return <div role="alert"><p>{error}</p><button type="button" onClick={retry} className="underline py-4">Try again</button></div>;
  return <><CatalogCards products={products} />{selected && <Link to="?" className="block py-4 underline">Show all categories</Link>}</>;
}
