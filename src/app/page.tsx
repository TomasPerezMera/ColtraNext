import Image from 'next/image';
import Link from 'next/link';
import WelcomeText from '@/components/layout/WelcomeText';
import FeaturedProducts from '@/components/products/FeaturedProducts';

export default function Home() {
    return (
        <div className="welcome-container container flex flex-col items-center gap-8 py-8">
            <div className="welcome-image cover-wrapper hover-vinyl w-[80%] max-w-md aspect-square">
                <Link href="/products">
                    <Image
                        src="/static/coltrane.jpg"
                        alt="Coltrane Welcome Image"
                        width={300}
                        height={300}
                        priority
                    />
                </Link>
            </div>
            <WelcomeText></WelcomeText>
            {/* <FeaturedProducts /> */}
            <Link href="/products" className="btn" aria-label="Mostrar Productos">
                Mostrar Productos
            </Link>
        </div>
    );
}