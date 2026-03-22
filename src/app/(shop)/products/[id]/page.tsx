'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import type { Product } from '@/types';
import ProductDetail from '@/components/products/ProductDetail';
import NotFound from './not-found';
import Loading from './loading';


export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
        try {
            const docSnap = await getDoc(doc(db, 'products', params.id as string));
            if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
        }
        load();
    }, [params.id]);

    if (loading) return <Loading />;
    if (!product) return <NotFound />;

    return <ProductDetail product={product} />;
}