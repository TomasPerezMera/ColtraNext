'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';


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
        toast.success('Bienvenido!');
        router.push('/products');
        } catch (error) {
        toast.error('Credenciales inválidas!' + error);
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

                <div className="auth-alternative">
                <p>¿No tenés cuenta?</p>
                <Link href="/register" className="btn">Registrarse</Link>
                </div>
            </div>
        </div>
    );
}