import Link from "next/link";

export default function NotFound() {
    return (
        <div className="text-center py-12">
        <h1 className="text-3xl font-bold">Producto no encontrado!</h1>
        <Link href="/products" className="btn">Volver al catálogo</Link>
        </div>
    );
}