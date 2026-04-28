"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/public/ProductCard";
import type { Category, Product } from "@/types";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [searchVal,  setSearchVal]  = useState(searchParams.get("search") || "");

  const categoryId = searchParams.get("categoryId") || "";
  const search     = searchParams.get("search") || "";
  const LIMIT      = 12;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.products.list({
        categoryId: categoryId || undefined,
        search:     search || undefined,
        page,
        limit: LIMIT,
      });
      setProducts(res.data);
      setTotal(res.meta?.pagination?.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [categoryId, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.categories.list().then((r) => setCategories(r.data));
  }, []);

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page");
    setPage(1);
    router.push(`/products?${p.toString()}`);
  }

  const totalPages = Math.ceil(total / LIMIT);
  const activeCat  = categories.find((c) => c.id === categoryId);

  return (
    <div>
      {/* Page header */}
      <section style={{ backgroundColor: "#EDE9E1", borderBottom: "1px solid #D4C9B0" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "#8A8680" }}>Our Collection</p>
          <h1 className="font-display text-4xl md:text-5xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#1C1C1A" }}>
            {activeCat ? activeCat.name : "All Products"}
          </h1>
          {total > 0 && (
            <p className="mt-2 text-sm" style={{ color: "#8A8680" }}>{total} items available for rent</p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter bar */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setParam("categoryId", "")}
              className="px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition-all duration-150"
              style={{
                backgroundColor: !categoryId ? "#1C1C1A" : "transparent",
                color:           !categoryId ? "#F7F4EF" : "#8A8680",
                border: `1px solid ${!categoryId ? "#1C1C1A" : "#D4C9B0"}`,
              }}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setParam("categoryId", c.id)}
                className="px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition-all duration-150"
                style={{
                  backgroundColor: categoryId === c.id ? "#1C1C1A" : "transparent",
                  color:           categoryId === c.id ? "#F7F4EF" : "#8A8680",
                  border: `1px solid ${categoryId === c.id ? "#1C1C1A" : "#D4C9B0"}`,
                }}>
                {c.name}
              </button>
            ))}
          </div>

          {/* Search + clear */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#8A8680" }} />
              <input
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  clearTimeout((window as any)._st);
                  (window as any)._st = setTimeout(() => setParam("search", e.target.value), 380);
                }}
                placeholder="Search products..."
                className="w-full h-9 pl-9 pr-3 text-sm outline-none transition-colors"
                style={{
                  border: "1px solid #D4C9B0",
                  backgroundColor: "#FDFAF6",
                  color: "#1C1C1A",
                }}
              />
            </div>
            {(search || categoryId) && (
              <button onClick={() => { setSearchVal(""); router.push("/products"); }}
                className="flex items-center gap-1 text-xs uppercase tracking-wider transition-colors hover:text-[#C8913A]"
                style={{ color: "#8A8680" }}>
                <X style={{ width: 12, height: 12 }} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-sm" style={{ backgroundColor: "#EDE9E1", aspectRatio: "3/4" }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center">
            <SlidersHorizontal style={{ width: 32, height: 32, color: "#D4C9B0", margin: "0 auto 12px" }} />
            <p className="font-display text-xl mb-2" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Nothing found</p>
            <p className="text-sm" style={{ color: "#8A8680" }}>Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid gap-px sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ backgroundColor: "#D4C9B0" }}>
            {products.map((p) => (
              <div key={p.id} style={{ backgroundColor: "#F7F4EF" }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="px-5 py-2 text-xs uppercase tracking-wider font-medium transition-all disabled:opacity-30"
              style={{ border: "1px solid #D4C9B0", color: "#1C1C1A", backgroundColor: "transparent" }}>
              ← Previous
            </button>
            <span className="text-sm" style={{ color: "#8A8680" }}>{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
              className="px-5 py-2 text-xs uppercase tracking-wider font-medium transition-all disabled:opacity-30"
              style={{ border: "1px solid #D4C9B0", color: "#1C1C1A", backgroundColor: "transparent" }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
