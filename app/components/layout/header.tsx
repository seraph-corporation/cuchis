"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-amber-500 bg-amber-900 shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="h-10 max-w-[100px] w-auto overflow-hidden relative flex items-center">
              <embed
                src="/peak11111.pdf#toolbar=0&navpanes=0&scrollbar=0&zoom=page-fit&view=FitH"
                type="application/pdf"
                className="h-full w-full pointer-events-none object-contain invert"
                style={{
                  overflow: "hidden",
                  border: "none",
                  display: "block",
                }}
                aria-label="Boutique Logo"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden space-x-8 lg:flex">
          <Link href="/" className="text-sm font-bold uppercase tracking-widest text-white hover:text-beige-200 transition-colors">Home</Link>
          <Link href="/shop" className="text-sm font-bold uppercase tracking-widest text-white hover:text-beige-200 transition-colors">Shop</Link>
          <Link href="/products" className="text-sm font-bold uppercase tracking-widest text-white hover:text-beige-200 transition-colors">All Products</Link>
          <Link href="/products?featured=true" className="text-sm font-bold uppercase tracking-widest text-white hover:text-beige-200 transition-colors">Featured</Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-5">
          <Link href="/search" className="p-2 text-white hover:text-beige-200 transition-colors active:scale-90" aria-label="Search">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          <Link href="/cart" className="p-2 text-white hover:text-beige-200 transition-colors active:scale-90" aria-label="Cart">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="p-2 text-white hover:text-beige-200 lg:hidden transition-colors active:scale-90"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="lg:hidden border-t border-amber-500 bg-amber-900 px-4 py-6 shadow-inner animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-lg font-bold uppercase tracking-[0.2em] text-white py-3 border-b border-white/10 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-lg font-bold uppercase tracking-[0.2em] text-white py-3 border-b border-white/10 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/products"
              className="text-lg font-bold uppercase tracking-[0.2em] text-white py-3 border-b border-white/10 text-center"
              onClick={() => setMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              href="/products?featured=true"
              className="text-lg font-bold uppercase tracking-[0.2em] text-white py-3 border-b border-white/10 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Featured Collections
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
