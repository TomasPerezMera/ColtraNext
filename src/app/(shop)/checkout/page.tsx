'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import { Ticket } from '@/types';


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
            setTicket(ticketDoc.data() as Ticket);
        }
        setLoading(false);
        }
        loadTicket();
    }, [ticketId]);

    if (loading) return <div className="container">Cargando...</div>;
    if (!ticket) return <div className="container">Ticket no encontrado!</div>;

    return (
        <div className="auth-container">
            <div className="auth-card">
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