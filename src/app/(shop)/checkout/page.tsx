'use client';

import { Suspense } from 'react';
import CheckoutContent from '@/components/layout/CheckoutContent';
import Loading from '@/components/pages/Loading';


export default function CheckoutPage() {
    return (
        <Suspense fallback={< Loading />}>
            <CheckoutContent />
        </Suspense>
    );
}