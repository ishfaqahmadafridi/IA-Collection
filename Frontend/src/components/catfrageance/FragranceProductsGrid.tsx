import FragranceProductCard from './FragranceProductCard';
import type { FragranceProductsGridProps } from '../../types/components/catfragrance/catfragranceInterface';

export default function FragranceProductsGrid({ products }: FragranceProductsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
                <FragranceProductCard
                    key={product.id}
                    product={product}
                    showDiscount={index === 0}
                />
            ))}
        </div>
    );
}
