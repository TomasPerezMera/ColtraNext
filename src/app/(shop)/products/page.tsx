'use client';

import ProductCatalogContent from "@/components/products/ProductCatalogContent";
import { Suspense } from 'react';
import Loading from "@/components/pages/Loading";


export default function ProductsPage() {
    return (
        <section className="product-catalog py-8">
            <h1
            className="header-title my-2.5 text-4xl md:text-5xl font-medium leading-tight tracking-widest">
                El Rincón de Coltrane
            </h1>
            <hr />
            <Suspense fallback={<Loading />}>
                <ProductCatalogContent />
            </Suspense>
        </section>
    );
}