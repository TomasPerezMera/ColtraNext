import { getDoc, doc, } from "firebase/firestore";
import { db } from '@/lib/firebase/config';

// Helper Function para proteger rutas Admin;
export default async function isAdmin(uid: string) {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) return false;
    const data = userDoc.data() as { role?: string };
    return data.role === "admin";
}

// Credenciales Cuenta Admin Coder:
// Usuario: admincoder@coderhouse.com
// Password: admincoder