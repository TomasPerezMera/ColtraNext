import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import '@/styles/globals.css';
import { CartProvider } from '@/context/CartContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const metadata: Metadata = {
    title: 'El Rincón de Coltrane',
    description: 'Vinilos de Jazz y Blues Legendarios!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
    <html lang="es">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
        <body className="bg-black text-white min-h-screen">
            <CartProvider>
                <Navbar />
                {children}
                <ToastContainer />
            </CartProvider>
        </body>
    </html>
    );
}