import type { ApiProduct } from '../../types/api';
import type { CatBoyGCategory, CatBoyGProduct } from '../../types/components/catboyG/catBoyGInterface';
import CategoryHeader from './CategoryHeader';
import ProductsGrid from './ProductsGrid';

type CategorySectionProps = {
    category: CatBoyGCategory;
    onProductClick: (product: CatBoyGProduct) => void;
    backendProducts?: ApiProduct[];
};

export default function CategorySection({ category, onProductClick, backendProducts = [] }: CategorySectionProps) {
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
            <CategoryHeader name={category.name} heroImage={category.heroImage} />
            <ProductsGrid products={allProducts} onProductClick={onProductClick} />
        </section>
    );
}
