"use client";
import { useEffect, useState, useCallback } from "react";
import { FileText, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn, formatDate, STATUS_COLORS, STATUS_LABELS, getRentalDays } from "@/lib/utils";
import type { Quote, QuoteStatus } from "@/types";

const ALL_STATUSES: QuoteStatus[] = ["PENDING", "REVIEWING", "QUOTED", "CONFIRMED", "CLOSED"];
const NEXT: Record<QuoteStatus, QuoteStatus | null> = {
  PENDING: "REVIEWING", REVIEWING: "QUOTED", QUOTED: "CONFIRMED", CONFIRMED: "CLOSED", CLOSED: null,
};

export default function AdminQuotesPage() {
  const [quotes,    setQuotes]    = useState<Quote[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState("all");
  const [page,      setPage]      = useState(1);
  const [total,     setTotal]     = useState(0);
  const [selected,  setSelected]  = useState<Quote | null>(null);
  const [advancing, setAdvancing] = useState(false);
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.quotes.list({ status: filter !== "all" ? filter as QuoteStatus : undefined, page, limit: LIMIT });
      setQuotes(r.data);
      setTotal(r.meta?.pagination?.total ?? 0);
    } finally { setLoading(false); }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  async function advance(q: Quote) {
    const next = NEXT[q.status];
    if (!next) return;
    setAdvancing(true);
    try {
      const r = await api.quotes.updateStatus(q.id, next);
      toast.success(`Moved to ${STATUS_LABELS[next]}`);
      setSelected(r.data);
      load();
    } catch (err: any) { toast.error(err.message); }
    finally { setAdvancing(false); }
  }

  async function del(q: Quote) {
    if (!confirm("Delete this quote?")) return;
    try { await api.quotes.delete(q.id); toast.success("Deleted"); setSelected(null); load(); }
    catch (err: any) { toast.error(err.message); }
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="flex h-full gap-5 overflow-hidden fade-up">
      {/* List panel */}
      <div className={cn("flex flex-col gap-4 overflow-y-auto", selected ? "hidden lg:flex lg:w-72 lg:shrink-0" : "flex-1")}>
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, color: "#1C1C1A" }}>Quotes</h1>
            <p className="text-sm mt-1" style={{ color: "#8A8680" }}>{total} total</p>
          </div>
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="text-xs uppercase tracking-wider outline-none cursor-pointer px-3 py-2"
            style={{ border: "1px solid #D4C9B0", backgroundColor: "#FDFAF6", color: "#8A8680", letterSpacing: "0.06em" }}>
            <option value="all">All</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-px">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-20 animate-pulse" style={{ backgroundColor: "#EDE9E1" }} />)}
          </div>
        ) : quotes.length === 0 ? (
          <div className="py-20 text-center" style={{ border: "1px dashed #D4C9B0" }}>
            <FileText style={{ width: 32, height: 32, color: "#D4C9B0", margin: "0 auto 12px" }} />
            <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#8A8680" }}>No quotes found</p>
          </div>
        ) : (
          <div style={{ border: "1px solid #EAE3D2" }}>
            {quotes.map((q) => (
              <button key={q.id} onClick={() => setSelected(q)}
                className="w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors hover:bg-[#F2EFE9]"
                style={{
                  borderBottom: "1px solid #EAE3D2",
                  backgroundColor: selected?.id === q.id ? "#F2EFE9" : "#FDFAF6",
                  borderLeft: selected?.id === q.id ? "3px solid #C8913A" : "3px solid transparent",
                }}>
                {/* Initials */}
                <div className="w-8 h-8 shrink-0 flex items-center justify-center text-[11px] font-medium"
                  style={{ backgroundColor: "#EDE9E1", color: "#8A8680" }}>
                  {q.user?.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate" style={{ color: "#1C1C1A" }}>{q.user?.name}</p>
                    <span className={cn("shrink-0 text-[9px] uppercase tracking-wider px-2 py-0.5 border font-medium", STATUS_COLORS[q.status])}>
                      {STATUS_LABELS[q.status]}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "#8A8680" }}>
                    {q.eventName || "No name"} · {q.location}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#D4C9B0" }}>{formatDate(q.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 text-xs uppercase tracking-wider disabled:opacity-30"
              style={{ border: "1px solid #D4C9B0", color: "#8A8680" }}>←</button>
            <span className="text-xs" style={{ color: "#8A8680" }}>{page}/{totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 text-xs uppercase tracking-wider disabled:opacity-30"
              style={{ border: "1px solid #D4C9B0", color: "#8A8680" }}>→</button>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="flex-1 overflow-y-auto slide-in space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#8A8680", letterSpacing: "0.1em" }}>Quote Request</p>
              <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: "#1C1C1A" }}>
                {selected.eventName || "Unnamed Event"}
              </h2>
              <p className="text-xs mt-1 font-mono" style={{ color: "#D4C9B0" }}>{selected.id}</p>
            </div>
            <button onClick={() => setSelected(null)}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[#EAE3D2] rounded-sm"
              style={{ border: "1px solid #EAE3D2" }}>
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* Status + actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn("text-[10px] uppercase tracking-wider px-3 py-1.5 border font-medium", STATUS_COLORS[selected.status])}>
              {STATUS_LABELS[selected.status]}
            </span>
            {NEXT[selected.status] && (
              <button onClick={() => advance(selected)} disabled={advancing}
                className="px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition-all disabled:opacity-50"
                style={{ backgroundColor: "#3D5A4A", color: "#F7F4EF", letterSpacing: "0.08em" }}>
                {advancing ? "Updating..." : `→ ${STATUS_LABELS[NEXT[selected.status]!]}`}
              </button>
            )}
            {selected.status === "PENDING" && (
              <button onClick={() => del(selected)}
                className="px-4 py-1.5 text-xs uppercase tracking-wider font-medium transition-all"
                style={{ border: "1px solid #C0392B", color: "#C0392B", letterSpacing: "0.08em" }}>
                Delete
              </button>
            )}
          </div>

          {/* Info cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Contact */}
            <div className="p-5 space-y-2" style={{ backgroundColor: "#FDFAF6", border: "1px solid #EAE3D2" }}>
              <p className="text-[10px] uppercase tracking-[0.12em] font-medium mb-3" style={{ color: "#8A8680" }}>Contact</p>
              <p className="font-medium text-sm" style={{ color: "#1C1C1A" }}>{selected.user?.name}</p>
              <p className="text-sm" style={{ color: "#8A8680" }}>{selected.user?.email}</p>
              <p className="text-sm" style={{ color: "#8A8680" }}>{selected.user?.phone}</p>
            </div>

            {/* Event */}
            <div className="p-5 space-y-2" style={{ backgroundColor: "#FDFAF6", border: "1px solid #EAE3D2" }}>
              <p className="text-[10px] uppercase tracking-[0.12em] font-medium mb-3" style={{ color: "#8A8680" }}>Event</p>
              {selected.eventType && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5"
                  style={{ backgroundColor: "#EDE9E1", color: "#8A8680" }}>
                  {selected.eventType}
                </span>
              )}
              <p className="font-medium text-sm" style={{ color: "#1C1C1A" }}>{selected.location}</p>
              <p className="text-sm" style={{ color: "#8A8680" }}>
                {formatDate(selected.startDate)} → {formatDate(selected.endDate)}
                <span className="ml-2 font-medium" style={{ color: "#C8913A" }}>
                  ({getRentalDays(selected.startDate, selected.endDate)} days)
                </span>
              </p>
              {selected.notes && (
                <p className="text-xs mt-2 pt-2 italic" style={{ color: "#8A8680", borderTop: "1px solid #EAE3D2" }}>
                  "{selected.notes}"
                </p>
              )}
            </div>
          </div>

          {/* Items */}
          <div style={{ backgroundColor: "#FDFAF6", border: "1px solid #EAE3D2" }}>
            <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #EAE3D2" }}>
              <p className="text-[10px] uppercase tracking-[0.12em] font-medium" style={{ color: "#8A8680" }}>
                Items ({selected.items?.length ?? 0})
              </p>
            </div>
            {selected.items && selected.items.length > 0 ? (
              <div>
                {selected.items.map((item, i) => (
                  <div key={item.id}
                    className="flex items-center justify-between px-5 py-3.5"
                    style={{ borderBottom: i < selected.items!.length - 1 ? "1px solid #EAE3D2" : "none" }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#1C1C1A" }}>{item.product?.name}</p>
                      {item.variant && (
                        <p className="text-xs mt-0.5" style={{ color: "#8A8680" }}>
                          {[item.variant.color, item.variant.dimensions].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg" style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#1C1C1A" }}>
                        ×{item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-5 text-sm" style={{ color: "#8A8680" }}>No items</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
