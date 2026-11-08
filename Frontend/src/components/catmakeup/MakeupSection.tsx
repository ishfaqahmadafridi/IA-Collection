import MakeupHeader from './MakeupHeader';
import MakeupProductsGrid from './MakeupProductsGrid';
import type { MakeupSectionProps } from '../../types/components/catmakeup/catmakeupInterface';

export default function MakeupSection({ category, backendProducts = [] }: MakeupSectionProps) {
    // Format API fields for the product cards.
    const formattedBackendProducts = backendProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        originalPrice: product.original_price ? Number(product.original_price) : undefined,
        discount: product.discount ? `${product.discount}% OFF` : undefined,
        image: product.image || 'https://placehold.co/400x600',
        isBackend: true,
    }));

    const allProducts = formattedBackendProducts;

    return (
        <section className="space-y-8">
            <MakeupHeader name={category.name} heroImage={category.heroImage || 'https://placehold.co/1200x600/fdf2f8/831843?text=Makeup'} />
            <MakeupProductsGrid products={allProducts} />
        </section>
    );
}
