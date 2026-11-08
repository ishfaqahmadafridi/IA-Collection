import React from 'react';
import { useCartStore } from '../../stores/cart/cartStore';

import CartHeader from './CartHeader';
import CartLayout from './CartLayout';

export default function Cart() {
    const totalQuantity = useCartStore((state) => state.getCartTotalQuantity());

    return (
        <div className="min-h-screen bg-background pt-36 pb-20 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8">
                    <CartHeader totalQuantity={totalQuantity} />
                    <CartLayout />
                </div>
            </div>
        </div>
    );
}
