import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartHeader({ totalQuantity }: { totalQuantity: number }) {
    const navigate = useNavigate();

    return (
        <div>
            <button
                onClick={() => navigate('/home')}
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
                ← Continue Shopping
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                Shopping Cart <span className="text-muted-foreground font-light ml-2">({totalQuantity})</span>
            </h1>
        </div>
    );
}
