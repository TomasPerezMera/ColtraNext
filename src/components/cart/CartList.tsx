'use client';

import { CartItem as CartItemType } from '@/types';
import CartItem from './CartItem'

export default function CartList({ items }: { items: CartItemType[] }) {
    return (
        <div className="cart-items-container gradient-border container my-4 p-5">
        {items.map((item) => (
            <CartItem key={item.productId} item={item} />
        ))}
        </div>
    );
}