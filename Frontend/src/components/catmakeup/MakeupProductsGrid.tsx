import MakeupProductCard from './MakeupProductCard';
import type { MakeupProductsGridProps } from '../../types/components/catmakeup/catmakeupInterface';

export default function MakeupProductsGrid({ products }: MakeupProductsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
                <MakeupProductCard
                    key={product.id}
                    product={product}
                    showDiscount={index === 0}
                />
            ))}
        </div>
    );
}
