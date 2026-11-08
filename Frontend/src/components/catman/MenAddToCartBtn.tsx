import type { MenAddToCartBtnProps } from '../../types/components/catman/catmanInterface';

export default function MenAddToCartBtn({ onClick }: MenAddToCartBtnProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-primary text-primary-foreground text-xs font-black py-4 rounded-md uppercase tracking-[0.2em] hover:bg-primary/90 transition-all active:scale-95 shadow-lg border border-border/10"
        >
            Add to bag
        </button>
    );
}
