import Link from "next/link";

export default function NotFound() {
    return (
        <div className="not-found-container text-center py-12">
            <h1 className="text-3xl font-bold">Error - Recurso no encontrado!</h1>
            <Link href="/products" className="btn">Volver al catálogo</Link>
        </div>
    );
}