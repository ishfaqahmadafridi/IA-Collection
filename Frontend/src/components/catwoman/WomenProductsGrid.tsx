import WomenProductCard from './WomenProductCard';
import type { WomenProductsGridProps } from '../../types/components/catwoman/catwomanInterface';

export default function WomenProductsGrid({ products }: WomenProductsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
                <WomenProductCard
                    key={product.id}
                    product={product}
                    showDiscount={index === 0}
                />
            ))}
        </div>
    );
}
