import type { ProductCardProps } from '../../types/components/catboyG/catBoyGInterface';
import ProductImage from './ProductImage';
import ProductInfo from './ProductInfo';

export default function ProductCard({ product, onClick, showDiscount }: ProductCardProps) {
    return (
        <div
            className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
            onClick={onClick}
        >
            <ProductImage src={product.image} name={product.name} discount={showDiscount ? product.discount : undefined} />
            <ProductInfo product={product} />
        </div>
    );
}
