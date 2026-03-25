'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { Ticket } from '@/types';
import toastHelper from '@/helpers/toastHelper';
import router from 'next/router';
import Loading from '@/components/layout/loading';

const toast = toastHelper();


export default function CheckoutPage() {
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
    }, [ticketId]);

    if (loading) return <Loading />;
    if (!ticket) return(
        <>
            <div className="container">Ticket no encontrado!</div>
            <Link href="/products" className="btn" aria-label="Regresar al Catálogo">
                Regresar al Catálogo
            </Link>
        </>
    )

    return (
        <div className="auth-container">
            <div className="auth-card reverse-gradient-border">
                <h1 className="auth-title">Compra Exitosa!</h1>

                <div className="product-info">
                <p><strong>Código: </strong>{ticket.code}</p>
                <p><strong>Email: </strong>{ticket.purchaserEmail}</p>
                <p><strong>Total: </strong>${ticket.amount}</p>
                <p><strong>Fecha: </strong>{ticket.purchaseDateTime.toLocaleString()}</p>

                <hr className="my-4" />

                <h3 className="text-xl mb-2">Productos:</h3>
                {ticket.products.map((item, idx) => (
                    <p key={idx}>
                    {item.name} x{item.quantity} - ${item.price * item.quantity}
                    </p>
                ))}
                </div>

                <div className="form-actions">
                    <Link href="/products" className="btn gradient-border">
                        Volver al catálogo
                    </Link>
                </div>
            </div>
        </div>
    );
}