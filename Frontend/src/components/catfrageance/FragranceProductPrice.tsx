import { formatPrice } from '../../lib/utils';
import type { FragranceProductPriceProps } from '../../types/components/catfragrance/catfragranceInterface';

export default function FragranceProductPrice({ price, originalPrice }: FragranceProductPriceProps) {
    return (
        <div className="flex items-center gap-3">
            <span className={`text-base md:text-xl font-black ${originalPrice ? 'text-amber-600' : 'text-foreground'}`}>
                {formatPrice(price)}
            </span>
            {originalPrice && (
                <span className="text-xs text-gray-400 line-through decoration-red-400">{formatPrice(originalPrice)}</span>
            )}
        </div>
    );
}
