import SkincareHeader from './SkincareHeader';
import SkincareProductsGrid from './SkincareProductsGrid';
import type { SkincareSectionProps } from '../../types/components/catskincare/catskincareInterface';

export default function SkincareSection({ category, backendProducts = [] }: SkincareSectionProps) {
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
            <SkincareHeader name={category.name} heroImage={category.heroImage || 'https://placehold.co/1200x600/f0fdf4/166534?text=Skincare'} />
            <SkincareProductsGrid products={allProducts} />
        </section>
    );
}
