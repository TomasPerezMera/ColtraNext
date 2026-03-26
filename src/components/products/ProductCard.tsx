import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <article className="product-card gradient-border grid grid-rows-[auto_1fr_auto] gap-4 p-5">
        <div className="cover-wrapper hover-vinyl max-h-80 mx-auto">
            <Link href={`/products/${product.slug}`}>
            <Image
                src={`/static/covers/${product.coverImageSource}`}
                alt={product.name}
                width={300}
                height={300}
                className='w-full aspect-square object-cover md:aspect-auto rounded-xl'
            />
            </Link>
        </div>

        <div className="product-detail-titles">
            <h2 className="product-title">
                {product.name}
            </h2>
        </div>
        <p className="product-price mb-6">${product.currentPrice.toLocaleString()}</p>
        <Link href={`/products/${product.slug}`} className="btn gradient-border">
            Ver Detalle
        </Link>
        </article>
    );
}