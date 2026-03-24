import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <article className="product-card gradient-border grid grid-rows-[auto_1fr_auto] gap-4 p-5">
        <div className="cover-wrapper hover-vinyl">
            <Link href={`/products/${product.slug}`}>
            <Image
                src={`/static/covers/${product.coverImageSource}`}
                alt={product.name}
                width={300}
                height={300}
            />
            </Link>
        </div>

        <div className="product-detail-titles">
            <h2 className="product-title">
                {product.name}
            </h2>
            <p className="product-detail-headers">Precio: ${product.currentPrice}</p>
        </div>

        <Link href={`/products/${product.slug}`} className="btn gradient-border">
            Ver detalle
        </Link>
        </article>
    );
}