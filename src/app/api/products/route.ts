import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from '@/lib/firebase/config';
import isAdmin from "@/helpers/isAdminHelper";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");
        const category = searchParams.get("category");

        // Priorizamos búsqueda por Slug antes de retornar lista entera de Products;
        if (slug) {
            const q = query(
                collection(db, "products"),
                where("slug", "==", slug)
            );
            const snap = await getDocs(q);
            if (snap.empty) {
                return NextResponse.json(
                { success: false, error: "Producto no encontrado!" },
                { status: 404 }
                );
            }
            const doc = snap.docs[0];
            return NextResponse.json({
                success: true,
                product: { id: doc.id, ...doc.data() },
            });
        }

        // Retorno de catálogo completo;
        let q;
        if (category && category !== "all") {
        q = query(
            collection(db, "products"),
            where("category", "==", category)
            );
        } else {
        q = collection(db, "products");
        }

        const snap = await getDocs(q);
        const products = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        }));

        return NextResponse.json({ success: true, products });

    } catch (error) {
        return NextResponse.json(
        { success: false, error: String(error) },
        { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { uid, ...productData } = body;

        if (!uid || !(await isAdmin(uid))) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 403 }
            );
        }

        const slug = productData.name.toLowerCase().replace(/\s+/g, "-");
        const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        slug,
        isAvailable: true,
        createdAt: new Date(),
        });

        return NextResponse.json({
        success: true,
        id: docRef.id,
        });
    } catch (error) {
        return NextResponse.json(
        { success: false, error: String(error) },
        { status: 500 }
        );
    }
}