"use client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Package, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Category, Product, ProductVariant } from "@/types";

const iStyle: React.CSSProperties = {
  width: "100%", height: "40px", padding: "0 12px",
  border: "1px solid #D4C9B0", backgroundColor: "#FDFAF6",
  color: "#1C1C1A", fontSize: "14px", outline: "none",
  fontFamily: "'DM Sans', system-ui, sans-serif",
};
const lStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", textTransform: "uppercase",
  letterSpacing: "0.1em", fontWeight: 500, color: "#8A8680", marginBottom: "6px",
};

const BLANK_P = { name: "", description: "", categoryId: "", basePrice: "", imageUrls: [] as string[] };
const BLANK_V = { color: "", dimensions: "", stock: "", imageUrls: [] as string[] };

export default function AdminProductsPage() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [expanded,   setExpanded]   = useState<string | null>(null);
  const [search,     setSearch]     = useState("");
  const [catFilter,  setCatFilter]  = useState("");
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(0);
  const LIMIT = 15;

  const [showPForm, setShowPForm] = useState(false);
  const [editProd,  setEditProd]  = useState<Product | null>(null);
  const [pForm,     setPForm]     = useState({ ...BLANK_P });
  const [savingP,   setSavingP]   = useState(false);

  const [showVForm, setShowVForm] = useState<string | null>(null);
  const [editVar,   setEditVar]   = useState<ProductVariant | null>(null);
  const [vForm,     setVForm]     = useState({ ...BLANK_V });
  const [savingV,   setSavingV]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.products.list({ search: search || undefined, categoryId: catFilter || undefined, page, limit: LIMIT });
      setProducts(r.data);
      setTotal(r.meta?.pagination?.total ?? 0);
    } finally { setLoading(false); }
  }, [search, catFilter, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { api.categories.list().then((r) => setCategories(r.data)); }, []);

  function openNewProduct() { setEditProd(null); setPForm({ ...BLANK_P }); setShowPForm(true); }
  function openEditProduct(p: Product) {
    setEditProd(p);
    setPForm({ name: p.name, description: p.description ?? "", categoryId: p.categoryId, basePrice: p.basePrice?.toString() ?? "", imageUrls: p.imageUrls ?? [] });
    setShowPForm(true);
  }
  function closePForm() { setShowPForm(false); setEditProd(null); }

  async function saveProduct() {
    if (!pForm.name || !pForm.categoryId) { toast.error("Name and category required"); return; }
    setSavingP(true);
    try {
      const payload: any = {
        name: pForm.name,
        description: pForm.description || undefined,
        categoryId: pForm.categoryId,
        basePrice: pForm.basePrice ? parseFloat(pForm.basePrice) : undefined,
        imageUrls: pForm.imageUrls,
      };
      if (editProd) { await api.products.update(editProd.id, payload); toast.success("Product updated"); }
      else          { await api.products.create(payload);               toast.success("Product created"); }
      closePForm(); load();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingP(false); }
  }

  async function delProduct(p: Product) {
    if (!confirm(`Delete "${p.name}"? Images will also be removed.`)) return;
    try { await api.products.delete(p.id); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  }

  function openNewVariant(productId: string) { setEditVar(null); setVForm({ ...BLANK_V }); setShowVForm(productId); }
  function openEditVariant(v: ProductVariant) {
    setEditVar(v);
    setVForm({ color: v.color ?? "", dimensions: v.dimensions ?? "", stock: v.stock?.toString() ?? "", imageUrls: v.imageUrls ?? [] });
    setShowVForm(v.productId);
  }
  function closeVForm() { setShowVForm(null); setEditVar(null); }

  async function saveVariant() {
    if (!showVForm) return;
    setSavingV(true);
    try {
      const payload: any = {
        color:      vForm.color      || undefined,
        dimensions: vForm.dimensions || undefined,
        stock:      vForm.stock ? parseInt(vForm.stock) : undefined,
        imageUrls:  vForm.imageUrls,
      };
      if (editVar) { await api.variants.update(editVar.productId, editVar.id, payload); toast.success("Variant updated"); }
      else         { await api.variants.create(showVForm, payload);                      toast.success("Variant added"); }
      closeVForm(); load();
    } catch (err: any) { toast.error(err.message); }
    finally { setSavingV(false); }
  }

  async function delVariant(v: ProductVariant) {
    if (!confirm("Delete this variant? Its images will also be removed.")) return;
    try { await api.variants.delete(v.productId, v.id); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-5 fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, color: "#1C1C1A" }}>Products</h1>
          <p className="text-sm mt-1" style={{ color: "#8A8680" }}>{total} total</p>
        </div>
        <button onClick={openNewProduct}
          className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium"
          style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF", letterSpacing: "0.08em" }}>
          <Plus style={{ width: 13, height: 13 }} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products..." style={{ ...iStyle, width: "auto", minWidth: 220 }} />
        <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          style={{ ...iStyle, width: "auto", cursor: "pointer" }}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Product form */}
      {showPForm && (
        <div className="p-5 slide-in space-y-5" style={{ backgroundColor: "#FDFAF6", border: "1px solid #C8913A" }}>
          <p className="text-xs uppercase tracking-wider font-medium" style={{ color: "#8A8680", letterSpacing: "0.1em" }}>
            {editProd ? "Edit Product" : "New Product"}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label style={lStyle}>Name *</label>
              <input value={pForm.name} onChange={(e) => setPForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Chiavari Chair" style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Category *</label>
              <select value={pForm.categoryId} onChange={(e) => setPForm((f) => ({ ...f, categoryId: e.target.value }))}
                style={{ ...iStyle, cursor: "pointer" }}>
                <option value="">Select category...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={lStyle}>Base Price (₹) — optional</label>
              <input type="number" value={pForm.basePrice}
                onChange={(e) => setPForm((f) => ({ ...f, basePrice: e.target.value }))}
                placeholder="e.g. 150" style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Description — optional</label>
              <input value={pForm.description}
                onChange={(e) => setPForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description of the product" style={iStyle} />
            </div>
          </div>

          {/* Product-level images */}
          <div style={{ borderTop: "1px solid #EAE3D2", paddingTop: 16 }}>
            <ImageUploader
              value={pForm.imageUrls}
              onChange={(urls) => setPForm((f) => ({ ...f, imageUrls: urls }))}
              folder="products"
              max={8}
              label="Product Images — first image is the primary display photo"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={saveProduct} disabled={savingP}
              className="px-5 py-2 text-xs uppercase tracking-wider font-medium disabled:opacity-50"
              style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF", letterSpacing: "0.08em" }}>
              {savingP ? "Saving..." : editProd ? "Update Product" : "Create Product"}
            </button>
            <button onClick={closePForm}
              className="px-5 py-2 text-xs uppercase tracking-wider font-medium"
              style={{ border: "1px solid #D4C9B0", color: "#8A8680", letterSpacing: "0.08em" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Product list */}
      {loading ? (
        <div className="space-y-px">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse" style={{ backgroundColor: "#EDE9E1" }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center" style={{ border: "1px dashed #D4C9B0" }}>
          <Package style={{ width: 32, height: 32, color: "#D4C9B0", margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", color: "#8A8680" }}>No products found</p>
        </div>
      ) : (
        <div style={{ border: "1px solid #EAE3D2" }}>
          {products.map((p) => (
            <div key={p.id}>
              {/* Product row */}
              <div className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#F2EFE9]"
                style={{ borderBottom: "1px solid #EAE3D2", backgroundColor: "#FDFAF6" }}>
                <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} style={{ color: "#D4C9B0" }}>
                  {expanded === p.id
                    ? <ChevronDown style={{ width: 15, height: 15 }} />
                    : <ChevronRight style={{ width: 15, height: 15 }} />}
                </button>

                {/* Thumbnail */}
                {p.imageUrls?.[0] ? (
                  <img src={p.imageUrls[0]} alt={p.name} className="object-cover shrink-0"
                    style={{ width: 40, height: 40, backgroundColor: "#EDE9E1" }} />
                ) : (
                  <div className="shrink-0 flex items-center justify-center"
                    style={{ width: 40, height: 40, backgroundColor: "#EDE9E1" }}>
                    <Package style={{ width: 16, height: 16, color: "#D4C9B0" }} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm" style={{ color: "#1C1C1A" }}>{p.name}</p>
                    <span className="text-[10px] px-2 py-0.5 uppercase tracking-wider"
                      style={{ backgroundColor: "#EDE9E1", color: "#8A8680" }}>
                      {p.category?.name}
                    </span>
                    {p.imageUrls && p.imageUrls.length > 0 && (
                      <span className="flex items-center gap-1 text-[10px]" style={{ color: "#C8913A" }}>
                        <ImageIcon style={{ width: 10, height: 10 }} /> {p.imageUrls.length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#8A8680" }}>
                    {formatPrice(p.basePrice)} · {p._count?.variants ?? 0} variant{p._count?.variants !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => openEditProduct(p)}
                    className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[#EAE3D2]"
                    style={{ border: "1px solid #EAE3D2" }}>
                    <Pencil style={{ width: 13, height: 13, color: "#8A8680" }} />
                  </button>
                  <button onClick={() => delProduct(p)}
                    className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-red-50"
                    style={{ border: "1px solid #EAE3D2" }}>
                    <Trash2 style={{ width: 13, height: 13, color: "#8A8680" }} />
                  </button>
                </div>
              </div>

              {/* Variants panel */}
              {expanded === p.id && (
                <div className="px-10 py-5" style={{ backgroundColor: "#F2EFE9", borderBottom: "1px solid #EAE3D2" }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: "#8A8680" }}>
                      Variants — color, dimensions and images are all optional
                    </p>
                    <button onClick={() => openNewVariant(p.id)}
                      className="flex items-center gap-1.5 text-xs uppercase tracking-wider px-3 py-1.5 font-medium"
                      style={{ border: "1px solid #D4C9B0", color: "#8A8680", letterSpacing: "0.08em", backgroundColor: "#FDFAF6" }}>
                      <Plus style={{ width: 11, height: 11 }} /> Add Variant
                    </button>
                  </div>

                  {/* Variant form */}
                  {showVForm === p.id && (
                    <div className="mb-4 p-5 space-y-5" style={{ backgroundColor: "#FDFAF6", border: "1px solid #C8913A" }}>
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "#C8913A" }}>
                        {editVar ? "Edit variant" : "New variant"} — all fields optional
                      </p>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <label style={lStyle}>Color</label>
                          <input value={vForm.color}
                            onChange={(e) => setVForm((f) => ({ ...f, color: e.target.value }))}
                            placeholder="e.g. Black, Gold, White" style={iStyle} />
                        </div>
                        <div>
                          <label style={lStyle}>Dimensions</label>
                          <input value={vForm.dimensions}
                            onChange={(e) => setVForm((f) => ({ ...f, dimensions: e.target.value }))}
                            placeholder="e.g. 45x45x90 cm" style={iStyle} />
                        </div>
                        <div>
                          <label style={lStyle}>Stock Quantity</label>
                          <input type="number" value={vForm.stock}
                            onChange={(e) => setVForm((f) => ({ ...f, stock: e.target.value }))}
                            placeholder="e.g. 50" style={iStyle} />
                        </div>
                      </div>

                      {/* Variant images */}
                      <div style={{ borderTop: "1px solid #EAE3D2", paddingTop: 14 }}>
                        <ImageUploader
                          value={vForm.imageUrls}
                          onChange={(urls) => setVForm((f) => ({ ...f, imageUrls: urls }))}
                          folder="variants"
                          max={5}
                          label="Variant Images — shown when this variant is selected on the product page"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button onClick={saveVariant} disabled={savingV}
                          className="px-5 py-2 text-xs uppercase tracking-wider font-medium disabled:opacity-50"
                          style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF", letterSpacing: "0.08em" }}>
                          {savingV ? "Saving..." : editVar ? "Update Variant" : "Add Variant"}
                        </button>
                        <button onClick={closeVForm}
                          className="px-5 py-2 text-xs uppercase tracking-wider font-medium"
                          style={{ border: "1px solid #D4C9B0", color: "#8A8680", letterSpacing: "0.08em" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Variant cards */}
                  {p.variants && p.variants.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {p.variants.map((v) => (
                        <div key={v.id} className="p-3 flex gap-3"
                          style={{ backgroundColor: "#FDFAF6", border: "1px solid #EAE3D2" }}>
                          {/* Variant thumbnail */}
                          {v.imageUrls?.[0] ? (
                            <img src={v.imageUrls[0]} alt=""
                              className="object-cover shrink-0"
                              style={{ width: 52, height: 52, backgroundColor: "#EDE9E1" }} />
                          ) : (
                            <div className="shrink-0 flex items-center justify-center"
                              style={{ width: 52, height: 52, backgroundColor: "#EDE9E1" }}>
                              <ImageIcon style={{ width: 16, height: 16, color: "#D4C9B0" }} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium" style={{ color: "#1C1C1A" }}>
                              {v.color || "—"}
                            </p>
                            {v.dimensions && (
                              <p className="text-xs mt-0.5 font-mono" style={{ color: "#8A8680" }}>{v.dimensions}</p>
                            )}
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-[10px]" style={{ color: (v.stock ?? 0) > 0 ? "#3D5A4A" : "#C0392B" }}>
                                {v.stock != null ? `${v.stock} in stock` : "Stock: —"}
                              </span>
                              {v.imageUrls && v.imageUrls.length > 0 && (
                                <span className="text-[10px] flex items-center gap-0.5" style={{ color: "#C8913A" }}>
                                  <ImageIcon style={{ width: 9, height: 9 }} />{v.imageUrls.length}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <button onClick={() => openEditVariant(v)}
                              className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-[#EAE3D2]">
                              <Pencil style={{ width: 11, height: 11, color: "#8A8680" }} />
                            </button>
                            <button onClick={() => delVariant(v)}
                              className="w-7 h-7 flex items-center justify-center rounded-sm hover:bg-red-50">
                              <Trash2 style={{ width: 11, height: 11, color: "#8A8680" }} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs italic" style={{ color: "#D4C9B0" }}>
                      No variants yet — add one to define colors, dimensions and per-variant images.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}
            className="px-5 py-2 text-xs uppercase tracking-wider font-medium disabled:opacity-30"
            style={{ border: "1px solid #D4C9B0", color: "#1C1C1A", letterSpacing: "0.08em" }}>
            ← Prev
          </button>
          <span className="text-sm" style={{ color: "#8A8680" }}>{page}/{totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
            className="px-5 py-2 text-xs uppercase tracking-wider font-medium disabled:opacity-30"
            style={{ border: "1px solid #D4C9B0", color: "#1C1C1A", letterSpacing: "0.08em" }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
