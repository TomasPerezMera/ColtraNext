import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import '@/styles/globals.css';
import { CartProvider } from '@/context/CartContext';


export const metadata: Metadata = {
    title: 'El Rincón de Coltrane',
    description: 'Vinilos de Jazz Legendarios!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
    <html lang="es">
        <body>
        <CartProvider>
            <Navbar />
            {children}
        </CartProvider>
        </body>
    </html>
    );
}