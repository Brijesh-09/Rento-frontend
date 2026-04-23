import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

const VIBES = [
  { label: "Seating", desc: "Chairs, stools, sofas" },
  { label: "Tables",  desc: "Conference, dining, coffee" },
  { label: "Display", desc: "Octonorm panels & more" },
  { label: "Cooling", desc: "Fans, coolers, cold storage" },
];

export default async function HomePage() {
  let categories: any[] = [];
  try {
    const res = await api.categories.list();
    categories = res.data;
  } catch {}

  return (
    <div>
      {/* Hero — full-width editorial banner */}
      <section style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF" }}>
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-36">
          <div className="max-w-2xl fade-up">
            <p className="text-xs uppercase tracking-[0.2em] mb-6" style={{ color: "#8A8680" }}>
              Event Furniture · Mumbai
            </p>
            <h1 className="font-display text-5xl md:text-7xl mb-8 leading-none" style={{ fontFamily: "\'DM Serif Display\', Georgia, serif" }}>
              Furniture<br />
              <em style={{ color: "#C8913A" }}>worth the</em><br />
              occasion.
            </h1>
            <p className="text-base mb-10 max-w-md" style={{ color: "#8A8680", lineHeight: 1.7 }}>
              From intimate boardroom meetings to grand wedding receptions — 
              we rent premium furniture that makes every event unforgettable.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium uppercase tracking-wider transition-all duration-200"
                style={{ backgroundColor: "#F7F4EF", color: "#1C1C1A", letterSpacing: "0.08em" }}>
                Browse Collection <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
              <Link href="/quote"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium uppercase tracking-wider transition-all duration-200"
                style={{ border: "1px solid #3D3D3A", color: "#8A8680", letterSpacing: "0.08em" }}>
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ backgroundColor: "#C8913A" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-3 gap-4 md:grid-cols-3">
          {[
            { n: "500+", label: "Events served" },
            { n: "50+", label: "Products available" },
            { n: "48hr", label: "Delivery window" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl md:text-3xl" style={{ fontFamily: "\'DM Serif Display\', Georgia, serif", color: "#F7F4EF" }}>{s.n}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: "#EAC07A" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories grid */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-display text-3xl md:text-4xl" style={{ fontFamily: "\'DM Serif Display\', Georgia, serif" }}>
              Shop by<br /><em>category</em>
            </h2>
            <Link href="/products" className="text-sm flex items-center gap-1 transition-colors hover:text-[#C8913A]"
              style={{ color: "#8A8680" }}>
              View all <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat: any, i: number) => {
              const bgPalette = ["#EDE9E1","#E8E4DC","#EAE3D2","#E5E0D8","#ECE5D5"];
              const bg = bgPalette[i % bgPalette.length];
              return (
                <Link key={cat.id} href={`/products?categoryId=${cat.id}`}
                  className="group relative overflow-hidden block"
                  style={{ backgroundColor: bg, aspectRatio: "1/1" }}>
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <p className="font-display text-xl md:text-2xl mb-1 transition-colors group-hover:text-[#C8913A]"
                      style={{ fontFamily: "\'DM Serif Display\', Georgia, serif", color: "#1C1C1A" }}>
                      {cat.name}
                    </p>
                    <p className="text-xs" style={{ color: "#8A8680" }}>
                      {cat._count?.products ?? 0} items
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0"
                    style={{ backgroundColor: "#1C1C1A" }}>
                    <ArrowRight style={{ width: 12, height: 12, color: "#F7F4EF" }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Editorial split section */}
      <section style={{ backgroundColor: "#EDE9E1" }}>
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: "#8A8680" }}>How it works</p>
            <h2 className="font-display text-3xl md:text-4xl mb-6" style={{ fontFamily: "\'DM Serif Display\', Georgia, serif" }}>
              Simple, fast,<br /><em>personalised.</em>
            </h2>
            <div className="space-y-6">
              {[
                { n: "01", title: "Browse & select", desc: "Pick products and quantities from our catalogue. Mix and match freely." },
                { n: "02", title: "Submit your requirements", desc: "Tell us your event dates, venue, and any special needs." },
                { n: "03", title: "We get back to you", desc: "Our team reviews your list and sends a personalised quote within hours." },
              ].map((step) => (
                <div key={step.n} className="flex gap-5">
                  <span className="font-display text-2xl shrink-0 mt-0.5" style={{ fontFamily: "\'DM Serif Display\', Georgia, serif", color: "#D4C9B0" }}>
                    {step.n}
                  </span>
                  <div>
                    <p className="font-medium mb-1" style={{ color: "#1C1C1A" }}>{step.title}</p>
                    <p className="text-sm" style={{ color: "#8A8680", lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/products"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium uppercase tracking-wider transition-colors"
              style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF", letterSpacing: "0.08em" }}>
              Start browsing <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>

          {/* Decorative grid */}
          <div className="hidden md:grid grid-cols-2 gap-3">
            {["#D4C9B0","#C8913A","#EDE9E1","#3D5A4A"].map((color, i) => (
              <div key={i} className="rounded-sm" style={{ backgroundColor: color, height: 160, opacity: i === 2 ? 0 : 1 }} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-3xl md:text-5xl mb-4" style={{ fontFamily: "\'DM Serif Display\', Georgia, serif" }}>
          Planning an event?
        </h2>
        <p className="mb-8 text-base max-w-md mx-auto" style={{ color: "#8A8680" }}>
          Tell us what you need and we'll come back with the best setup for your occasion.
        </p>
        <Link href="/quote"
          className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium uppercase tracking-wider transition-all duration-200 hover:gap-4"
          style={{ backgroundColor: "#C8913A", color: "#F7F4EF", letterSpacing: "0.08em" }}>
          Request a Quote <ArrowRight style={{ width: 14, height: 14 }} />
        </Link>
      </section>
    </div>
  );
}
