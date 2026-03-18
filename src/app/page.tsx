import Image from 'next/image';
import Link from 'next/link';


export default function Home() {
    return (
        <div className="welcome-container container">
        <div className="welcome-image cover-wrapper hover-vinyl">
            <Link href="/products">
            <Image
                src="/coltrane.jpg"
                alt="Coltrane Welcome Image"
                width={600}
                height={600}
                priority
            />
            </Link>
        </div>
        <div className="welcome-text">
            <p>
                <b>Hola!</b>
                <br></br>
                Llegaste al Rincón de Coltrane.
            </p>
            <p>
                Un pequeño, pero valioso rincón de Internet, donde podrás adquirir algunos de los álbumes más célebres del legendario saxofonista en formato de vinilo.
            </p>
            <p>
                A continuación, procederemos a listar los ítems disponibles. Debido al stock limitado, se permite un máximo de 3 vinilos por compra - elegí con cuidado!
            </p>
        </div>
        <Link href="/products" className="btn" aria-label="Mostrar Productos">
            Mostrar Productos
        </Link>
        </div>
    );
}