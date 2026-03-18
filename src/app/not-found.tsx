import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
    return (
        <div className="notFound">
            <section className="title404">
                <h2>404 - Página No Encontrada!</h2>
            </section>
            <section className="body404">
                <p>
                    Parece que la página que estás buscando no existe. Por favor, volvé a la <Link href="/">página principal</Link> y seguí explorando nuestro catálogo.
                </p>
            </section>
            <figure className="coltrane404">
                <Link href="/">
                    <Image
                    src="/src/public/static/coltrane404.jpg"
                    alt="Coltrane Not Found"
                    width={500}
                    height={500}
                    priority
                    />
                </Link>
            </figure>
        </div>
    )
}