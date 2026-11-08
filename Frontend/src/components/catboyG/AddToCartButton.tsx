type AddToCartButtonProps = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export default function AddToCartButton({ onClick }: AddToCartButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-primary text-primary-foreground text-[10px] md:text-xs font-black uppercase tracking-widest py-3 rounded-lg hover:shadow-lg transition-all active:scale-95 shadow-sm border border-border/10"
        >
            Add to Cart
        </button>
    );
}
