import type { WomenAddToCartBtnProps } from '../../types/components/catwoman/catwomanInterface';

export default function WomenAddToCartBtn({ onClick }: WomenAddToCartBtnProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-primary text-primary-foreground text-xs font-black py-4 rounded-sm uppercase tracking-widest hover:bg-rose-900 transition-all active:scale-95 shadow-md border border-border/10"
        >
            Add to bag
        </button>
    );
}
