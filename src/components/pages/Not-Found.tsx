import Link from "next/link";

export default function NotFound() {
    return (
        <div className="not-found-container text-center my-6 p-6">
            <h1 className="text-3xl font-bold my-4">Error - Recurso no encontrado!</h1>
            <Link href="/products" className="btn" aria-label="Regresar al Catálogo">Volver al catálogo</Link>
        </div>
    );
}