import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/ui/uiStore';
import MenProductImage from './MenProductImage';
import MenProductInfo from './MenProductInfo';
import type { MenProductCardProps } from '../../types/components/catman/catmanInterface';

export default function MenProductCard({ product, showDiscount }: MenProductCardProps) {
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
            <MenProductImage src={product.image} name={product.name} discount={showDiscount ? product.discount : null} />
            <MenProductInfo product={product} />
        </div>
    );
}
