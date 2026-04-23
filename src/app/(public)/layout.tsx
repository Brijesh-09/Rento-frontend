import { PublicNavbar } from "@/components/public/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-sand mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <p className="font-display text-xl mb-3">FURNR</p>
            <p className="text-sm text-warm-gray leading-relaxed">Premium event furniture rentals delivered to your venue across India.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-medium mb-4 text-warm-gray">Quick Links</p>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-ochre transition-colors">Browse Products</a></li>
              <li><a href="/quote" className="hover:text-ochre transition-colors">Request a Quote</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-medium mb-4 text-warm-gray">Contact</p>
            <p className="text-sm text-warm-gray">hello@furnr.in</p>
            <p className="text-sm text-warm-gray">+91 98765 43210</p>
          </div>
        </div>
        <div className="border-t border-sand px-6 py-4 max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-xs text-warm-gray">© 2024 FURNR Rentals</p>
          <p className="text-xs text-warm-gray">Mumbai, India</p>
        </div>
      </footer>
    </div>
  );
}
