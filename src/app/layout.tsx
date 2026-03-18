import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'El Rincón de Coltrane',
    description: 'Vinilos de jazz legendarios',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
    <html lang="es">
        <body>
        <Navbar />
        {children}
        </body>
    </html>
    );
}