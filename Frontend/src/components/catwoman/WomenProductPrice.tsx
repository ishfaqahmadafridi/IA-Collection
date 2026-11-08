import { formatPrice } from '../../lib/utils';
import type { WomenProductPriceProps } from '../../types/components/catwoman/catwomanInterface';

export default function WomenProductPrice({ price, originalPrice }: WomenProductPriceProps) {
    return (
        <div className="flex items-center gap-3">
            <span className={`text-base md:text-xl font-black ${originalPrice ? 'text-rose-600' : 'text-foreground'}`}>
                {formatPrice(price)}
            </span>
            {originalPrice && (
                <span className="text-xs text-gray-400 line-through decoration-rose-300">{formatPrice(originalPrice)}</span>
            )}
        </div>
    );
}
