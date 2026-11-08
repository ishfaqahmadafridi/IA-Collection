import React from 'react';

import CartList from './CartList';
import CartSummary from './CartSummary';
import { useCartStore } from '../../stores/cart/cartStore';

export default function CartLayout() {
    const items = useCartStore((state) => state.items);
    const subtotal = useCartStore((state) => state.getCartSubtotal());
    const totalQuantity = useCartStore((state) => state.getCartTotalQuantity());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2">
                <CartList items={items} />
            </div>
            {items.length > 0 && (
                <CartSummary subtotal={subtotal} totalQuantity={totalQuantity} />
            )}
        </div>
    );
}
