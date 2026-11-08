import SkincareProductCard from './SkincareProductCard';
import type { SkincareProductsGridProps } from '../../types/components/catskincare/catskincareInterface';

export default function SkincareProductsGrid({ products }: SkincareProductsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
                <SkincareProductCard
                    key={product.id}
                    product={product}
                    showDiscount={index === 0}
                />
            ))}
        </div>
    );
}
