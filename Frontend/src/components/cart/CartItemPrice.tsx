import React from 'react';
import { formatPrice } from '../../lib/utils';
import { CartItemPriceProps } from '../../types/components/cart/cartInterface';

export default function CartItemPrice({ quantity, price, totalPrice }: CartItemPriceProps) {
    return (
        <>
            <div className="hidden md:block text-sm text-muted-foreground font-medium px-4 text-center">
                {quantity} × {formatPrice(price)}
            </div>
            <div className="text-sm md:text-lg font-bold text-foreground text-right min-w-20 md:min-w-30">
                {formatPrice(totalPrice)}
            </div>
        </>
    );
}
