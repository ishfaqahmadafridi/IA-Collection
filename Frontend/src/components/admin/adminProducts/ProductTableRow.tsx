import ProductImage from './ProductImage';
import ProductStockBadge from './ProductStockBadge';
import ProductActions from './ProductActions';
import type { ProductTableRowProps } from '../../../types/components/admin/adminProducts/adminProductsInterface';

export default function ProductTableRow({ product, onEdit }: ProductTableRowProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <ProductImage src={product.image} alt={product.name} />
          <div>
            <p className="font-medium text-gray-900">{product.name}</p>
            {product.is_hot && (
              <span className="text-xs text-orange-600 font-medium">🔥 Hot</span>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{product.category_name || product.category}</td>
      <td className="py-3 px-4">
        <div>
          <p className="font-semibold text-gray-900">PKR {product.price}</p>
          {product.original_price && product.original_price > product.price && (
            <p className="text-xs text-gray-400 line-through">PKR {product.original_price}</p>
          )}
        </div>
      </td>
      <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.stock}</td>
      <td className="py-3 px-4">
        <ProductStockBadge stock={product.stock} />
      </td>
      <td className="py-3 px-4">
        <ProductActions product={product} onEdit={onEdit} />
      </td>
    </tr>
  );
}
