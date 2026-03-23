import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
    return (
        <div className="notFound">
            <section className="title404">
                <h2 className="product-title">404 - Página No Encontrada!</h2>
            </section>
            <section className="body404">
                <p className="mx-auto w-[70%] text-center">
                    Parece que la página que estás buscando no existe. Por favor, volvé a la <Link href="/">página principal</Link> y seguí explorando nuestro catálogo.
                </p>
            </section>
            <figure className="coltrane404 hover-vinyl cover-wrapper w-[40%] mx-auto my-6">
                <Link href="/">
                    <Image
                    src="/static/coltrane404.jpg"
                    alt="Coltrane Not Found"
                    width={400}
                    height={400}
                    priority
                    />
                </Link>
            </figure>
        </div>
    )
}