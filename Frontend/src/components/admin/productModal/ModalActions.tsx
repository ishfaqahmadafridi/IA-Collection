import type { ModalActionsProps } from '../../../types/components/admin/productModal/productModalInterface';

export default function ModalActions({ loading, isEditing, onCancel }: ModalActionsProps) {
  return (
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
      </button>
    </div>
  );
}
