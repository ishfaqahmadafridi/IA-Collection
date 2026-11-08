import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/ui/uiStore';
import MakeupProductImage from './MakeupProductImage';
import MakeupProductInfo from './MakeupProductInfo';
import type { MakeupProductCardProps } from '../../types/components/catmakeup/catmakeupInterface';

export default function MakeupProductCard({ product, showDiscount }: MakeupProductCardProps) {
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
            <MakeupProductImage src={product.image} name={product.name} discount={showDiscount ? product.discount : null} />
            <MakeupProductInfo product={product} />
        </div>
    );
}
