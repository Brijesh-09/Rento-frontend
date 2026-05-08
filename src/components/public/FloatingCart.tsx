"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { usePathname } from "next/navigation";

export function FloatingCart() {
  const { totalItems, items } = useCart();
  const pathname = usePathname();

  // Don't show on the quote page itself, or on admin pages
  if (pathname === "/quote" || pathname.startsWith("/admin") || totalItems === 0) return null;

  return (
    <Link href="/quote"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 shadow-lg transition-all hover:shadow-xl active:scale-95 md:hidden"
      style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF" }}>
      <div className="relative">
        <ShoppingBag style={{ width: 18, height: 18 }} />
        <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full"
          style={{ backgroundColor: "#C8913A", color: "#F7F4EF" }}>
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      </div>
      <span className="text-xs font-medium uppercase tracking-wider" style={{ letterSpacing: "0.08em" }}>
        View Quote ({items.reduce((s, i) => s + i.quantity, 0)} items)
      </span>
    </Link>
  );
}
