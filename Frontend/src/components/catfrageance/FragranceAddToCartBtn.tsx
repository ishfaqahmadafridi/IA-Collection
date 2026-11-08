import type { FragranceAddToCartBtnProps } from '../../types/components/catfragrance/catfragranceInterface';

export default function FragranceAddToCartBtn({ onClick }: FragranceAddToCartBtnProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-primary text-primary-foreground text-xs font-black py-3.5 rounded-lg uppercase tracking-[0.2em] hover:bg-amber-600 transition-all active:scale-95 shadow-lg border border-border/10"
        >
            Add to bag
        </button>
    );
}
