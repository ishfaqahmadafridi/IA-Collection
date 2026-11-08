import type { HotProductCheckboxProps } from '../../../types/components/admin/productModal/productModalInterface';
import type { ChangeEvent } from 'react';

export default function HotProductCheckbox({ checked, onChange }: HotProductCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="is_hot"
        checked={checked}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <label htmlFor="is_hot" className="text-sm font-medium text-gray-700">
        🔥 Mark as Hot Product
      </label>
    </div>
  );
}
