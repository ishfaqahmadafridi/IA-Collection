import { filterInventory } from '../../../utils/admin/inventory';
import ProductTableRow from './ProductTableRow';
import type { Product } from '../../../types/components/admin/adminProducts/adminProductsInterface';

interface ProductsTableProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
  activeFilter: string;
}

export default function ProductsTable({ products = [], onEditProduct, activeFilter }: ProductsTableProps) {
  const filteredProducts = filterInventory(products, activeFilter);

  if (!filteredProducts.length) return <p role="status" className="p-6">No products match this filter.</p>;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Product</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Stock</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product: Product) => (
              product?.id ? (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onEdit={() => onEditProduct(product)}
                />
              ) : null
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
