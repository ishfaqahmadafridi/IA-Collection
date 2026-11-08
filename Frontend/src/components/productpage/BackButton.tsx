import { IoArrowBack } from 'react-icons/io5';
import type { BackButtonProps } from '../../types/components/productpage/productpageInterface';

export default function BackButton({ onClick }: BackButtonProps) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors group"
        >
            <IoArrowBack className="text-lg transition-transform group-hover:-translate-x-1" />
            Back to Collection
        </button>
    );
}
