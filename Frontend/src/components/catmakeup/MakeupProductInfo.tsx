import { useCartStore } from '../../stores/cart/cartStore';
import MakeupProductTitle from './MakeupProductTitle';
import MakeupProductPrice from './MakeupProductPrice';
import MakeupStockIndicator from './MakeupStockIndicator';
import MakeupAddToCartBtn from './MakeupAddToCartBtn';
import type { MakeupProductInfoProps } from '../../types/components/catmakeup/catmakeupInterface';

export default function MakeupProductInfo({ product }: MakeupProductInfoProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    return (
        <div className="p-5 flex flex-col flex-1 space-y-4">
            <div className="flex-1 space-y-2">
                <MakeupProductTitle name={product.name} />
                <MakeupProductPrice price={product.price} originalPrice={product.originalPrice} />
            </div>
            <MakeupStockIndicator />
            <MakeupAddToCartBtn onClick={(e) => {
                e.stopPropagation();
                addToCart({ ...product, quantity: 1, size: 'Standard' });
            }} />
        </div>
    );
}
