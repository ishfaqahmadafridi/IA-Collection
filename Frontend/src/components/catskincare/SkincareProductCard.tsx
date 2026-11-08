import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/ui/uiStore';
import SkincareProductImage from './SkincareProductImage';
import SkincareProductInfo from './SkincareProductInfo';
import type { SkincareProductCardProps } from '../../types/components/catskincare/catskincareInterface';

export default function SkincareProductCard({ product, showDiscount }: SkincareProductCardProps) {
    const setSelectedProduct = useUiStore((state) => state.setSelectedProduct);
    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedProduct(product);
        navigate(`/product/${product.id}`);
    };

    return (
        <div
            className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col h-full"
            onClick={handleClick}
        >
            <SkincareProductImage src={product.image} name={product.name} discount={showDiscount ? product.discount : null} />
            <SkincareProductInfo product={product} />
        </div>
    );
}
