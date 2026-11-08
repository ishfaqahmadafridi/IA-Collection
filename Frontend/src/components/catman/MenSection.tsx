import MenHeader from './MenHeader';
import MenProductsGrid from './MenProductsGrid';
import type { MenSectionProps } from '../../types/components/catman/catmanInterface';

export default function MenSection({ category, backendProducts = [] }: MenSectionProps) {
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
            <MenHeader name={category.name} heroImage={category.heroImage || 'https://placehold.co/1200x600/111827/ffffff?text=Men\'s+Collection'} />
            <MenProductsGrid products={allProducts} />
        </section>
    );
}
