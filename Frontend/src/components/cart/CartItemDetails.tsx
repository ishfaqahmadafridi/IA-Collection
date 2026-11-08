import React from 'react';
import { formatPrice } from '../../lib/utils';
import { CartItemDetailsProps } from '../../types/components/cart/cartInterface';

export default function CartItemDetails({ name, size, price, quantity }: CartItemDetailsProps) {
    return (
        <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base font-semibold text-foreground truncate">{name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Size: {size}</p>
            <div className="mt-1 md:hidden text-xs font-medium text-muted-foreground">
                {quantity} × {formatPrice(price)}
            </div>
        </div>
    );
}
