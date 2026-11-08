import { useCartStore } from '../../stores/cart/cartStore';
import FragranceProductTitle from './FragranceProductTitle';
import FragranceProductPrice from './FragranceProductPrice';
import FragranceStockIndicator from './FragranceStockIndicator';
import FragranceAddToCartBtn from './FragranceAddToCartBtn';
import type { FragranceProductInfoProps } from '../../types/components/catfragrance/catfragranceInterface';

export default function FragranceProductInfo({ product }: FragranceProductInfoProps) {
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        addToCart({ ...product, quantity: 1, size: 'OS' });
    };

    return (
        <div className="p-5 flex flex-col flex-1 space-y-4">
            <div className="flex-1 space-y-2">
                <FragranceProductTitle name={product.name} />
                <FragranceProductPrice price={product.price} originalPrice={product.originalPrice} />
            </div>
            <FragranceStockIndicator />
            <FragranceAddToCartBtn onClick={handleAddToCart} />
        </div>
    );
}
