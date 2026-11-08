import WomenProductTitle from './WomenProductTitle';
import WomenProductPrice from './WomenProductPrice';
import WomenStockIndicator from './WomenStockIndicator';
import WomenAddToCartBtn from './WomenAddToCartBtn';
import type { WomenProductInfoProps } from '../../types/components/catwoman/catwomanInterface';

export default function WomenProductInfo({ product }: WomenProductInfoProps) {
    return (
        <div className="p-6 flex flex-col flex-1 space-y-4">
            <div className="flex-1 space-y-2">
                <WomenProductTitle name={product.name} />
                <WomenProductPrice price={product.price} originalPrice={product.originalPrice} />
            </div>
            <WomenStockIndicator />
            <WomenAddToCartBtn />
        </div>
    );
}
