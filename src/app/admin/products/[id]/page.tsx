'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loading from '@/components/pages/Loading';

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [formData, setFormData] = useState({
        name: '',
        artist: '',
        description: '',
        currentPrice: 0,
        stock: 0,
        category: 'Jazz',
        coverImageSource: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
            router.push('/login');
            return;
        }

        // Cargar producto;
        const productDoc = await getDoc(doc(db, 'products', productId));
        if (productDoc.exists()) {
            const data = productDoc.data();
            setFormData({
            name: data.name,
            artist: data.artist,
            description: data.description,
            currentPrice: data.currentPrice,
            stock: data.stock,
            category: data.category,
            coverImageSource: data.coverImageSource,
            });
        }
        setLoading(false);
        });

        return () => unsubscribe();
    }, [router, productId]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
        const slug = formData.name.toLowerCase().replace(/\s+/g, '-');

        await updateDoc(doc(db, 'products', productId), {
            ...formData,
            slug,
            isAvailable: formData.stock > 0,
        });

        toast.success('Producto actualizado');
        router.push('/admin/products');
        } catch (error) {
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
                className="form-input"
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