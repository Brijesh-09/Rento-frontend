"use client";
import { useEffect, useState } from "react";
import { Package, Tag, FileText, Users, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn, STATUS_COLORS, STATUS_LABELS, formatDate } from "@/lib/utils";
import type { Quote } from "@/types";

interface Stats { categories: number; products: number; quotes: number; users: number }

export default function AdminDashboard() {
  const [stats,   setStats]   = useState<Stats>({ categories: 0, products: 0, quotes: 0, users: 0 });
  const [recent,  setRecent]  = useState<Quote[]>([]);
  const [seeding, setSeeding] = useState(false);

  async function load() {
    const [cats, prods, quotes, users] = await Promise.allSettled([
      api.categories.list(),
      api.products.list({ limit: 1 }),
      api.quotes.list({ limit: 6 }),
      api.users.list(),
    ]);
    setStats({
      categories: cats.status    === "fulfilled" ? cats.value.data.length : 0,
      products:   prods.status   === "fulfilled" ? (prods.value.meta?.pagination?.total ?? 0) : 0,
      quotes:     quotes.status  === "fulfilled" ? (quotes.value.meta?.pagination?.total ?? 0) : 0,
      users:      users.status   === "fulfilled" ? users.value.data.length : 0,
    });
    if (quotes.status === "fulfilled") setRecent(quotes.value.data);
  }

  useEffect(() => { load(); }, []);

  async function handleSeed() {
    if (!confirm("This will wipe all existing products and categories and re-seed. Continue?")) return;
    setSeeding(true);
    try {
      const res = await api.seed() as any;
      toast.success(`Seeded ${res.meta?.summary?.categories} categories, ${res.meta?.summary?.products} products`);
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSeeding(false);
    }
  }

  const STAT_CARDS = [
    { label: "Categories", value: stats.categories, icon: Tag,      href: "/admin/categories", accent: "#C8913A" },
    { label: "Products",   value: stats.products,   icon: Package,  href: "/admin/products",   accent: "#3D5A4A" },
    { label: "Quotes",     value: stats.quotes,     icon: FileText, href: "/admin/quotes",     accent: "#1C1C1A" },
    { label: "Users",      value: stats.users,      icon: Users,    href: "#",                  accent: "#8A8680" },
  ];

  return (
    <div className="space-y-7 fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, color: "#1C1C1A", letterSpacing: "-0.02em" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8A8680" }}>Here's an overview of your catalogue and incoming requests.</p>
        </div>
        <button onClick={handleSeed} disabled={seeding}
          className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all disabled:opacity-50"
          style={{ border: "1px solid #D4C9B0", color: "#8A8680", backgroundColor: "#FDFAF6", letterSpacing: "0.08em" }}>
          <RefreshCw style={{ width: 12, height: 12 }} className={cn(seeding && "animate-spin")} />
          {seeding ? "Seeding..." : "Seed DB"}
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, href, accent }) => (
          <Link key={label} href={href}
            className="flex items-center gap-4 p-5 transition-all hover:shadow-sm group"
            style={{ backgroundColor: "#FDFAF6", border: "1px solid #EAE3D2" }}>
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0"
              style={{ backgroundColor: accent + "18" }}>
              <Icon style={{ width: 18, height: 18, color: accent }} />
            </div>
            <div className="flex-1">
              <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 26, color: "#1C1C1A", lineHeight: 1 }}>{value}</p>
              <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: "#8A8680" }}>{label}</p>
            </div>
            <ArrowRight style={{ width: 14, height: 14, color: "#D4C9B0" }}
              className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* Recent quotes */}
      <div style={{ backgroundColor: "#FDFAF6", border: "1px solid #EAE3D2" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #EAE3D2" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: "#1C1C1A" }}>
            Recent Quotes
          </h2>
          <Link href="/admin/quotes" className="text-xs uppercase tracking-wider transition-colors hover:text-[#C8913A]"
            style={{ color: "#8A8680", letterSpacing: "0.1em" }}>
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="py-10 text-center text-sm" style={{ color: "#8A8680" }}>No quotes yet</p>
        ) : (
          <div>
            {recent.map((q) => (
              <Link key={q.id} href={`/admin/quotes`}
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[#F2EFE9] group"
                style={{ borderBottom: "1px solid #EAE3D2" }}>
                <div className="flex items-center gap-4">
                  {/* Initials avatar */}
                  <div className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-medium shrink-0"
                    style={{ backgroundColor: "#EDE9E1", color: "#8A8680" }}>
                    {q.user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#1C1C1A" }}>{q.user?.name}</p>
                    <p className="text-xs" style={{ color: "#8A8680" }}>
                      {q.eventName || "Unnamed event"} · {q.location}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className={cn("text-[10px] uppercase tracking-wider px-2 py-1 font-medium border", STATUS_COLORS[q.status])}>
                    {STATUS_LABELS[q.status]}
                  </span>
                  <p className="text-xs mt-1" style={{ color: "#D4C9B0" }}>{formatDate(q.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
