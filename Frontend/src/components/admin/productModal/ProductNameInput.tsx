import type { ProductNameInputProps } from '../../../types/components/admin/productModal/productModalInterface';
import type { ChangeEvent } from 'react';

export default function ProductNameInput({ value, onChange }: ProductNameInputProps) {
  return (
    <div>
      <label htmlFor="admin-product-name" className="block text-sm font-medium text-gray-700 mb-1">
        Product Name *
      </label>
      <input
        id="admin-product-name"
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter product name"
      />
    </div>
  );
}
