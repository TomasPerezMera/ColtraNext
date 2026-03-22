'use client';

import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';
import { useEffect, useState } from 'react';


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    async function load() {
        try {
            const snap = await getDocs(collection(db, 'products'));
            const data = snap.docs.map(d => ({
            id: d.id,
            ...d.data()
            })) as Product[];
            setProducts(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
        }
        load();
    }, []);

    if (loading) return <div>Cargando...</div>;
    return (
        <section className="product-catalog py-8">
            <h1
            className="header-title my-2.5 text-4xl md:text-5xl font-medium leading-tight tracking-widest">
                El Rincón de Coltrane
            </h1>
            <hr />
            <div className="product-catalog-container container">
                <div className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
                </div>
            </div>
        </section>
    );
}