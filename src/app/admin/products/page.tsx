'use client';

import { useState, useEffect } from 'react';
import { auth, } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import toastHelper from '@/helpers/toastHelper';
import isAdmin from '@/helpers/isAdminHelper';
import Loading from '@/components/pages/Loading';

const toast = toastHelper();

type Product = {
    id: string;
    name: string;
    stock: number;
};

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        artist: '',
        description: '',
        currentPrice: 0,
        stock: 0,
        slug: '',
        category: 'Jazz',
        coverImageSource: '',
    });

    const user = auth.currentUser;

    async function loadProducts() {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products);
    }

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

            await loadProducts();
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    if (loading) return <Loading />;


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                uid: user?.uid,
                }),
            });
            const data = await res.json();
            if (data.success) {
            toast.default("Producto Creado!");
            setFormData({
                name: "",
                artist: "",
                description: "",
                currentPrice: 0,
                stock: 0,
                slug: "",
                category: "Jazz",
                coverImageSource: "",
            });
            loadProducts();
            } else {
            throw new Error(data.error);
            }
        } catch (error) {
            toast.error("Error al crear producto: " + error);
            }
        }

    async function handleDelete(id: string) {
        if (!confirm("¿Eliminar producto?")) return;
        try {
            const res = await fetch(`/api/products/${id}?uid=${user?.uid}`, {
            method: "DELETE",
            });
            const data = await res.json();
            if (data.success) {
            toast.default("Producto Eliminado!");
            loadProducts();
            } else {
            throw new Error(data.error);
            }
        } catch (error) {
            toast.error("Error al eliminar producto: " + error);
        }
    }

    return (
        <div className="container">
            <h1 className="auth-title">Admin - Productos</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                <div className="auth-card reverse-gradient-border h-fit">
                <h2 className="product-title my-4">Crear Producto</h2>

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
                    <label>Slug</label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
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
                        <option value="Jazz" className='bg-darkViolet'>Jazz</option>
                        <option value="Blues" className='bg-darkViolet'>Blues</option>
                    </select>
                    </div>

                    <div className="form-group">
                    <label>Imagen (filename)</label>
                    <input
                        type="text"
                        value={formData.coverImageSource}
                        onChange={(e) => setFormData({...formData, coverImageSource: e.target.value})}
                        className="form-input"
                        placeholder="blue-train.jpg"
                        required
                    />
                    </div>

                    <button type="submit" className="btn gradient-border my-6">
                    Crear Producto
                    </button>
                </form>
                </div>

                <div className='gradient-border px-4'>
                    <h2 className="product-title my-4">Productos Existentes:</h2>
                    {products.map(product => (
                        <div key={product.id} className="product-card danger-gradient-border mx-auto p-1 text-center gap-0">
                        <h3 className='product-price my-2'>{product.name}</h3>
                        <p>Stock: {product.stock}</p>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => router.push(`/admin/products/${product.id}`)}
                                className="btn gradient-border"
                            >Editar</button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                className="btn btn--danger p-1 my-1 min-h-1"
                            >Eliminar</button>
                        </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}