import type { SkincareAddToCartBtnProps } from '../../types/components/catskincare/catskincareInterface';

export default function SkincareAddToCartBtn({ onClick }: SkincareAddToCartBtnProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-emerald-900 text-white text-xs font-black py-4 rounded-xl uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg hover:shadow-emerald-200"
        >
            Add to routine
        </button>
    );
}
