'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toastHelper from '@/helpers/toastHelper';

const toast = toastHelper();

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Crear doc en Firestore;
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email,
            firstName,
            lastName,
            role: 'user',
            createdAt: new Date(),
        });

        toast.default('Cuenta creada!');
        router.push('/products');
        } catch (error) {
        toast.error('Error al registrarse: ' + error);
        } finally {
        setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

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

            toast.default('Cuenta creada con éxito!');
            router.push('/products');
        } catch (error) {
            toast.error('Error con Google: ' + error);
        } finally {
            setLoading(false);
            }
        }

    return (
        <div className="auth-container">
            <div className="auth-card gradient-border">
                <h1 className="auth-title">Registrarse</h1>

                <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-input"
                    required
                    />
                </div>

                <div className="form-group">
                    <label>Apellido</label>
                    <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-input"
                    required
                    />
                </div>

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
                    minLength={6}
                    required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn gradient-border">
                    {loading ? 'Cargando...' : 'Crear Cuenta'}
                    </button>
                </div>
                </form>
                <hr className='h-1' />
                <div className="auth-alternative">
                    <div>
                        <p>O continuar con:</p>
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="btn--google"
                        >Google</button>
                    </div>
                    <div>
                        <p>¿Ya tenés cuenta?</p>
                        <Link href="/login" className="btn">Iniciar Sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}