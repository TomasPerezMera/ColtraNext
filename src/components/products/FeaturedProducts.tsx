'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch('/api/products?limit=8')
            .then(res => res.json())
            .then(data => setProducts(data.products))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="featured-section py-12">
            <h2 className="text-3xl font-bold text-center mb-8">
                Vinilos Destacados
            </h2>

            <div className="carousel-container overflow-x-auto snap-x snap-mandatory flex gap-6 px-4 pb-4 scrollbar-hide">
                {products.map(product => (
                    <Link
                        href={`/products/${product.slug}`}
                        key={product.id}
                        className="carousel-item snap-center shrink-0 w-64 group"
                    >
                        <div className="product-card bg-darkViolet rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105">
                            <div className="aspect-square relative">
                                <Image
                                    src={`/static/covers/${product.coverImageSource}`}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg truncate">{product.name}</h3>
                                <p className="text-sm text-gray-300">{product.artist}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}