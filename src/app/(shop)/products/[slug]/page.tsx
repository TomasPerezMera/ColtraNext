'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import type { Product } from '@/types';
import ProductDetail from '@/components/products/ProductDetail';
import NotFound from '../../../../components/layout/not-found';
import Loading from '../../../../components/layout/loading';


export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    async function load() {
        try {
            const snap = await getDocs(collection(db, 'products'));
            const found = snap.docs.find(doc => doc.data().slug === params.slug);
            if (found) {
                setProduct({ id: found.id, ...found.data() } as Product);
                } else {
                setProduct(null);
                }
        } finally {
        setLoading(false);
        }
    }
    load();
    }, [params.slug]);
    if (loading) return <Loading />;
    if (!product) return <NotFound />;

    return <ProductDetail product={product} />;
}