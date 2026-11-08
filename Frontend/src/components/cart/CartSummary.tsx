import React from 'react';
import CartSummaryRow from './CartSummaryRow';
import CartCheckoutBtn from './CartCheckoutBtn';
import { CartSummaryProps } from '../../types/components/cart/cartInterface';

export default function CartSummary({ subtotal, totalQuantity }: CartSummaryProps) {
    return (
        <div className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-md sticky top-32 transition-colors duration-500">
            <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm md:text-base">
                <CartSummaryRow label={`Subtotal (${totalQuantity} items)`} value={subtotal} />
                <CartSummaryRow label="Estimated total" value={subtotal} isBold isLarge />
            </div>
            <CartCheckoutBtn />
        </div>
    );
}
