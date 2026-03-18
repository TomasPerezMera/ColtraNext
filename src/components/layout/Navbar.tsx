'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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
        <nav className="navbar">
            <Link href="/" className="navbar-logo">
            <Image src="/favicon.ico" alt="Coltrane" width={40} height={40} />
            </Link>

            <button
            className={`hamburger ${isOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Menu"
            >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
            </svg>
            </button>

            <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
            <Link href="/products" className="btn navbar-btn" onClick={closeMenu}>
                Productos
            </Link>
            <Link href="/profile" className="btn navbar-btn" onClick={closeMenu}>
                Mi Cuenta
            </Link>
            <Link href="/cart" className="btn nav-cart-btn navbar-btn" onClick={closeMenu}>
                🛒 <span className="cart-count">0</span>
            </Link>
            </div>
        </nav>

        {isOpen && <div className="navbar-overlay active" onClick={closeMenu} />}
        </>
    );
}