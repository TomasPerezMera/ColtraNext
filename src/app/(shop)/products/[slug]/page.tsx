'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { Product } from '@/types';
import ProductDetail from '@/components/products/ProductDetail';
import NotFound from '@/components/pages/Not-Found';
import Loading from '@/components/pages/Loading';


export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
            const res = await fetch(`/api/products?slug=${params.slug}`);
            const data = await res.json();
            if (data.success) {
                setProduct(data.product);
            } else {
                setProduct(null);
            }
            } catch (error) {
            console.error(error);
            setProduct(null);
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