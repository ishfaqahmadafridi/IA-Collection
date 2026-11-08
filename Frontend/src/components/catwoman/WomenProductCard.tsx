import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/ui/uiStore';
import WomenProductImage from './WomenProductImage';
import WomenProductInfo from './WomenProductInfo';
import type { WomenProductCardProps } from '../../types/components/catwoman/catwomanInterface';

export default function WomenProductCard({ product, showDiscount }: WomenProductCardProps) {
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
            <WomenProductImage src={product.image} name={product.name} discount={showDiscount ? product.discount : null} />
            <WomenProductInfo product={product} />
        </div>
    );
}
