import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '@/lib/firebase/config';
import isAdmin from "@/helpers/isAdminHelper";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
    ) {
    const { id } = await context.params;

    try {
        const docSnap = await getDoc(doc(db, "products", id));

        if (!docSnap.exists()) {

        return NextResponse.json(
            { success: false, error: "Producto No Encontrado!" },
            { status: 404 }
            );
        }
        const data = docSnap.data();

        let createdAtSerialized = null;

        if (data.createdAt) {
            // Manejamos dos tipos de datos para CreatedAt ya que Firebase
            // lo cambia de tipo al modificarse la fecha de un producto;
            if (typeof data.createdAt.toDate === 'function') {
                createdAtSerialized = data.createdAt.toDate().toISOString();
            }
            else if (typeof data.createdAt === 'string') {
                createdAtSerialized = data.createdAt;
            }
            // Y si se guardó un Date nativo de JS, por las dudas;
            else if (data.createdAt instanceof Date) {
                createdAtSerialized = data.createdAt.toISOString();
            }
        }

        const serializedProduct = {
            id: docSnap.id,
            ...data,
            createdAt: createdAtSerialized
        };

        return NextResponse.json({
        success: true,
        product: serializedProduct,
        });
    } catch (error) {
        console.log(error)
        return NextResponse.json(
        { success: false, error: String(error) },
        { status: 500 }
        );
    }
}


export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
    ) {
    const { id } = await context.params;

    try {
        const body = await req.json();
        const { uid, ...formData } = body;
        if (!uid || !(await isAdmin(uid))) {
        return NextResponse.json(
            { success: false, error: "No Autorizado!" },
            { status: 403 }
            );
        }
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
        return NextResponse.json(
            { success: false, error: "Producto no encontrado!" },
            { status: 404 }
            );
        }
        const slug = formData.name.toLowerCase().replace(/\s+/g, "-");
        await updateDoc(productRef, {
            ...formData,
            slug,
            isAvailable: formData.stock > 0,
            });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
        { success: false, error: String(error) },
        { status: 500 }
        );
    }
}


export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
    ) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    const { id } = await context.params;

    if (!uid || !(await isAdmin(uid))) {
        return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
        );
    }

    try {
        await deleteDoc(doc(db, "products", id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: String(error) },
            { status: 500 }
        );
    }
}