import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/ui/uiStore';
import FragranceProductImage from './FragranceProductImage';
import FragranceProductInfo from './FragranceProductInfo';
import type { FragranceProductCardProps } from '../../types/components/catfragrance/catfragranceInterface';

export default function FragranceProductCard({ product, showDiscount }: FragranceProductCardProps) {
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
            <FragranceProductImage src={product.image} name={product.name} discount={showDiscount ? product.discount : null} />
            <FragranceProductInfo product={product} />
        </div>
    );
}
