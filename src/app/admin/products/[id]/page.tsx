'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/config';
import { useParams, useRouter } from 'next/navigation';
import toastHelper from '@/helpers/toastHelper';
import Loading from '@/components/pages/Loading';
import isAdmin from '@/helpers/isAdminHelper';

const toast = toastHelper();

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const user = auth.currentUser;

    const [formData, setFormData] = useState({
        name: '',
        artist: '',
        description: '',
        currentPrice: 0,
        stock: 0,
        category: 'Jazz',
        coverImageSource: '',
        createdAt: '' as string | null
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
            router.push('/login');
            return;
            }
            if (!(await isAdmin(user.uid))) {
            toast.error('Acceso Denegado!');
            router.push('/');
            return;
            }
        });
        return () => unsubscribe();
        }, [router]);

    // Cargar producto por ID;
    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/products/${params.id}`);
                const data = await res.json();
                if (data.success && data.product) {
                setFormData(prev => ({
                    ...prev,
                    ...data.product,
                    }));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
                }}
            load();
    }, [params.id]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/products/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    uid: user?.uid,
                    }),
                });
            const data = await res.json();
            if (data.success) {
            router.push('/admin/products');
            toast.default('Producto Actualizado!');
        } else {
            throw new Error(data.error);
        }} catch (error) {
        toast.error('Error al actualizar: ' + error);
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="container">
        <h1 className="auth-title">Editar Producto</h1>

        <div className="auth-card max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <label>Nombre</label>
                <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="form-input"
                required
                />
            </div>

            <div className="form-group">
                <label>Artista</label>
                <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({...formData, artist: e.target.value})}
                className="form-input"
                required
                />
            </div>

            <div className="form-group">
                <label>Descripción</label>
                <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-input"
                rows={3}
                required
                />
            </div>

            <div className="form-group">
                <label>Precio</label>
                <input
                type="number"
                value={formData.currentPrice}
                onChange={(e) => setFormData({...formData, currentPrice: Number(e.target.value)})}
                className="form-input"
                required
                />
            </div>

            <div className="form-group">
                <label>Stock</label>
                <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                className="form-input"
                required
                />
            </div>

            <div className="form-group">
                <label>Categoría</label>
                <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="form-input bg-darkViolet text-white"
                style={{
                    colorScheme: 'dark'
                }}
                >
                <option value="Jazz">Jazz</option>
                <option value="Blues">Blues</option>
                </select>
            </div>

            <div className="form-group">
                <label>Imagen (filename)</label>
                <input
                type="text"
                value={formData.coverImageSource}
                onChange={(e) => setFormData({...formData, coverImageSource: e.target.value})}
                className="form-input"
                required
                />
            </div>

            <div className="form-group">
                <label>Fecha de Creación</label>
                <input
                    type="datetime-local"
                    value={formData.createdAt
                        ? new Date(formData.createdAt).toISOString().slice(0, 10)
                        : ''
                    }
                    onChange={(e) => setFormData({
                        ...formData,
                        createdAt: e.target.value ? new Date(e.target.value).toISOString() : null
                    })}
                    className="form-input"
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn gradient-border">
                Guardar Cambios
                </button>
                <button
                type="button"
                onClick={() => router.push('/admin/products')}
                className="btn"
                >
                Cancelar
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}