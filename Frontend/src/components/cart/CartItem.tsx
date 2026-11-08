import React from 'react';
import CartItemImage from './CartItemImage';
import CartItemDetails from './CartItemDetails';
import CartItemPrice from './CartItemPrice';
import CartItemRemove from './CartItemRemove';
import { CartItemProps } from '../../types/components/cart/cartInterface';

export default function CartItem({ item }: CartItemProps) {
    return (
        <div className="flex items-center gap-4 p-4 md:p-6 transition-colors hover:bg-gray-50 border-b last:border-b-0">
            <CartItemImage src={item.image} name={item.name} />
            <CartItemDetails name={item.name} size={item.size} price={item.price} quantity={item.quantity} />
            <CartItemPrice quantity={item.quantity} price={item.price} totalPrice={item.totalPrice} />
            <CartItemRemove id={item.id} size={item.size} />
        </div>
    );
}
