import { useProductStore } from '../../stores/product/productStore';
import type { SizeSelectorProps } from '../../types/components/productpage/productpageInterface';

export default function SizeSelector({ sizes }: SizeSelectorProps) {
    const setSelectedSize = useProductStore((state) => state.setSelectedSize);
    const currentSize = useProductStore((state) => state.selectedSize);
    return (
        <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Select Size</label>
            <div className="flex gap-3">
                {sizes.map(size => (
                    <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center border-2 transition-all font-bold ${currentSize === size ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground'}`}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    );
}
