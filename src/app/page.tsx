import Image from 'next/image';
import Link from 'next/link';
import WelcomeText from '@/components/layout/WelcomeText';

export default function Home() {
    return (
        <div className="welcome-container container">
        <div className="welcome-image cover-wrapper hover-vinyl">
            <Link href="/products">
                <Image
                    src="/coltrane.jpg"
                    alt="Coltrane Welcome Image"
                    width={500}
                    height={500}
                    priority
                />
            </Link>
        </div>
        <WelcomeText></WelcomeText>
        <Link href="/products" className="btn" aria-label="Mostrar Productos">
            Mostrar Productos
        </Link>
        </div>
    );
}