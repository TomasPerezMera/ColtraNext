'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { CartItem as CartItemType } from '@/types';

export default function CartItem({ item }: { item: CartItemType }) {
    const { updateQuantity, removeFromCart, cart } = useCart();
    const [isUpdating, setIsUpdating] = useState(false);

    const totalItems = cart?.products.reduce((sum, p) => sum + p.quantity, 0) || 0;
    const canIncrease = totalItems < 3;

    const handleIncrease = async () => {
        if (!canIncrease) return;
        setIsUpdating(true);
        await updateQuantity(item.productId, item.quantity + 1);
        setIsUpdating(false);
    };

    const handleDecrease = async () => {
        setIsUpdating(true);
        if (item.quantity === 1) {
        await removeFromCart(item.productId);
        } else {
        await updateQuantity(item.productId, item.quantity - 1);
        }
        setIsUpdating(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-4 items-center p-4 border-b border-violet/20 last:border-0">
        <div className="cover-wrapper hover-vinyl">
            <Image
            src={`/covers/${item.coverImageSource}`}
            alt={item.name}
            width={150}
            height={150}
            />
        </div>

        <div className="space-y-2">
            <h3 className="text-xl font-bold">{item.name}</h3>
            <p>Precio: ${item.price.toLocaleString()}</p>
            <p>Cantidad: {item.quantity}</p>
            <p>Subtotal: ${(item.price * item.quantity).toLocaleString()}</p>
        </div>

        <div className="quantity-controls flex items-center gap-2">
            <button
            onClick={handleDecrease}
            disabled={isUpdating}
            className="btn cart-btn-minus"
            >
            -
            </button>
            <span className="cart-qty-display">{item.quantity}</span>
            <button
            onClick={handleIncrease}
            disabled={isUpdating || !canIncrease}
            className="btn cart-btn-plus"
            >
            +
            </button>
            <button
            onClick={() => removeFromCart(item.productId)}
            className="btn btn--danger"
            >
            Eliminar
            </button>
        </div>
        </div>
    );
}