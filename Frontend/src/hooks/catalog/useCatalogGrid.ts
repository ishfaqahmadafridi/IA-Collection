import { useSearchParams } from 'react-router-dom';
import { useCatalog } from '../useCatalog';
import { filterCatalogProducts } from '../../utils/catalog';
import type { CatalogFilters } from '../../types/catalog';
export function useCatalogGrid(filters: CatalogFilters) {
  const { products, categories, loading, error, retry } = useCatalog();
  const [params] = useSearchParams();
  const selected = params.get('category');
  return { products: filterCatalogProducts(products, categories, { ...filters, selected }), selected, loading, error, retry };
}
