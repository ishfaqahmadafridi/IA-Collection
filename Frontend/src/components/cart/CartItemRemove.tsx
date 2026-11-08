import React from 'react';
import { useCartStore } from '../../stores/cart/cartStore';
import { CartItemRemoveProps } from '../../types/components/cart/cartInterface';

export default function CartItemRemove({ id, size }: CartItemRemoveProps) {
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    return (
        <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all ml-2"
            onClick={() => removeFromCart({ id, size })}
            aria-label="Remove item"
        >
            ×
        </button>
    );
}
