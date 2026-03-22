'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { cartItemCount } = useCart();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    useEffect(() => {
        // Bloquear scroll cuando el menú está abierto;
        document.body.style.overflow = isOpen ? 'hidden' : '';

        // ESC key cierra el menú;
        const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) closeMenu();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    return (
        <>
        <nav className="flex items-center justify-between gap-4 py-2.5 px-5 w-[90%] max-w-7xl mx-auto relative">
            <Link href="/" className="navbar-logo flex items-center justify-center z-[1001]">
                <Image
                    src="/favicon.ico"
                    alt="Coltrane"
                    width={50}
                    height={50}
                    loading="eager"
                    className='h-10 w-auto object-contain transition-transform duration-200 hover:scale-105'
                />
            </Link>

            <button
            className={`hamburger ${isOpen ? 'active' : ''} flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2 z-[1001] md:hidden` }
            onClick={toggleMenu}
            aria-label="Menu"
            >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
            </svg>
            </button>

            <div className={`navbar-menu ${isOpen ? 'right-0' : '-right-full'} fixed top-0 -right-full w-[70%] max-w-[300px] h-screen bg-black/95 backdrop-blur-md flex flex-col gap-6 pt-20 px-8 pb-8 transition-all duration-300 z-[1000] md:static md:right-0 md:w-auto md:h-auto md:flex-row md:bg-transparent md:backdrop-blur-none md:p-0`}>
            <Link href="/products" className="btn navbar-btn" onClick={closeMenu}>
                Productos
            </Link>
            <Link href="/profile" className="btn navbar-btn" onClick={closeMenu}>
                Mi Cuenta
            </Link>
            <Link href="/cart" className="btn nav-cart-btn navbar-btn" onClick={closeMenu}>
                🛒 <span className="cart-count">{cartItemCount}</span>
            </Link>
            </div>
        </nav>
        {isOpen && <div className="fixed inset-0 bg-black/70 z-[999]" onClick={closeMenu} />}
        </>
    );
}