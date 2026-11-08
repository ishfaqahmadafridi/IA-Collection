import { IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { useProductsStore } from '../../../stores/admin/productsStore';
import type { ProductActionsProps } from '../../../types/components/admin/adminProducts/adminProductsInterface';

export default function ProductActions({ product, onEdit }: ProductActionsProps) {
  const { deleteProduct } = useProductsStore();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      void deleteProduct(product.id.toString()).catch(() => { /* Store displays the error. */ });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="Edit"
      >
        <IoCreateOutline className="text-lg" />
      </button>
      <button
        onClick={handleDelete}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete"
      >
        <IoTrashOutline className="text-lg" />
      </button>
    </div>
  );
}
