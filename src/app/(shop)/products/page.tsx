'use client';

import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Product } from '@/types';
import { useEffect, useState } from 'react';
import Loading from '@/components/pages/Loading';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedCategory = searchParams.get('category') || 'all';

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

    const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

    if (loading) return <Loading />;

    return (
        <section className="product-catalog py-8">
            <h1
            className="header-title my-2.5 text-4xl md:text-5xl font-medium leading-tight tracking-widest">
                El Rincón de Coltrane
            </h1>
            <hr />
            <section className="container p-0  w-full">
                <div className="flex gap-4 justify-center">
                    <button
                    onClick={() => router.push('/products')}
                    className={`btn ${selectedCategory === 'all' ? 'gradient-border' : ''}`}
                    >Todos</button>
                    <button
                    onClick={() => router.push('/products?category=Jazz')}
                    className={`btn ${selectedCategory === 'Jazz' ? 'gradient-border' : ''}`}
                    >Jazz</button>
                    <button
                    onClick={() => router.push('/products?category=Blues')}
                    className={`btn ${selectedCategory === 'Blues' ? 'gradient-border' : ''}`}
                    >Blues</button>
                </div>
            <ProductGrid products={filteredProducts} />
            </section>
        </section>
    );
}