import { LOW_STOCK_THRESHOLD } from '../../constants/limits';
import type { Product } from '../../types/components/admin/adminProducts/adminProductsInterface';
export function stockStatus(stock: number) {
  if (stock <= 0) return 'out_of_stock';
  if (stock < LOW_STOCK_THRESHOLD) return 'low_stock';
  return 'in_stock';
}
export function filterInventory(products: Product[], filter: string): Product[] {
  return products.filter(product => product && (filter === 'all' || stockStatus(product.stock) === filter));
}
