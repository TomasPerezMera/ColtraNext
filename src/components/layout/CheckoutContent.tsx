import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Ticket } from '@/types';
import router from 'next/router';
import Loading from '@/components/pages/Loading';


import toastHelper from '@/helpers/toastHelper';
import Link from 'next/link';

const toast = toastHelper();

export default function CheckoutContent() {
    const searchParams = useSearchParams();
    const ticketId = searchParams.get('ticket');
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTicket() {
        if (!ticketId) return;

        const ticketDoc = await getDoc(doc(db, 'tickets', ticketId));
        if (ticketDoc.exists()) {
            setTicket({ id: ticketDoc.id, ...(ticketDoc.data() as Omit<Ticket, "id">) });
        }
        if (!ticketDoc.exists()) {
            toast.error("Error - Ticket ID No Existe!")
            toast.error("Redirigiendo...")
            setTimeout(() => { router.push(`/products`) }, 2000);
        }
        setLoading(false);
        }
        loadTicket();
        toast.purchase("Gracias por confiar en el Rincón de Coltrane!")
        toast.purchase("Esperamos que disfrutes tus vinilos - volvé pronto!")
    }, [ticketId]);

    if (loading) return <Loading />;
    if (!ticket) return(
        <div className='container text-center my-6 p-6'>
            <p className="text-2xl font-bold my-4">
                Ticket no encontrado!
            </p>
            <Link href="/products" className="btn" aria-label="Regresar al Catálogo">
                Regresar al Catálogo
            </Link>
        </div>
    )

    return (
        <div className="auth-container">
            <div className="auth-card reverse-gradient-border text-xl">
                <h1 className="product-title">Compra Exitosa!</h1>

                <div className="product-info space-y-4">
                <p className="font-bold"><strong>Código: </strong>{ticket.code}</p>
                <p className='break-words'><strong>Email: </strong>{ticket.purchaserEmail}</p>
                <p><strong>Total: </strong>${ticket.amount.toLocaleString()}</p>
                <p><strong>Fecha: </strong>{ticket.purchaseDateTime.toDate().toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",})}</p>

                <hr className="my-4" />

                <h3 className="text-xl mb-2">Productos:</h3>
                {ticket.products.map((item, idx) => (
                    <p className='text-center text-2xl' key={idx}>
                    {item.name} x {item.quantity} - ${(item.price * item.quantity).toLocaleString()}
                    </p>
                ))}
                </div>

                <div className="form-actions">
                    <Link href="/products" className="btn gradient-border my-6">
                        Volver al catálogo
                    </Link>
                </div>
            </div>
        </div>
    );
}