import { IoCamera } from 'react-icons/io5';
import type { ProfileImageSelectButtonProps } from '../../types/profile';

export default function ProfileImageSelectButton({ onSelect }: ProfileImageSelectButtonProps) {
    return (
        <label className="focus-within:ring-2 focus-within:ring-rose-600 cursor-pointer px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors flex items-center gap-2">
            <IoCamera className="text-xl" />
            Choose Image
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onSelect} className="sr-only" />
        </label>
    );
}
