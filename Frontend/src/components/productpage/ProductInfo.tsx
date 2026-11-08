import type { ProductInfoProps } from '../../types/components/productpage/productpageInterface';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import AddToCartBtn from './AddToCartBtn';

export default function ProductInfo({ product, onAddToCart }: ProductInfoProps) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tight text-foreground">{product.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                    <span className="text-2xl font-bold text-rose-600">PKR {product.price}</span>
                    {product.originalPrice && (
                        <span className="text-gray-400 line-through">PKR {product.originalPrice}</span>
                    )}
                </div>
            </div>
            <SizeSelector sizes={['S', 'M', 'L', 'XL']} />
            <QuantitySelector />
            <AddToCartBtn onClick={onAddToCart} />
        </div>
    );
}
