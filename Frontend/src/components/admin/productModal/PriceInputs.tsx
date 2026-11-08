import type { PriceInputsProps } from '../../../types/components/admin/productModal/productModalInterface';
import type { ChangeEvent } from 'react';

export default function PriceInputs({ price, originalPrice, onPriceChange, onOriginalPriceChange }: PriceInputsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="admin-price" className="block text-sm font-medium text-gray-700 mb-1">
          Price *
        </label>
        <input
          id="admin-price"
          min="0"
          type="number"
          step="0.01"
          value={price}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onPriceChange(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>
      <div>
        <label htmlFor="admin-original-price" className="block text-sm font-medium text-gray-700 mb-1">
          Original Price
        </label>
        <input
          id="admin-original-price"
          min="0"
          type="number"
          step="0.01"
          value={originalPrice}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onOriginalPriceChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
        />
      </div>
    </div>
  );
}
