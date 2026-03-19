import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, 'products'));
        const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
        }));
        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}