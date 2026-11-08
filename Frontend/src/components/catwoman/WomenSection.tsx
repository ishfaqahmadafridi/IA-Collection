import WomenHeader from './WomenHeader';
import WomenProductsGrid from './WomenProductsGrid';
import type { WomenSectionProps } from '../../types/components/catwoman/catwomanInterface';

export default function WomenSection({ category, backendProducts = [] }: WomenSectionProps) {
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
            <WomenHeader name={category.name} heroImage={category.heroImage || 'https://placehold.co/1200x600/fecaca/000000?text=Women\'s+Collection'} />
            <WomenProductsGrid products={allProducts} />
        </section>
    );
}
