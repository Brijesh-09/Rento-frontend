"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Products", href: "/products" },
  { label: "Get a Quote", href: "/quote" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50" style={{ backgroundColor: "#F7F4EF", borderBottom: "1px solid #D4C9B0" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="group">
            <span className="font-display text-2xl tracking-tight" style={{ color: "#1C1C1A", fontFamily: "'DM Serif Display', Georgia, serif" }}>
              FURNR
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}
                className={cn("text-sm tracking-wide transition-colors duration-150",
                  pathname === n.href ? "text-charcoal font-medium" : "text-warm-gray hover:text-charcoal"
                )}
                style={{ color: pathname === n.href ? "#1C1C1A" : "#8A8680" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/quote" className="relative">
              <div className="w-9 h-9 flex items-center justify-center rounded-sm transition-colors hover:bg-[#EAE3D2]">
                <ShoppingBag style={{ width: 18, height: 18, color: "#1C1C1A" }} />
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                  style={{ background: "#C8913A", color: "#F7F4EF" }}>
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
            <button className="md:hidden w-9 h-9 flex items-center justify-center rounded-sm hover:bg-[#EAE3D2] transition-colors"
              onClick={() => setOpen(!open)}>
              {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 pt-16 md:hidden" style={{ backgroundColor: "#F7F4EF" }}>
          <nav className="flex flex-col p-6 gap-0">
            {[{ label: "Home", href: "/" }, ...NAV].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                className="py-5 border-b text-3xl transition-colors hover:text-[#C8913A]"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", borderColor: "#D4C9B0", color: "#1C1C1A" }}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
