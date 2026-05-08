"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard",  href: "/admin",           icon: LayoutDashboard },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Products",   href: "/admin/products",   icon: Package },
  { label: "Quotes",     href: "/admin/quotes",     icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-52 shrink-0 flex-col" style={{ backgroundColor: "#1C1C1A", borderRight: "1px solid #2E2E2B" }}>
      {/* Logo */}
      <div className="h-14 flex items-center px-5" style={{ borderBottom: "1px solid #2E2E2B" }}>
        <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 20, color: "#F7F4EF", letterSpacing: "-0.02em" }}>
          FURNR
        </span>
        <span className="ml-2 text-[9px] uppercase tracking-widest" style={{ color: "#8A8680" }}>Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150 rounded-sm"
              style={{
                backgroundColor: active ? "#2E2E2B" : "transparent",
                color: active ? "#F7F4EF" : "#8A8680",
              }}>
              <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: "1px solid #2E2E2B" }}>
        <Link href="/" target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs rounded-sm transition-colors"
          style={{ color: "#8A8680" }}>
          <ExternalLink style={{ width: 12, height: 12 }} />
          Public site
        </Link>
      </div>
    </aside>
  );
}
