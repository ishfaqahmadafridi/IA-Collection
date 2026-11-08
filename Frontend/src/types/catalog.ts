import type { ApiProduct } from './api';
export interface CatalogFilters { group?: string; sale?: boolean; query?: string; selected?: string | null }
export interface CatalogProductProps { product: ApiProduct }
export interface CatalogCardsProps { products: ApiProduct[] }
export interface CategoryLinksProps { group: string; route: string; title: string }
