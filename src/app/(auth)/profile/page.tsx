'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import toastHelper from '@/helpers/toastHelper';
import Link from 'next/link';
import Loading from '@/components/pages/Loading';
import NotFound from '@/components/pages/Not-Found';

const toast = toastHelper();

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    age?: number;
    role: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
            router.push('/login');
            return;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
        }
        setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    async function handleLogout() {
        try {
        await signOut(auth);
        toast.default('Sesión Cerrada');
        router.push('/');
        } catch (error) {
        toast.error('Error al cerrar sesión: ' + error);
        }
    }

    if (loading) return <Loading />;
    if (!userData) return <NotFound />;

    return(
        <div className="auth-container container grid grid-cols-1 my-2 w-full md:w-auto">
            <h1 className="header-title my-0">Mi Perfil</h1>
            <hr />
            <div className="auth-card space-y-8">
                <section className="info-block gradient-border my-4">
                    <h2 className="profile-section-title product-title my-1">Información Personal</h2>
                        <p><strong>Nombre: </strong>{userData.firstName} {userData.lastName}</p>
                        <p><strong>Email: </strong>{userData.email}</p>
                        {userData.age && <p><strong>Edad: </strong>{userData.age}</p>}
                        <p><strong>Rol: </strong>{userData.role}</p>
                </section>
                <section className="profile-actions info-block reverse-gradient-border m-4 p-4 flex-row">
                    <button onClick={handleLogout} className="btn btn--danger">
                        Cerrar Sesión
                    </button>
                    <div className="btn--return">
                        <Link href="/" className="btn w-full">Volver al Inicio</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}