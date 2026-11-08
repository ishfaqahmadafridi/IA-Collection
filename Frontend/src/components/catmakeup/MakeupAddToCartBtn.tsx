import type { MakeupAddToCartBtnProps } from '../../types/components/catmakeup/catmakeupInterface';

export default function MakeupAddToCartBtn({ onClick }: MakeupAddToCartBtnProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-primary text-primary-foreground text-xs font-bold py-3.5 rounded-full uppercase tracking-widest hover:bg-pink-600 transition-all active:scale-95 shadow-md border border-border/10"
        >
            Add to bag
        </button>
    );
}
