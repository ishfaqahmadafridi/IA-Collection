import type { CartListProps } from '../../types/components/cart/cartInterface';
import React from 'react';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';

export default function CartList({ items }: CartListProps) {
    if (items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden divide-y divide-border transition-colors duration-500">
            {items.map(item => (
                <CartItem key={`${item.id}-${item.size}`} item={item} />
            ))}
        </div>
    );
}
