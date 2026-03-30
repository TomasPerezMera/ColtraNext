import Image from "next/image"
import ProductActions from "./ProductActions"
import { Product } from "@/types"

export default function ProductDetail({ product }: { product: Product }) {
    return (
    <section className="product-detail-container w-[90%] max-w-7xl mx-auto my-8 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.5),0_0_20px_rgba(61,5,152,0.6)]">
        <div className="product-detail-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="cover-wrapper hover-vinyl product-detail-image md:sticky md:top-6 md:self-start">
                <Image
                src={
                    product.coverImageSource.startsWith('http')
                    ? product.coverImageSource
                    : `/static/covers/${product.coverImageSource}`
                }
                alt={product.name}
                width={400}
                height={400}
                className="w-full rounded-xl"
                />
            </div>
            <div className="product-detail flex flex-col gap-5 mt-5">
                <h1 className="product-title product-detail-title">
                    {product.name}
                </h1>
                <div className="product-detail-headers">
                    <p ><strong>Artista: </strong>{product.artist}</p>
                    <p><strong>Precio: </strong>
                        <span className="product-price">${product.currentPrice.toLocaleString()}</span>
                    </p>
                    <p><strong>Categoría: </strong>{product.category}</p>
                    <p><strong>Stock: </strong>{product.stock} unidades</p>
                </div>
                <div className="product-info">
                    <p>
                        {product.description
                        .replace(/\\n/g, "\n")
                        .replace(/\r\n/g, "\n")}
                    </p>
                </div>
                <hr />
                <ProductActions productId={product.id} maxStock={product.stock} />
            </div>
        </div>
    </section>
    );
}