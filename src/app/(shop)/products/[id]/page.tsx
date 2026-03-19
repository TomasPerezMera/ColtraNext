import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ProductActions from '@/components/products/ProductActions';
import type { Product } from '@/types';

async function getProduct(id: string): Promise<Product | null> {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return { id: docSnap.id, ...docSnap.data() } as Product;
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);

    if (!product) notFound();

    return (
        <section className="product-detail">
        <div className="cover-wrapper hover-vinyl">
            <Image
            src={`/covers/${product.coverImageSource}`}
            alt={product.name}
            width={400}
            height={400}
            className="product-detail-image"
            />
        </div>

        <div className="product-detail-headers">
            <p><strong>Artista:</strong> {product.artist}</p>
            <p><strong>Precio:</strong><span className="product-price"> ${product.currentPrice}</span></p>
            <p><strong>Categoría:</strong> {product.category}</p>
            <p><strong>Stock:</strong> {product.stock} unidades</p>
        </div>

        <div className="product-info">
            &nbsp;
            <p>{product.description}</p>
            &nbsp;
        </div>

        <hr />

        <ProductActions productId={product.id} maxStock={product.stock} />
        </section>
    );
}