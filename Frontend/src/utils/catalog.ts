import { CATEGORY_ALIASES } from '../constants/catalog';
import type { CatalogFilters } from '../types/catalog';
import type { ApiCategory, ApiProduct } from '../types/api';
export function catalogProducts(products: ApiProduct[], categories: ApiCategory[], group?: string): ApiProduct[] {
  if (!group) return products;
  const slugs = CATEGORY_ALIASES[group] || [group];
  const ids = new Set(categories.filter(category => slugs.includes(category.slug)).map(category => category.id));
  // Include descendants by ID, not ambiguous name substring matching.
  let previous = -1;
  while (previous !== ids.size) {
    previous = ids.size;
    categories.forEach(category => { if (category.parent !== null && ids.has(category.parent)) ids.add(category.id); });
  }
  return products.filter(product => ids.has(product.category));
}

export function filterCatalogProducts(products: ApiProduct[], categories: ApiCategory[], filters: CatalogFilters): ApiProduct[] {
  const grouped = catalogProducts(products, categories, filters.group);
  const selected = filters.selected ? catalogProducts(grouped, categories, filters.selected) : grouped;
  const query = (filters.query || '').trim().toLowerCase();
  return selected.filter(product => (!filters.sale || Number(product.original_price) > Number(product.price))
    && `${product.name} ${product.category_name}`.toLowerCase().includes(query));
}
export function isDiscounted(product: ApiProduct): boolean {
  return product.original_price !== null && Number(product.original_price) > Number(product.price);
}
