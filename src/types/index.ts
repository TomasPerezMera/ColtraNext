export interface Product {
    id: string;
    name: string;
    artist: string;
    currentPrice: number;
    coverImageSource: string;
    stock: number;
    slug: string;
    description: string;
    category: string;
    isAvailable: boolean;
    createdAt?: Date;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    age?: number;
    role: 'user' | 'admin';
    cartId?: string;
    githubId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Cart {
    id: string;
    userId: string;
    products: CartItem[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
    name: string;
    coverImageSource: string;
}

export interface Ticket {
    id: string;
    code: string;
    purchaseDateTime: Date;
    amount: number;
    purchaserEmail: string;
    products: Array<{
        name: string;
        quantity: number;
        price: number;
    }>
}