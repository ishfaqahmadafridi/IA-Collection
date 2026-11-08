import MenProductCard from './MenProductCard';
import type { MenProductsGridProps } from '../../types/components/catman/catmanInterface';

export default function MenProductsGrid({ products }: MenProductsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
                <MenProductCard
                    key={product.id}
                    product={product}
                    showDiscount={index === 0}
                />
            ))}
        </div>
    );
}
