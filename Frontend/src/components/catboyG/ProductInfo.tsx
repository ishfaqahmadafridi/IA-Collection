import type { CatBoyGProduct } from '../../types/components/catboyG/catBoyGInterface';
import AddToCartButton from './AddToCartButton';
import ProductPrice from './ProductPrice';
import ProductTitle from './ProductTitle';
import StockIndicator from './StockIndicator';

type ProductInfoProps = {
    product: CatBoyGProduct;
};

export default function ProductInfo({ product }: ProductInfoProps) {
    return (
        <div className="p-4 flex flex-col flex-1 space-y-3">
            <div className="flex-1 space-y-1">
                <ProductTitle name={product.name} />
                <ProductPrice price={product.price} originalPrice={product.originalPrice} />
            </div>
            <StockIndicator />
            <AddToCartButton />
        </div>
    );
}
