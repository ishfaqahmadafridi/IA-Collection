import { useProductStore } from '../../stores/product/productStore';

export default function QuantitySelector() {
    const setQuantity = useProductStore((state) => state.setQuantity);
    const quantity = useProductStore((state) => state.quantity);
    return (
        <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Quantity</label>
            <div className="flex items-center border-2 border-border w-fit rounded-lg overflow-hidden">
                <button onClick={() => setQuantity(quantity - 1)} className="px-4 py-2 hover:bg-muted transition-colors text-foreground">-</button>
                <span className="px-6 py-2 font-black border-x-2 border-border bg-background text-foreground">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-muted transition-colors text-foreground">+</button>
            </div>
        </div>
    );
}
