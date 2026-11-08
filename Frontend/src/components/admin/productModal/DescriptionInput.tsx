import type { DescriptionInputProps } from '../../../types/components/admin/productModal/productModalInterface';
import type { ChangeEvent } from 'react';

export default function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  return (
    <div>
      <label htmlFor="admin-description" className="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea
        id="admin-description"
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        rows={3}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="Enter product description"
      />
    </div>
  );
}
