'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductActions({ productId, maxStock }: { productId: string; maxStock: number }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const decrease = () => setQuantity(prev => Math.max(1, prev - 1));
    const increase = () => setQuantity(prev => Math.min(Math.min(maxStock, 3), prev + 1));

    const handleAddToCart = async () => {
        await addToCart(productId, quantity);
    };

    return (
        <div className="detail-actions flex flex-wrap gap-3 my-2 px-4">
            <div className="quantity-selector flex gap-4 w-full md:w-auto">
                <button className="btn qty-btn-detail qty-btn-minus" onClick={decrease}>-</button>
                <span className="qty-value">{quantity}</span>
                <button className="btn qty-btn-detail qty-btn-plus" onClick={increase}>+</button>
            </div>
            <Link href="/products" className="btn">Volver al catálogo</Link>
            <button
                className="add-to-cart btn gradient-border"
                onClick={handleAddToCart}
            >
                Agregar al carrito
            </button>
        </div>
    );
}