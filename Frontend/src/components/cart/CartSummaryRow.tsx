import React from 'react';
import { formatPrice } from  '../../lib/utils';
import { CartSummaryRowProps } from '../../types/components/cart/cartInterface';

export default function CartSummaryRow({ label, value, isBold, isLarge, isItalic, border = true }: CartSummaryRowProps) {
    const labelClasses = isBold ? "font-bold text-foreground" : "text-muted-foreground";
    const valueClasses = `${isBold ? "font-bold text-foreground" : "font-medium text-foreground"} ${isItalic ? "text-gray-400 italic" : ""}`;
    const containerClasses = `flex justify-between ${isLarge ? "text-lg pt-2" : "pb-4"} ${border && !isLarge ? "border-b border-border" : ""}`;

    return (
        <div className={containerClasses}>
            <span className={labelClasses}>{label}</span>
            <span className={valueClasses}>{typeof value === 'number' ? formatPrice(value) : value}</span>
        </div>
    );
}
