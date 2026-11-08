import type { AddToCartBtnProps } from '../../types/components/productpage/productpageInterface';

export default function AddToCartBtn({ onClick }: AddToCartBtnProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-primary text-primary-foreground text-xs font-black py-5 rounded-lg uppercase tracking-[0.3em] hover:bg-primary/90 border-2 border-border/20 transition-all duration-300 transform active:scale-95 shadow-xl"
        >
            Add To Shopping Bag
        </button>
    );
}
