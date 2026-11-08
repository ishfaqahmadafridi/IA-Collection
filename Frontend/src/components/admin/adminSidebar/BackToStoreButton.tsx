import { IoLogOutOutline } from 'react-icons/io5';
import type { BackToStoreButtonProps } from '../../../types/components/admin/adminSidebar/adminSidebarInterface';

export default function BackToStoreButton({ onClick }: BackToStoreButtonProps) {
  return (
    <div className="w-full p-6 border-t border-gray-800">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200"
      >
        <IoLogOutOutline className="text-xl mr-2" />
        <span className="font-medium">Back to Store</span>
      </button>
    </div>
  );
}
