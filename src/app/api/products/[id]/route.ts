import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const docSnap = await getDoc(doc(db, 'products', params.id));
        if (!docSnap.exists()) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, product: { id: docSnap.id, ...docSnap.data() } });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}