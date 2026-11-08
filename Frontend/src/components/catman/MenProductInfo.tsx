import { useCartStore } from '../../stores/cart/cartStore';
import MenProductTitle from './MenProductTitle';
import MenProductPrice from './MenProductPrice';
import MenStockIndicator from './MenStockIndicator';
import MenAddToCartBtn from './MenAddToCartBtn';
import type { MenProductInfoProps } from '../../types/components/catman/catmanInterface';

export default function MenProductInfo({ product }: MenProductInfoProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    // Extract numeric ID for cart (backend products have "backend-123" format)
    const getNumericId = (id: number | string): number => {
        if (typeof id === 'number') return id;
        const match = id.toString().match(/backend-(\d+)/);
        return match ? parseInt(match[1], 10) : parseInt(id, 10) || 0;
    };

    return (
        <div className="p-5 flex flex-col flex-1 space-y-4">
            <div className="flex-1 space-y-2">
                <MenProductTitle name={product.name} />
                <MenProductPrice price={product.price} originalPrice={product.originalPrice} />
            </div>
            <MenStockIndicator />
            <MenAddToCartBtn onClick={(e) => {
                e.stopPropagation();
                addToCart({
                    ...product,
                    id: getNumericId(product.id),
                    quantity: 1,
                    size: 'M'
                });
            }} />
        </div>
    );
}
