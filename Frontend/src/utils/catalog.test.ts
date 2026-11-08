import { describe, expect, it } from 'vitest';
import { catalogProducts } from './catalog';
import type { ApiCategory, ApiProduct } from '../types/api';
const categories: ApiCategory[] = [
  { id: 1, slug: 'men', name: 'Men', parent: null, image: null, hero_image: null, products: [] },
  { id: 2, slug: 'men-shirts', name: 'Shirts', parent: 1, image: null, hero_image: null, products: [] },
  { id: 3, slug: 'women-shirts', name: 'Shirts', parent: null, image: null, hero_image: null, products: [] },
];
const makeProduct = (id: number, category: number): ApiProduct => ({ id, category, category_name: 'Shirts', name: 'Shirt', price: '100', original_price: null, discount: 0, image: '', description: '', stock: 3, is_hot: false });
describe('catalog source selection', () => {
  it('matches descendants by category ID instead of similar names', () => {
    expect(catalogProducts([makeProduct(1, 2), makeProduct(2, 3)], categories, 'men').map(p => p.id)).toEqual([1]);
  });
  it('returns no unrelated products when the requested category does not exist', () => {
    expect(catalogProducts([makeProduct(1, 2)], categories, 'missing')).toEqual([]);
  });
});
