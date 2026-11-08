import FragranceHeader from './FragranceHeader';
import FragranceProductsGrid from './FragranceProductsGrid';
import type { FragranceSectionProps } from '../../types/components/catfragrance/catfragranceInterface';

export default function FragranceSection({ category, backendProducts = [] }: FragranceSectionProps) {
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
            <FragranceHeader name={category.name} heroImage={category.heroImage || 'https://placehold.co/1200x600/fef3c7/000000?text=Fragrances'} />
            <FragranceProductsGrid products={allProducts} />
        </section>
    );
}
