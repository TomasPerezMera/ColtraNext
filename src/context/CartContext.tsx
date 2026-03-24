'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, collection, addDoc, runTransaction, DocumentReference  } from 'firebase/firestore';
import { Cart, CartItem, Product } from '@/types';
import toastHelper from '@/helpers/toastHelper';
import { auth } from '@/lib/firebase/config';
import router from 'next/router';


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

const toast = toastHelper();

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
        toast.error("Error: " + error);
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
        toast.error('Error cargando el carrito: ' + error);
    }
    }

    useEffect(() => {
        loadCart();
        // Silenciamos advertencia de ESLint puntual;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function addToCart(productId: string, quantity: number) {
        let cartId = localStorage.getItem('cartId');
        // Si no hay cartId, crear carrito primero;
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
        }

        try {
            // 1. Leer carrito actual desde Firestore;
            const cartRef = doc(db, 'carts', cartId);
            const cartDoc = await getDoc(cartRef);

            if (!cartDoc.exists()) {
                toast.error('Error: carrito no encontrado!');
                return;
            }
            const currentCart = { id: cartDoc.id, ...cartDoc.data() } as Cart;

            // 2. Obtener producto de Firestore;
            const productDoc = await getDoc(doc(db, 'products', productId));
            if (!productDoc.exists()) {
                toast.error('Error: Producto no encontrado!');
                return;
            }

            const product = { id: productDoc.id, ...productDoc.data() } as Product;

            // 3. Validar límite de 3 items;
            const currentTotal = currentCart.products.reduce((sum, item) => sum + item.quantity, 0);
            if (currentTotal + quantity > 3) {
                toast.error('Error - Límite de ítems excedido!');
                return;
            }

            // 4. Calcular productos actualizados;
            const existingItem = currentCart.products.find(item => item.productId === productId);
            let updatedProducts: CartItem[];

            if (existingItem) {
                // Actualizar cantidad;
                updatedProducts = currentCart.products.map(item =>
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
                updatedProducts = [...currentCart.products, newItem];
            }

            const totalPrice = updatedProducts.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            // 5. Escribir a Firestore;
            await updateDoc(cartRef, {
                products: updatedProducts,
                totalPrice,
                updatedAt: new Date(),
            });

            // 6. Actualizar estado local para UI;
            const newCartState = {
                ...currentCart,
                products: updatedProducts,
                totalPrice,
                updatedAt: new Date(),
            };
            setCart(newCartState);

            toast.default(`${quantity} producto(s) añadido(s) al carrito!`);
        } catch (error) {
            toast.error('Error al añadir al carrito: ' + error);
        }
    }

    async function updateQuantity(productId: string, newQuantity: number) {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;

        try {
            // 1. Leer carrito actual desde Firestore;
            const cartRef = doc(db, 'carts', cartId);
            const cartDoc = await getDoc(cartRef);
            if (!cartDoc.exists()) return;

            const currentCart = { id: cartDoc.id, ...cartDoc.data() } as Cart;

            // 2. Validar límite de 3 items;
            const otherItemsTotal = currentCart.products
                .filter(item => item.productId !== productId)
                .reduce((sum, item) => sum + item.quantity, 0);

            if (otherItemsTotal + newQuantity > 3) {
                toast.error('Máximo 3 ítems por compra!');
                return;
            }

            // 3. Calcular productos actualizados;
            const updatedProducts = currentCart.products.map(item =>
                item.productId === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );

            const totalPrice = updatedProducts.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            // 4. Escribir a Firestore;
            await updateDoc(cartRef, {
                products: updatedProducts,
                totalPrice,
                updatedAt: new Date(),
            });

            // 5. Actualizar estado local;
            setCart({
                ...currentCart,
                products: updatedProducts,
                totalPrice,
                updatedAt: new Date(),
            });
        } catch (error) {
            toast.error('Error al actualizar cantidad: ' + error);
        }
    }

    async function removeFromCart(productId: string) {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;

        try {
            // 1. Leer carrito actual desde Firestore;
            const cartRef = doc(db, 'carts', cartId);
            const cartDoc = await getDoc(cartRef);
            if (!cartDoc.exists()) return;

            const currentCart = { id: cartDoc.id, ...cartDoc.data() } as Cart;

            // 2. Calcular productos actualizados;
            const updatedProducts = currentCart.products.filter(item => item.productId !== productId);
            const totalPrice = updatedProducts.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            // 3. Escribir a Firestore;
            await updateDoc(cartRef, {
                products: updatedProducts,
                totalPrice,
                updatedAt: new Date(),
            });

            // 4. Actualizar estado local;
            setCart({
                ...currentCart,
                products: updatedProducts,
                totalPrice,
                updatedAt: new Date(),
            });

            toast.default('Producto Eliminado!');
        } catch (error) {
            toast.error('Error al eliminar producto: ' + error);
        }
    }

    async function clearCart() {
        const cartId = localStorage.getItem('cartId');
        if (!cartId) return;

        try {
            const cartRef = doc(db, 'carts', cartId);

            await updateDoc(cartRef, {
                products: [],
                totalPrice: 0,
                updatedAt: new Date(),
            });

            setCart(prev => prev ? {
                ...prev,
                products: [],
                totalPrice: 0,
                updatedAt: new Date(),
            } : null);

            toast.default('Carrito Vaciado!');
        } catch (error) {
            toast.error('Error al vaciar carrito: ' + error);
        }
    }

    async function handlePurchase() {
        const user = auth.currentUser;
        if (!user) {
            toast.error('Iniciá sesión para comprar');
            window.location.href = '/login';
            return;
        }
        if (!cart || cart.products.length === 0) {
            toast.error('Carrito vacío');
            return;
        }
        try {
            await runTransaction(db, async (transaction) => {
            // 1. Verificar stock de todos los productos
            for (const item of cart.products) {
                const productRef = doc(db, "products", item.productId);
                const productSnap = await transaction.get(productRef);

                if (!productSnap.exists()) {
                throw new Error(`Producto no existe: ${item.name}`);
                }

                const data = productSnap.data();
                if (data.stock < item.quantity) {
                throw new Error(`Stock insuficiente para ${item.name}`);
                }
            }

            // 2. Reducir stock
            for (const item of cart.products) {
                const productRef = doc(db, "products", item.productId);
                const productSnap = await transaction.get(productRef);

                const data = productSnap.data() as { stock: number };
                const currentStock = data.stock;

                transaction.update(productRef, {
                stock: currentStock - item.quantity,
                });
            }

            // 3. Crear ticket de la transacción
            let ticketId = "";

            await runTransaction(db, async (transaction) => {
            const productsData = new Map<
                string,
                { ref: DocumentReference; stock: number; quantity: number }
            >();

            // 1. READS (todos juntos)
            for (const item of cart.products) {
                const ref = doc(db, "products", item.productId);
                const snap = await transaction.get(ref);

                if (!snap.exists()) {
                throw new Error(`Producto no existe: ${item.name}`);
                }

                const data = snap.data() as { stock: number };

                if (data.stock < item.quantity) {
                throw new Error(`Stock insuficiente: ${item.name}`);
                }

                productsData.set(item.productId, {
                ref,
                stock: data.stock,
                quantity: item.quantity,
                });
            }

            // 2. WRITES (sin más gets)
            for (const [, value] of productsData) {
                transaction.update(value.ref, {
                stock: value.stock - value.quantity,
                });
            }

            const ticketRef = doc(collection(db, "tickets"));
            ticketId = ticketRef.id;

            transaction.set(ticketRef, {
                code: `TICKET-${Date.now()}`,
                purchaseDateTime: new Date(),
                amount: cart.totalPrice,
                purchaserEmail: user.email!,
                products: cart.products.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    })),
                });
            });

            // Luego de la transacción;
            await clearCart();
            toast.default('Compra exitosa!');
            router.push(`/checkout?ticket=${ticketId}`);
        })} catch (error) {
            toast.error('Error procesando compra: ' + error);
            }
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