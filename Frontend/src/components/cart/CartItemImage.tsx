import React from 'react';
import { CartItemImageProps } from '../../types/components/cart/cartInterface';

export default function CartItemImage({ src, name }: CartItemImageProps) {
    return (
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
            <img
                src={src || 'https://via.placeholder.com/80'}
                alt={name}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
