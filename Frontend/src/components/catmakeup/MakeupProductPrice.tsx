import { formatPrice } from '../../lib/utils';
import type { MakeupProductPriceProps } from '../../types/components/catmakeup/catmakeupInterface';

export default function MakeupProductPrice({ price, originalPrice }: MakeupProductPriceProps) {
    return (
        <div className="flex items-center gap-3">
            <span className={`text-base md:text-xl font-bold ${originalPrice ? 'text-pink-600' : 'text-foreground'}`}>
                {formatPrice(price)}
            </span>
            {originalPrice && (
                <span className="text-xs text-gray-400 line-through decoration-pink-300">{formatPrice(originalPrice)}</span>
            )}
        </div>
    );
}
