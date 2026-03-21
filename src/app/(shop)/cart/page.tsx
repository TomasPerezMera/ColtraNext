'use client';

import { useCart } from '@/context/CartContext';
import CartList from '@/components/cart/CartList';
import Link from 'next/link';

export default function CartPage() {
    const { cart, cartItemCount, clearCart, handlePurchase } = useCart();

    if (!cart || cartItemCount === 0) {
        return (
        <div className="cart-container container">
            <h1 className="product-title">Tu Carrito</h1>
            <hr />
            <p className="product-info product-title text-center my-8">Tu carrito está vacío.</p>
            <Link href="/products" className="btn btn--return">Volver al catálogo</Link>
        </div>
        );
    }

    return (
        <div className="cart-container container">
        <h1 className="product-title">Tu Carrito</h1>
        <hr />
        <CartList items={cart.products} />
        <div className="cart-total product-info mt-8 p-6">
            <h2 className="text-xl md:text-2xl mb-4">Total de ítems: {cartItemCount}</h2>
            <h2 className="text-xl md:text-2xl mb-4">Total a pagar: ${cart.totalPrice.toLocaleString()}</h2>
            <div className="flex flex-wrap gap-4 mt-4">
            <button onClick={clearCart} className="btn gradient-border">Vaciar Carrito</button>
            <button onClick={handlePurchase} className="btn gradient-border">Realizar Compra</button>
            </div>
        </div>
        </div>
    );
}