import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white border-t border-amber-500/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 text-center sm:text-left sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-xl font-bold mb-4 tracking-wider uppercase text-amber-500">Boutique</h3>
            <p className="text-primary-200 text-sm max-w-xs">
              Curated quality products for the modern lifestyle. Quality without compromise.
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-white border-b-2 border-amber-500 pb-1">Shop</h4>
            <ul className="space-y-3 text-sm text-primary-200">
              <li><Link href="/products" className="hover:text-amber-500 transition-colors">All Products</Link></li>
              <li><Link href="/products?featured=true" className="hover:text-amber-500 transition-colors">Featured</Link></li>
              <li><Link href="/shop" className="hover:text-amber-500 transition-colors">Shop by Category</Link></li>
              <li><Link href="/cart" className="hover:text-amber-500 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm text-white border-b-2 border-amber-500 pb-1">Contact</h4>
            <div className="space-y-3 text-sm text-primary-200">
              <p>Email: <a href="mailto:info@boutique.com" className="hover:text-amber-500 transition-colors">info@boutique.com</a></p>
              <div className="flex space-x-4 mt-6 justify-center sm:justify-start">
                {/* Simplified social icons for symmetry */}
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                  <span className="text-[10px]">IG</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors cursor-pointer">
                  <span className="text-[10px]">FB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 text-center text-[10px] sm:text-xs text-primary-400 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Boutique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
