import { IoClose } from 'react-icons/io5';
import type { ModalHeaderProps } from '../../../types/components/admin/productModal/productModalInterface';

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <IoClose className="text-2xl" />
      </button>
    </div>
  );
}
