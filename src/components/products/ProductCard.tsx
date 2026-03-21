import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <article className="product-card gradient-border grid grid-rows-[auto_1fr_auto] gap-4 p-5">
        <div className="cover-wrapper hover-vinyl">
            <Link href={`/products/${product.id}`}>
            <Image
                src={`/covers/${product.coverImageSource}`}
                alt={product.name}
                width={300}
                height={300}
            />
            </Link>
        </div>

        <div className="product-detail-titles">
            <h2 className="product-title my-6 text-center text-2xl md:text-3xl font-medium tracking-wide leading-tight">
                {product.name}
            </h2>
            <p className="text-sm md:text-base">Artista: {product.artist}</p>
            <p className="text-sm md:text-base">Precio: ${product.currentPrice}</p>
        </div>

        <Link href={`/products/${product.id}`} className="btn gradient-border">
            Ver detalle
        </Link>
        </article>
    );
}