'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { Cart, CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface CartContextType {
    cart: Cart | null;
    cartItemCount: number;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    handlePurchase: () => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const cartItemCount = cart?.products.reduce((sum, item) => sum + item.quantity, 0) || 0;

    async function refreshCart() {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;
        try {
        const cartDoc = await getDoc(doc(db, 'carts', cartId));
        if (cartDoc.exists()) {
            setCart({ id: cartDoc.id, ...cartDoc.data() } as Cart);
        }
        } catch (error) {
        console.error('Error loading cart:', error);
        }
    }

    // Inicializamos Carrito;
    async function loadCart() {
    let cartId = localStorage.getItem('cartId');

    if (!cartId) {
        const newCart: Omit<Cart, 'id'> = {
        userId: '',
        products: [],
        totalPrice: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        };

        const cartRef = await addDoc(collection(db, 'carts'), newCart);
        cartId = cartRef.id;
        localStorage.setItem('cartId', cartId);
        setCart({ id: cartRef.id, ...newCart });
        return;
    }

    try {
        const cartDoc = await getDoc(doc(db, 'carts', cartId));
        if (cartDoc.exists()) {
        setCart({ id: cartDoc.id, ...cartDoc.data() } as Cart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
    }

    useEffect(() => {
        loadCart();
        // Silenciamos advertencia de ESLint puntual;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function addToCart(productId: string, quantity: number) {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) {
        await loadCart();
        return addToCart(productId, quantity);
        }

        try {
        // Obtener producto de Firestore;
        const productDoc = await getDoc(doc(db, 'products', productId));
        if (!productDoc.exists()) {
            toast.error('Producto no encontrado');
            return;
        }

        const product = { id: productDoc.id, ...productDoc.data() } as Product;

        // Validar límite de 3 items;
        const currentTotal = cart?.products.reduce((sum, item) => sum + item.quantity, 0) || 0;
        if (currentTotal + quantity > 3) {
            toast.error('Máximo 3 ítems por compra!');
            return;
        }

        const cartRef = doc(db, 'carts', cartId);
        const existingItem = cart?.products.find(item => item.productId === productId);

        let updatedProducts: CartItem[];

        if (existingItem) {
            // Actualizar cantidad;
            updatedProducts = cart!.products.map(item =>
            item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
        } else {
            // Agregar nuevo item;
            const newItem: CartItem = {
            productId,
            quantity,
            price: product.currentPrice,
            name: product.name,
            coverImageSource: product.coverImageSource,
            };
            updatedProducts = [...(cart?.products || []), newItem];
        }

        const totalPrice = updatedProducts.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await updateDoc(cartRef, {
            products: updatedProducts,
            totalPrice,
            updatedAt: new Date(),
        });

        await refreshCart();
        toast.success(`${quantity} producto(s) añadido(s) al carrito`);
        } catch (error) {
        toast.error('Error al añadir al carrito');
        console.error(error);
        }
    }

    async function updateQuantity(productId: string, newQuantity: number) {
        const cartId = localStorage.getItem('cartId');
        if (!cartId || !cart) return;

        try {
        // Validar límite de 3 items;
        const otherItemsTotal = cart.products
            .filter(item => item.productId !== productId)
            .reduce((sum, item) => sum + item.quantity, 0);

        if (otherItemsTotal + newQuantity > 3) {
            toast.error('Máximo 3 ítems por compra!');
            return;
        }

        const updatedProducts = cart.products.map(item =>
            item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        );

        const totalPrice = updatedProducts.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await updateDoc(doc(db, 'carts', cartId), {
            products: updatedProducts,
            totalPrice,
            updatedAt: new Date(),
        });

        await refreshCart();
        } catch (error) {
        toast.error('Error al actualizar cantidad');
        console.error(error);
        }
    }

    async function removeFromCart(productId: string) {
        const cartId = localStorage.getItem('cartId');
        if (!cartId || !cart) return;

        try {
        const updatedProducts = cart.products.filter(item => item.productId !== productId);
        const totalPrice = updatedProducts.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await updateDoc(doc(db, 'carts', cartId), {
            products: updatedProducts,
            totalPrice,
            updatedAt: new Date(),
        });

        await refreshCart();
        toast.success('Producto eliminado');
        } catch (error) {
        toast.error('Error al eliminar producto');
        console.error(error);
        }
    }

    async function clearCart() {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;

        try {
        await updateDoc(doc(db, 'carts', cartId), {
            products: [],
            totalPrice: 0,
            updatedAt: new Date(),
        });

        await refreshCart();
        toast.success('Carrito vaciado');
        } catch (error) {
        toast.error('Error al vaciar carrito');
        console.error(error);
        }
    }

    async function handlePurchase() {
        // TODO: Verificar autenticación;
        // TODO: Crear ticket en Firestore;
        // TODO: Actualizar stock de productos;
        clearCart();

        toast.success('Función de compra pendiente de implementar');
    }

    return (
        <CartContext.Provider
        value={{
            cart,
            cartItemCount,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            handlePurchase,
            refreshCart,
        }}
        >
        {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart debe usarse dentro de CartProvider!');
    return context;
};