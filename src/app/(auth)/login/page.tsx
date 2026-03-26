'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toastHelper from '@/helpers/toastHelper';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const toast = toastHelper();

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
        await signInWithEmailAndPassword(auth, email, password);
        toast.default('Bienvenido!');
        router.push('/products');
        } catch (error) {
        toast.error('Credenciales inválidas!' + error);
        } finally {
        setLoading(false);
        }
    }

    async function handleGoogleLogin() {
    setLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Crear/actualizar doc Firestore
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
            email: result.user.email,
            firstName: result.user.displayName?.split(' ')[0] || 'Usuario',
            lastName: result.user.displayName?.split(' ')[1] || '',
            role: 'user',
            createdAt: new Date(),
        });
        }

        toast.default('Bienvenido!');
        router.push('/products');
        } catch (error) {
            toast.error('Error con Google: ' + error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card reverse-gradient-border">
                <h1 className="auth-title">Iniciar Sesión</h1>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                        required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" disabled={loading} className="btn gradient-border">
                        {loading ? 'Cargando...' : 'Ingresar'}
                        </button>
                    </div>
                </form>
                <hr />
                <div className="auth-alternative">
                    <div>
                        <p>O continuar con:</p>
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="btn--google flex-1 min-w-[45%]"
                        >Google</button>
                    </div>
                    <div>
                        <p>¿No tenés cuenta?</p>
                        <Link href="/register" className="btn flex-1 min-w-[45%]">Registrarse</Link>
                    </div>
                </div>
                <hr />
            </div>
        </div>
    );
}