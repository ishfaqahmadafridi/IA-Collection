import { formatPrice } from '../../lib/utils';
import type { MenProductPriceProps } from '../../types/components/catman/catmanInterface';

export default function MenProductPrice({ price, originalPrice }: MenProductPriceProps) {
    return (
        <div className="flex items-center gap-3">
            <span className={`text-base md:text-xl font-black ${originalPrice ? 'text-rose-600' : 'text-foreground'}`}>
                {formatPrice(price)}
            </span>
            {originalPrice && (
                <span className="text-xs text-gray-400 line-through decoration-gray-400">{formatPrice(originalPrice)}</span>
            )}
        </div>
    );
}
