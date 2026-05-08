import { notFound } from "next/navigation";
import Link from "next/link";
import { Package, CheckCircle, Truck, Calendar, Shield } from "lucide-react";
import { api } from "@/lib/api";
import { ProductDetailClient } from "@/components/public/ProductDetailClient";
import { ProductCard } from "@/components/public/ProductCard";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props) {
  try {
    const { data: p } = await api.products.get(params.id);
    return {
      title: p.name,
      description: p.description ?? `Rent ${p.name} for your event — premium furniture rentals.`,
      openGraph: { images: p.imageUrls?.[0] ? [p.imageUrls[0]] : [] },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  let product: any;
  let related: any[] = [];

  try {
    product = (await api.products.get(params.id)).data;
  } catch {
    notFound();
  }

  try {
    const res = await api.products.list({ categoryId: product.categoryId, limit: 5 });
    related = res.data.filter((p: any) => p.id !== product.id).slice(0, 4);
  } catch {}

  // Unique colors and dimensions across all variants
  const colors     = [...new Set((product.variants ?? []).map((v: any) => v.color).filter(Boolean))];
  const dimensions = [...new Set((product.variants ?? []).map((v: any) => v.dimensions).filter(Boolean))];
  const totalStock = (product.variants ?? []).reduce((s: number, v: any) => s + (v.stock ?? 0), 0);

  return (
    <div style={{ backgroundColor: "#F7F4EF" }}>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#EDE9E1", borderBottom: "1px solid #D4C9B0" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center gap-2 text-xs" style={{ color: "#8A8680", flexWrap: "wrap" }}>
          <Link href="/"        className="hover:text-[#C8913A] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#C8913A] transition-colors">Products</Link>
          {product.category && (
            <><span>/</span>
            <Link href={`/products?categoryId=${product.categoryId}`} className="hover:text-[#C8913A] transition-colors">
              {product.category.name}
            </Link></>
          )}
          <span>/</span>
          <span style={{ color: "#1C1C1A" }}>{product.name}</span>
        </div>
      </div>

      {/* ── Main hero ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">

        {/* Gallery + Actions — client component handles variant-image sync */}
        <ProductDetailClient product={product} />

        {/* ── Specs strip below hero ── */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Package,  label: "Category",    value: product.category?.name ?? "—" },
            { icon: Truck,    label: "Delivery",     value: "To your venue" },
            { icon: Calendar, label: "Min. rental",  value: "1 day" },
            { icon: Shield,   label: "Availability", value: totalStock > 0 ? `${totalStock} units` : "Contact us" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-4"
              style={{ backgroundColor: "#FDFAF6", border: "1px solid #EAE3D2" }}>
              <Icon style={{ width: 16, height: 16, color: "#C8913A", flexShrink: 0 }} />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "#8A8680" }}>{label}</p>
                <p className="text-sm font-medium mt-0.5" style={{ color: "#1C1C1A" }}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Details section ── */}
      <section style={{ backgroundColor: "#FDFAF6", borderTop: "1px solid #D4C9B0" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
          <div className="grid gap-12 md:grid-cols-3">

            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-0.5 h-6" style={{ backgroundColor: "#C8913A" }} />
                <p className="text-[11px] uppercase tracking-[0.16em] font-medium" style={{ color: "#8A8680" }}>
                  About this product
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#1C1C1A", lineHeight: 1.9 }}>
                {product.description ||
                  "This premium rental item is available for events of all sizes. Contact us for bulk pricing and special requirements."}
              </p>
              {/* Trust checkmarks */}
              <ul className="mt-6 space-y-2.5">
                {["Free delivery consultation","Flexible rental period","Damage cover included","24/7 event support"].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <CheckCircle style={{ width: 13, height: 13, color: "#3D5A4A", flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: "#8A8680" }}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Variants / Specifications */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-0.5 h-6" style={{ backgroundColor: "#3D5A4A" }} />
                <p className="text-[11px] uppercase tracking-[0.16em] font-medium" style={{ color: "#8A8680" }}>
                  Specifications
                </p>
              </div>

              {/* Colors */}
              {colors.length > 0 && (
                <div className="mb-5">
                  <p className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: "#8A8680" }}>
                    Available Colors
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c: any) => (
                      <span key={c} className="px-3 py-1 text-xs"
                        style={{ backgroundColor: "#EDE9E1", color: "#1C1C1A", border: "1px solid #D4C9B0" }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimensions */}
              {dimensions.length > 0 && (
                <div className="mb-5">
                  <p className="text-[11px] uppercase tracking-wider font-medium mb-2" style={{ color: "#8A8680" }}>
                    Available Dimensions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dimensions.map((d: any) => (
                      <span key={d} className="px-3 py-1 text-xs font-mono"
                        style={{ backgroundColor: "#EDE9E1", color: "#1C1C1A", border: "1px solid #D4C9B0" }}>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full variant table */}
              {product.variants?.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-medium mb-3" style={{ color: "#8A8680" }}>
                    All Variants
                  </p>
                  <div style={{ border: "1px solid #EAE3D2" }}>
                    {/* Header */}
                    <div className="grid text-[10px] uppercase tracking-wider px-3 py-2"
                      style={{ gridTemplateColumns: "1fr 1fr 80px", backgroundColor: "#EDE9E1", color: "#8A8680", gap: 8 }}>
                      <span>Color</span>
                      <span>Dimensions</span>
                      <span>Stock</span>
                    </div>
                    {product.variants.map((v: any, i: number) => (
                      <div key={v.id}
                        className="grid items-center px-3 py-2.5 text-xs"
                        style={{
                          gridTemplateColumns: "1fr 1fr 80px",
                          gap: 8,
                          borderTop: i > 0 ? "1px solid #EAE3D2" : "none",
                          backgroundColor: "#FDFAF6",
                        }}>
                        <span style={{ color: "#1C1C1A" }}>{v.color || "—"}</span>
                        <span style={{ color: "#8A8680", fontFamily: "monospace" }}>{v.dimensions || "—"}</span>
                        <span style={{ color: v.stock > 0 ? "#3D5A4A" : "#C0392B", fontWeight: 600 }}>
                          {v.stock ?? "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rental Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-0.5 h-6" style={{ backgroundColor: "#D4A59A" }} />
                <p className="text-[11px] uppercase tracking-[0.16em] font-medium" style={{ color: "#8A8680" }}>
                  Rental information
                </p>
              </div>
              <div className="space-y-5">
                {[
                  { label: "Minimum period",    body: "1 day. Weekly and monthly rates available — just mention in your quote." },
                  { label: "Delivery & pickup", body: "We deliver to your venue and collect after your event. Charges apply based on distance." },
                  { label: "How pricing works", body: "Prices shown are per-day base rates. Submit a quote for event-specific pricing inclusive of setup." },
                  { label: "Damage policy",     body: "Normal wear is covered. Accidental damage charged at replacement cost. Optional damage cover available." },
                  { label: "Bulk discounts",    body: "Ordering 20+ units? Reach out — we offer tiered pricing for large events." },
                ].map((item) => (
                  <div key={item.label} className="pb-5" style={{ borderBottom: "1px solid #EAE3D2" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "#1C1C1A" }}>{item.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#8A8680", lineHeight: 1.75 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className="py-16" style={{ backgroundColor: "#F7F4EF" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#8A8680" }}>You may also like</p>
                <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "#1C1C1A" }}>
                  Related Items
                </h2>
              </div>
              <Link href={`/products?categoryId=${product.categoryId}`}
                className="hidden md:inline-flex text-xs uppercase tracking-wider hover:text-[#C8913A] transition-colors"
                style={{ color: "#8A8680", letterSpacing: "0.1em" }}>
                See all in {product.category?.name} →
              </Link>
            </div>
            <div className="grid gap-px sm:grid-cols-2 md:grid-cols-4" style={{ backgroundColor: "#D4C9B0" }}>
              {related.map((p) => (
                <div key={p.id} style={{ backgroundColor: "#F7F4EF" }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom CTA ── */}
      <section className="py-14" style={{ backgroundColor: "#1C1C1A" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#8A8680" }}>Ready to book?</p>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(1.4rem,3vw,2.2rem)", color: "#F7F4EF" }}>
              Add {product.name} to your quote
            </h2>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/quote"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium uppercase"
              style={{ backgroundColor: "#C8913A", color: "#F7F4EF", letterSpacing: "0.1em" }}>
              View Quote List
            </Link>
            <Link href="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium uppercase"
              style={{ border: "1px solid rgba(247,244,239,0.2)", color: "rgba(247,244,239,0.7)", letterSpacing: "0.1em" }}>
              Keep Browsing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
