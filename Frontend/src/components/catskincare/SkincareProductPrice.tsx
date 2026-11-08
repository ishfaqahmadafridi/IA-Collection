import { formatPrice } from '../../lib/utils';
import type { SkincareProductPriceProps } from '../../types/components/catskincare/catskincareInterface';

export default function SkincareProductPrice({ price, originalPrice }: SkincareProductPriceProps) {
    return (
        <div className="flex items-center gap-3">
            <span className={`text-base md:text-xl font-black ${originalPrice ? 'text-emerald-600' : 'text-foreground'}`}>
                {formatPrice(price)}
            </span>
            {originalPrice && (
                <span className="text-xs text-gray-400 line-through decoration-emerald-200">{formatPrice(originalPrice)}</span>
            )}
        </div>
    );
}
