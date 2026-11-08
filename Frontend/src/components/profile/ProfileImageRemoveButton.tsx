import { IoClose } from 'react-icons/io5';
import type { ProfileImageRemoveButtonProps } from '../../types/profile';

export default function ProfileImageRemoveButton({ onRemove, show }: ProfileImageRemoveButtonProps) {
    if (!show) return null;

    return (
        <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            title="Remove image"
            aria-label="Remove image"
        >
            <IoClose className="text-xl" />
        </button>
    );
}
