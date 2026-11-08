import { IoAddOutline } from 'react-icons/io5';
import type { ProductsHeaderProps } from '../../../types/components/admin/adminProducts/adminProductsInterface';

export default function ProductsHeader({ onAddProduct }: ProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
        <p className="text-gray-500 text-sm mt-1">Manage your product inventory</p>
      </div>
      <button
        onClick={onAddProduct}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <IoAddOutline className="text-xl" />
        Add Product
      </button>
    </div>
  );
}
