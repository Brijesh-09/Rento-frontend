import Link from "next/link";
import { ArrowRight, ArrowUpRight, Star } from "lucide-react";
import { api } from "@/lib/api";
import { HoverImage } from "@/components/public/HoverImage";

const HERO_SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=90",
    tag: "Corporate Events",
    headline: ["Make every", "conference", "count."],
    sub: "Premium furniture for boardrooms, seminars & corporate gatherings.",
  },
];

const CAT_TILES: Record<string, { img: string; color: string }> = {
  "Seating":           { img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=85", color: "#C8913A" },
  "Tables":            { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85", color: "#3D5A4A" },
  "Storage & Cooling": { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85", color: "#8A8680" },
  "Display & Decor":   { img: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=800&q=85", color: "#D4A59A" },
  "Others":            { img: "https://images.unsplash.com/photo-1581404917879-53e19259fdda?w=800&q=85", color: "#1C1C1A" },
};

const PRODUCT_IMGS = [
  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  "https://images.unsplash.com/photo-1549497538-303791108f95?w=600&q=80",
  "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80",
  "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80",
  "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&q=80",
];

const BANNER_ITEMS = [
  {
    img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&q=85",
    eyebrow: "Perfect for boardrooms",
    title: "Conference & Meeting",
    desc: "Conference tables, ergonomic chairs, display boards — everything for a productive meeting.",
    cta: "Shop Conference",
    accent: "#3D5A4A",
    align: "left",
  },
  {
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85",
    eyebrow: "Weddings & Receptions",
    title: "Elegant Event Seating",
    desc: "Chiavari chairs, tiffany chairs, banquet tables — curated for weddings and social events.",
    cta: "Shop Seating",
    accent: "#C8913A",
    align: "right",
  },
];

const TRUST = [
  { n: "500+", label: "Events Served" },
  { n: "50+",  label: "Products Available" },
  { n: "48h",  label: "Delivery Window" },
  { n: "100%", label: "Client Satisfaction" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Event Manager · TCS",   text: "Flawless delivery and premium quality. Our annual conference looked absolutely stunning.", stars: 5 },
  { name: "Rahul Mehta",  role: "Wedding Planner",       text: "We've partnered with FURNR for 12+ weddings. Always on time, always impeccable.", stars: 5 },
  { name: "Anita Joshi",  role: "Exhibition Director",   text: "The Octonorm display panels transformed our trade show booth entirely.", stars: 5 },
];

export default async function HomePage() {
  let categories: any[] = [];
  let products: any[]   = [];
  try {
    const [c, p] = await Promise.allSettled([
      api.categories.list(),
      api.products.list({ limit: 8 }),
    ]);
    if (c.status === "fulfilled") categories = c.value.data;
    if (p.status === "fulfilled") products   = p.value.data;
  } catch {}

  const hero = HERO_SLIDES[0];

  return (
    <div style={{ backgroundColor: "#F7F4EF" }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative" style={{ height: "100svh", minHeight: 640 }}>
        <img
          src={hero.img}
          alt="Event"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(115deg, rgba(18,18,16,0.88) 0%, rgba(18,18,16,0.65) 40%, rgba(18,18,16,0.20) 75%, rgba(18,18,16,0.08) 100%)"
        }} />
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: "#C8913A" }} />

        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 max-w-7xl" style={{ margin: "0 auto", left: 0, right: 0 }}>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-8 fade-up">
              <span className="w-5 h-px" style={{ backgroundColor: "#C8913A" }} />
              <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "#C8913A" }}>{hero.tag}</span>
            </div>
            <h1 className="mb-8" style={{ color: "#F7F4EF", fontFamily: "var(--font-dm-serif), Georgia, serif", letterSpacing: "-0.03em", lineHeight: 1.0 }}>
              {hero.headline.map((line, i) => (
                <span key={i} className={`block fade-up-${i + 1}`} style={{
                  fontSize: "clamp(3.2rem, 7.5vw, 7rem)",
                  fontStyle: i === 1 ? "italic" : "normal",
                  color: i === 1 ? "#C8913A" : "#F7F4EF",
                }}>{line}</span>
              ))}
            </h1>
            <p className="fade-up-3 mb-10 text-base md:text-lg" style={{ color: "rgba(247,244,239,0.65)", lineHeight: 1.75, maxWidth: 460 }}>
              {hero.sub}
            </p>
            <div className="fade-up-4 flex flex-wrap gap-3">
              <Link href="/products"
                className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-medium uppercase transition-all duration-300"
                style={{ backgroundColor: "#C8913A", color: "#F7F4EF", letterSpacing: "0.1em" }}>
                Browse Collection <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
              <Link href="/quote"
                className="inline-flex items-center gap-3 px-8 py-4 text-sm font-medium uppercase"
                style={{ border: "1px solid rgba(247,244,239,0.3)", color: "#F7F4EF", letterSpacing: "0.1em" }}>
                Get a Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="absolute bottom-0 left-0 right-0" style={{ backgroundColor: "rgba(12,12,10,0.82)", backdropFilter: "blur(12px)" }}>
          <div className="max-w-7xl mx-auto px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST.map((t) => (
              <div key={t.label} className="flex flex-col items-center">
                <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, color: "#C8913A", lineHeight: 1 }}>{t.n}</span>
                <span className="text-[10px] uppercase tracking-widest mt-1.5" style={{ color: "rgba(247,244,239,0.45)" }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2">
          {[0,1,2].map((i) => (
            <div key={i} className="rounded-full"
              style={{ width: i === 0 ? 6 : 4, height: i === 0 ? 24 : 4, backgroundColor: i === 0 ? "#C8913A" : "rgba(247,244,239,0.3)" }} />
          ))}
        </div>
      </section>

      {/* ── CATEGORY STRIP ───────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-16" style={{ backgroundColor: "#F7F4EF" }}>
          <div className="max-w-7xl mx-auto">
            <div className="px-6 md:px-10 flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#8A8680" }}>What we offer</p>
                <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#1C1C1A", letterSpacing: "-0.02em" }}>
                  Explore Categories
                </h2>
              </div>
              <Link href="/products" className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-wider hover:text-[#C8913A] transition-colors"
                style={{ color: "#8A8680", letterSpacing: "0.1em" }}>
                All products <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto px-6 md:px-10 pb-4" style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}>
              {/* All tile */}
              <Link href="/products" className="group relative shrink-0 overflow-hidden flex flex-col justify-end"
                style={{ width: 160, height: 340, backgroundColor: "#1C1C1A", scrollSnapAlign: "start" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border flex items-center justify-center transition-colors group-hover:border-[#C8913A]"
                    style={{ borderColor: "rgba(247,244,239,0.2)" }}>
                    <ArrowUpRight style={{ width: 18, height: 18, color: "#F7F4EF" }} />
                  </div>
                </div>
                <div className="relative p-4">
                  <p style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 20, color: "#F7F4EF", lineHeight: 1.2 }}>All<br />Items</p>
                  <p className="text-[10px] uppercase tracking-wider mt-1" style={{ color: "#8A8680" }}>
                    {categories.reduce((s: number, c: any) => s + (c._count?.products ?? 0), 0)} products
                  </p>
                </div>
              </Link>

              {/* Category tiles */}
              {categories.map((cat: any) => {
                const cfg = CAT_TILES[cat.name] || { img: PRODUCT_IMGS[0], color: "#C8913A" };
                return (
                  <Link key={cat.id} href={`/products?categoryId=${cat.id}`}
                    className="group relative shrink-0 overflow-hidden block"
                    style={{ width: 260, height: 340, scrollSnapAlign: "start" }}>
                    {/* Use plain img — no hover handler on server component */}
                    <img src={cfg.img} alt={cat.name}
                      className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                      style={{ objectFit: "cover" }} />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(18,18,16,0.85) 0%, rgba(18,18,16,0.3) 50%, rgba(18,18,16,0.05) 100%)" }} />
                    {/* Accent bar on hover via CSS group */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{ backgroundColor: cfg.color }} />
                    <div className="absolute top-4 right-4 px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium"
                      style={{ backgroundColor: "rgba(18,18,16,0.6)", color: "rgba(247,244,239,0.7)", backdropFilter: "blur(4px)" }}>
                      {cat._count?.products ?? 0} items
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                      <div>
                        <p style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 22, color: "#F7F4EF", lineHeight: 1.2 }}>
                          {cat.name}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider mt-1.5 flex items-center gap-1 transition-colors group-hover:text-[#F7F4EF]"
                          style={{ color: "rgba(247,244,239,0.45)" }}>
                          Explore <ArrowRight style={{ width: 10, height: 10 }} />
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0"
                        style={{ backgroundColor: cfg.color }}>
                        <ArrowUpRight style={{ width: 14, height: 14, color: "#F7F4EF" }} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── TRENDING PRODUCTS CAROUSEL ────────────────────────────── */}
      {products.length > 0 && (
        <section className="py-16" style={{ backgroundColor: "#EDE9E1" }}>
          <div className="max-w-7xl mx-auto">
            <div className="px-6 md:px-10 flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#8A8680" }}>Hand-picked for you</p>
                <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#1C1C1A", letterSpacing: "-0.02em" }}>
                  Trending Now
                </h2>
              </div>
              <Link href="/products" className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-wider hover:text-[#C8913A] transition-colors"
                style={{ color: "#8A8680", letterSpacing: "0.1em" }}>
                View all <ArrowRight style={{ width: 13, height: 13 }} />
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto px-6 md:px-10 pb-5" style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}>
              {products.map((p: any, i: number) => {
                const img = PRODUCT_IMGS[i % PRODUCT_IMGS.length];
                const warmBgs = ["#E8E4DC","#EDE9E1","#E5E0D8","#EAE3D2","#ECE5D5","#E8E0D5","#EBE5DC","#E6E0D6"];
                const bg = warmBgs[i % warmBgs.length];
                return (
                  <div key={p.id} className="group shrink-0 flex flex-col"
                    style={{ width: 240, scrollSnapAlign: "start", backgroundColor: "#FDFAF6" }}>
                    <div className="relative overflow-hidden" style={{ height: 260, backgroundColor: bg }}>
                      {/* HoverImage is a client component — safe here */}
                      <HoverImage src={img} alt={p.name}
                        className="absolute inset-0 w-full h-full"
                        style={{ objectFit: "cover" }} />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: "rgba(28,28,26,0.15)" }} />
                      <div className="absolute top-3 left-3 px-2.5 py-1 text-[9px] uppercase tracking-wider font-medium"
                        style={{ backgroundColor: "rgba(247,244,239,0.92)", color: "#8A8680" }}>
                        {p.category?.name}
                      </div>
                      {/* Hover CTA */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <Link href={`/products/${p.id}`}
                          className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium uppercase"
                          style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF", letterSpacing: "0.08em" }}>
                          View Details
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 p-4 flex-1" style={{ borderTop: "1px solid #EAE3D2" }}>
                      <Link href={`/products/${p.id}`}>
                        <p className="text-sm font-medium leading-snug hover:text-[#C8913A] transition-colors" style={{ color: "#1C1C1A" }}>{p.name}</p>
                      </Link>
                      {p.description && (
                        <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "#8A8680" }}>{p.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid #EAE3D2" }}>
                        <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 18, color: "#1C1C1A" }}>
                          {p.basePrice ? `₹${p.basePrice.toLocaleString("en-IN")}` : "Get Quote"}
                        </span>
                        {p.variants?.[0]?.stock != null && (
                          <span className="text-[10px] uppercase tracking-wider"
                            style={{ color: p.variants[0].stock > 0 ? "#3D5A4A" : "#C0392B" }}>
                            {p.variants[0].stock > 0 ? `${p.variants[0].stock} avail.` : "Out of stock"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED BANNERS ──────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#F7F4EF" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#8A8680" }}>Curated for your needs</p>
            <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#1C1C1A" }}>
              Featured Collections
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {BANNER_ITEMS.map((banner, i) => (
              <div key={i} className="group relative overflow-hidden" style={{ height: 420 }}>
                <HoverImage src={banner.img} alt={banner.title}
                  className="absolute inset-0 w-full h-full"
                  style={{ objectFit: "cover", objectPosition: "center 40%" }} />
                <div className="absolute inset-0" style={{
                  background: banner.align === "left"
                    ? "linear-gradient(to right, rgba(18,18,16,0.88) 0%, rgba(18,18,16,0.55) 45%, rgba(18,18,16,0.05) 100%)"
                    : "linear-gradient(to left, rgba(18,18,16,0.88) 0%, rgba(18,18,16,0.55) 45%, rgba(18,18,16,0.05) 100%)"
                }} />
                <div className="absolute top-0 bottom-0 w-1"
                  style={{ [banner.align === "left" ? "left" : "right"]: 0, backgroundColor: banner.accent }} />
                <div className={`absolute inset-0 flex flex-col justify-center p-10 md:p-16 ${banner.align === "right" ? "items-end text-right" : ""}`}>
                  <div className="max-w-md">
                    <p className="text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: banner.accent }}>{banner.eyebrow}</p>
                    <h3 className="mb-4" style={{
                      fontFamily: "var(--font-dm-serif), Georgia, serif",
                      fontSize: "clamp(2rem,4vw,3rem)",
                      color: "#F7F4EF", lineHeight: 1.1, letterSpacing: "-0.02em",
                    }}>{banner.title}</h3>
                    <p className="mb-8 text-sm leading-relaxed" style={{ color: "rgba(247,244,239,0.65)", maxWidth: 360 }}>{banner.desc}</p>
                    <Link href="/products"
                      className="inline-flex items-center gap-3 px-7 py-3.5 text-xs font-medium uppercase"
                      style={{ backgroundColor: banner.accent, color: "#F7F4EF", letterSpacing: "0.1em" }}>
                      {banner.cta} <ArrowRight style={{ width: 14, height: 14 }} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Split mini-banners */}
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="group relative overflow-hidden" style={{ height: 300 }}>
              <img src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&q=85"
                alt="Exhibition"
                className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                style={{ objectFit: "cover" }} />
              <div className="absolute inset-0" style={{ background: "rgba(28,28,26,0.55)" }} />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#D4A59A" }}>Exhibition Ready</p>
                <h3 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, color: "#F7F4EF", lineHeight: 1.15 }}>
                  Display &<br />Octonorm Panels
                </h3>
                <Link href="/products" className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-wider hover:text-[#D4A59A] transition-colors"
                  style={{ color: "rgba(247,244,239,0.6)", letterSpacing: "0.1em" }}>
                  Explore <ArrowRight style={{ width: 12, height: 12 }} />
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-1" style={{ height: 300 }}>
              <div className="group relative overflow-hidden flex-1">
                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85"
                  alt="Cooling"
                  className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{ objectFit: "cover" }} />
                <div className="absolute inset-0" style={{ background: "rgba(28,28,26,0.60)" }} />
                <div className="absolute inset-0 flex items-center px-8 justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "#8A8680" }}>Stay cool</p>
                    <p style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 22, color: "#F7F4EF" }}>Cooling & Fans</p>
                  </div>
                  <Link href="/products" className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(247,244,239,0.15)", color: "#F7F4EF" }}>
                    <ArrowUpRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>
              </div>
              <div className="group relative overflow-hidden flex-1">
                <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=85"
                  alt="All"
                  className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{ objectFit: "cover" }} />
                <div className="absolute inset-0" style={{ background: "rgba(200,145,58,0.55)" }} />
                <div className="absolute inset-0 flex items-center px-8 justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(247,244,239,0.7)" }}>Full catalogue</p>
                    <p style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 22, color: "#F7F4EF" }}>View Everything</p>
                  </div>
                  <Link href="/products" className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(28,28,26,0.3)", color: "#F7F4EF" }}>
                    <ArrowUpRight style={{ width: 14, height: 14 }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: "#1C1C1A" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <p className="text-[10px] uppercase tracking-[0.22em] mb-3" style={{ color: "#8A8680" }}>Simple process</p>
            <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#F7F4EF" }}>
              3 steps to your perfect event
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: "#2E2E2B" }}>
            {[
              { n: "01", title: "Browse & Select",      desc: "Pick products, quantities and variants from our catalogue. Mix and match freely.", icon: "🛋️" },
              { n: "02", title: "Submit Requirements",   desc: "Tell us your event dates, venue and special requirements. Takes under 2 minutes.", icon: "📋" },
              { n: "03", title: "We Quote & Deliver",    desc: "Our team sends a personalised quote within hours. Confirm and we handle delivery.", icon: "🚚" },
            ].map((step, i) => (
              <div key={step.n} className="flex flex-col p-10" style={{ backgroundColor: "#1C1C1A" }}>
                <div className="flex items-center justify-between mb-8">
                  <span style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 48, color: "#2E2E2B", lineHeight: 1 }}>{step.n}</span>
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <p className="font-medium mb-3 text-sm uppercase tracking-wider" style={{ color: "#F7F4EF", letterSpacing: "0.08em" }}>{step.title}</p>
                <p className="text-sm flex-1" style={{ color: "#8A8680", lineHeight: 1.75 }}>{step.desc}</p>
                {i === 2 && (
                  <Link href="/products" className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider font-medium"
                    style={{ backgroundColor: "#C8913A", color: "#F7F4EF", letterSpacing: "0.1em", alignSelf: "flex-start" }}>
                    Get Started <ArrowRight style={{ width: 13, height: 13 }} />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "#F7F4EF" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "#8A8680" }}>Client stories</p>
            <h2 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "#1C1C1A" }}>
              Trusted by event professionals
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="p-7"
                style={{ backgroundColor: i === 1 ? "#1C1C1A" : "#FDFAF6", border: `1px solid ${i === 1 ? "#2E2E2B" : "#EAE3D2"}` }}>
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} style={{ width: 12, height: 12, fill: "#C8913A", color: "#C8913A" }} />
                  ))}
                </div>
                <p className="text-sm mb-6 leading-relaxed italic" style={{ color: i === 1 ? "rgba(247,244,239,0.7)" : "#8A8680" }}>
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3" style={{ borderTop: `1px solid ${i === 1 ? "#2E2E2B" : "#EAE3D2"}`, paddingTop: 18 }}>
                  <div className="w-9 h-9 flex items-center justify-center text-xs font-medium"
                    style={{ backgroundColor: i === 1 ? "#2E2E2B" : "#EDE9E1", color: i === 1 ? "#8A8680" : "#1C1C1A" }}>
                    {t.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: i === 1 ? "#F7F4EF" : "#1C1C1A" }}>{t.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#8A8680" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ─────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: 500 }}>
        <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1800&q=90"
          alt="Event" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover", objectPosition: "center 35%" }} />
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(18,18,16,0.68)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-[10px] uppercase tracking-[0.25em] mb-5" style={{ color: "#C8913A" }}>Ready when you are</p>
          <h2 className="mb-5" style={{
            fontFamily: "var(--font-dm-serif), Georgia, serif",
            fontSize: "clamp(2.4rem,5vw,4.5rem)",
            color: "#F7F4EF", lineHeight: 1.05, letterSpacing: "-0.025em",
          }}>
            Your next event,<br /><em style={{ color: "#C8913A" }}>beautifully furnished.</em>
          </h2>
          <p className="mb-10 text-sm max-w-md" style={{ color: "rgba(247,244,239,0.60)", lineHeight: 1.8 }}>
            Browse our catalogue, build your list, and we'll quote you the best price for your occasion.
          </p>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/quote"
              className="inline-flex items-center gap-3 px-9 py-4 text-sm font-medium uppercase"
              style={{ backgroundColor: "#C8913A", color: "#F7F4EF", letterSpacing: "0.1em" }}>
              Request a Quote <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
            <Link href="/products"
              className="inline-flex items-center gap-3 px-9 py-4 text-sm font-medium uppercase"
              style={{ border: "1px solid rgba(247,244,239,0.3)", color: "#F7F4EF", letterSpacing: "0.1em" }}>
              Browse Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
