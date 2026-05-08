
"use client";
import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const inputStyle: React.CSSProperties = {
  width: "100%", height: "42px", padding: "0 12px",
  border: "1px solid #D4C9B0", backgroundColor: "#FDFAF6",
  color: "#1C1C1A", fontSize: "14px", outline: "none",
  fontFamily: "'DM Sans', system-ui, sans-serif",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", textTransform: "uppercase",
  letterSpacing: "0.1em", fontWeight: 500, color: "#8A8680", marginBottom: "6px",
};

export default function QuotePage() {
  const { items, updateQty, removeItem, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [quoteId,    setQuoteId]    = useState("");

  const [form, setForm] = useState({
    name: "", email: "", phone: "", eventName: "",
    eventType: "", location: "", startDate: "", endDate: "", notes: "",
  });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) { toast.error("Add at least one item first"); return; }
    if (new Date(form.endDate) < new Date(form.startDate)) { toast.error("End date must be after start date"); return; }
    setSubmitting(true);
    try {
      const res = await api.quotes.create({
        user:      { name: form.name, email: form.email, phone: form.phone },
        eventName: form.eventName  || undefined,
        eventType: form.eventType  || undefined,
        location:  form.location,
        startDate: form.startDate,
        endDate:   form.endDate,
        notes:     form.notes      || undefined,
        items:     items.map((i) => ({ productId: i.productId, variantId: i.variantId || undefined, quantity: i.quantity })),
      });
      setQuoteId(res.data.id);
      setSubmitted(true);
      clearCart();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center fade-up">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#3D5A4A" }}>
          <CheckCircle style={{ width: 28, height: 28, color: "#F7F4EF" }} />
        </div>
        <h1 className="mb-3" style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 32, color: "#1C1C1A" }}>
          Quote Submitted!
        </h1>
        <p className="mb-2 text-sm" style={{ color: "#8A8680", lineHeight: 1.8 }}>
          Our team will review your requirements and reach out with the best pricing within a few hours.
        </p>
        <p className="text-xs mb-10 font-mono" style={{ color: "#D4C9B0" }}>ref: {quoteId}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/products"
            className="px-7 py-3.5 text-sm uppercase tracking-wider font-medium"
            style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF", letterSpacing: "0.08em" }}>
            Browse More
          </Link>
          <button
            onClick={() => { setSubmitted(false); setForm({ name:"",email:"",phone:"",eventName:"",eventType:"",location:"",startDate:"",endDate:"",notes:"" }); }}
            className="px-7 py-3.5 text-sm uppercase tracking-wider font-medium"
            style={{ border: "1px solid #D4C9B0", color: "#8A8680", letterSpacing: "0.08em" }}>
            New Quote
          </button>
        </div>
      </div>
    );
  }

  // ── Main ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: "#F7F4EF" }}>
      {/* Page header */}
      <section style={{ backgroundColor: "#EDE9E1", borderBottom: "1px solid #D4C9B0" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
          <Link href="/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider mb-4 transition-colors hover:text-[#C8913A]"
            style={{ color: "#8A8680", letterSpacing: "0.1em" }}>
            <ArrowLeft style={{ width: 12, height: 12 }} /> Back to products
          </Link>
          <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(2rem,4vw,3rem)", color: "#1C1C1A" }}>
            Request a Quote
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#8A8680" }}>
            Review your items, fill in your event details — we'll send you personalised pricing.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid lg:grid-cols-2 gap-12">

        {/* ── Left: Cart ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#1C1C1A" }}>
              Your Items
            </h2>
            <span className="text-xs uppercase tracking-wider" style={{ color: "#8A8680" }}>
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="py-16 text-center" style={{ border: "1px dashed #D4C9B0" }}>
              <ShoppingBag style={{ width: 28, height: 28, color: "#D4C9B0", margin: "0 auto 12px" }} />
              <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: "#8A8680" }}>
                Your list is empty
              </p>
              <Link href="/products"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider mt-4 transition-colors hover:text-[#C8913A]"
                style={{ color: "#8A8680", letterSpacing: "0.1em" }}>
                Browse Products <ArrowRight style={{ width: 12, height: 12 }} />
              </Link>
            </div>
          ) : (
            <div style={{ borderTop: "1px solid #D4C9B0" }}>
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`}
                  className="flex items-center gap-4 py-4"
                  style={{ borderBottom: "1px solid #EAE3D2" }}>

                  {/* Product thumbnail */}
                  <Link href={`/products/${item.productId}`}
                    className="shrink-0 overflow-hidden block hover:opacity-80 transition-opacity"
                    style={{ width: 64, height: 64, backgroundColor: "#EDE9E1" }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName}
                        className="w-full h-full" style={{ objectFit: "cover" }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <svg viewBox="0 0 40 30" fill="none" style={{ width: 36, color: "#8A8680" }}>
                          <rect x="5" y="15" width="30" height="2" rx="0.5" fill="currentColor"/>
                          <rect x="7" y="5"  width="26" height="10" rx="1" fill="currentColor"/>
                          <rect x="7" y="17" width="3" height="8" rx="0.5" fill="currentColor"/>
                          <rect x="30" y="17" width="3" height="8" rx="0.5" fill="currentColor"/>
                        </svg>
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}
                      className="font-medium text-sm hover:text-[#C8913A] transition-colors truncate block"
                      style={{ color: "#1C1C1A" }}>
                      {item.productName}
                    </Link>
                    {item.variantLabel && item.variantLabel !== "Standard" && (
                      <p className="text-xs mt-0.5" style={{ color: "#8A8680" }}>{item.variantLabel}</p>
                    )}
                    <p className="text-xs mt-1" style={{ color: "#C8913A" }}>
                      {formatPrice(item.basePrice)}
                      {item.basePrice && <span style={{ color: "#D4C9B0" }}> / day</span>}
                    </p>
                  </div>

                  {/* Qty stepper */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateQty(item.productId, item.variantId, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center transition-colors hover:bg-[#EAE3D2]"
                      style={{ border: "1px solid #D4C9B0" }}>
                      <Minus style={{ width: 11, height: 11 }} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold" style={{ color: "#1C1C1A" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.productId, item.variantId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center transition-colors hover:bg-[#EAE3D2]"
                      style={{ border: "1px solid #D4C9B0" }}>
                      <Plus style={{ width: 11, height: 11 }} />
                    </button>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="w-7 h-7 flex items-center justify-center transition-colors ml-1 hover:text-red-500"
                      style={{ color: "#D4C9B0" }}>
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div className="pt-4">
                <p className="text-xs" style={{ color: "#8A8680" }}>
                  {items.reduce((s, i) => s + i.quantity, 0)} total units ·
                  Pricing is per day and will be confirmed in your quote.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Form ── */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Contact */}
          <div>
            <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#1C1C1A", marginBottom: 20 }}>
              Contact Details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input required value={form.name} onChange={set("name")} placeholder="Rahul Mehta" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone *</label>
                <input required value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" style={inputStyle} />
              </div>
              <div className="sm:col-span-2">
                <label style={labelStyle}>Email *</label>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="rahul@company.com" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #D4C9B0" }} />

          {/* Event */}
          <div>
            <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#1C1C1A", marginBottom: 20 }}>
              Event Details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label style={labelStyle}>Event Name</label>
                <input value={form.eventName} onChange={set("eventName")} placeholder="Annual Sales Conference" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Event Type</label>
                <select value={form.eventType} onChange={set("eventType")} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select type...</option>
                  {["CORPORATE","WEDDING","EXHIBITION","CONFERENCE","PARTY","OTHER"].map((t) => (
                    <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label style={labelStyle}>Venue / Location *</label>
                <input required value={form.location} onChange={set("location")} placeholder="Taj Lands End, Mumbai" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>From Date *</label>
                <input required type="date" value={form.startDate} onChange={set("startDate")}
                  min={new Date().toISOString().split("T")[0]} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>To Date *</label>
                <input required type="date" value={form.endDate} onChange={set("endDate")}
                  min={form.startDate || new Date().toISOString().split("T")[0]} style={inputStyle} />
              </div>
              <div className="sm:col-span-2">
                <label style={labelStyle}>Special Requirements</label>
                <textarea value={form.notes} onChange={set("notes")} rows={3}
                  placeholder="Delivery time, colour preferences, setup instructions..."
                  style={{ ...inputStyle, height: "auto", padding: "10px 12px", resize: "vertical" }} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting || items.length === 0}
            className="w-full flex items-center justify-center gap-2 py-4 text-sm font-medium uppercase transition-all disabled:opacity-40"
            style={{ backgroundColor: "#C8913A", color: "#F7F4EF", letterSpacing: "0.1em" }}>
            {submitting ? "Submitting..." : <>Submit Quote Request <ArrowRight style={{ width: 14, height: 14 }} /></>}
          </button>
          <p className="text-xs text-center" style={{ color: "#8A8680" }}>
            We typically respond within 2–4 hours on business days.
          </p>
        </form>
      </div>
    </div>
  );
}
