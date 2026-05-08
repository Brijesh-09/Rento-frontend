"use client";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Category } from "@/types";

const inputStyle = {
  width: "100%", height: "40px", padding: "0 12px",
  border: "1px solid #D4C9B0", backgroundColor: "#FDFAF6",
  color: "#1C1C1A", fontSize: "14px", outline: "none",
  fontFamily: "'DM Sans', system-ui, sans-serif",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [editing,    setEditing]    = useState<Category | null | undefined>(undefined);
  const [name,       setName]       = useState("");
  const [saving,     setSaving]     = useState(false);

  async function load() {
    setLoading(true);
    try { const r = await api.categories.list(); setCategories(r.data); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  function openNew()             { setEditing(null); setName(""); }
  function openEdit(c: Category) { setEditing(c); setName(c.name); }
  function close()               { setEditing(undefined); setName(""); }

  async function save() {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      if (editing) { await api.categories.update(editing.id, { name }); toast.success("Updated"); }
      else         { await api.categories.create({ name }); toast.success("Created"); }
      close(); load();
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  async function del(c: Category) {
    if (!confirm(`Delete "${c.name}"?`)) return;
    try { await api.categories.delete(c.id); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  }

  const isOpen = editing !== undefined;

  return (
    <div className="space-y-5 fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 28, color: "#1C1C1A" }}>Categories</h1>
          <p className="text-sm mt-1" style={{ color: "#8A8680" }}>{categories.length} total</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF", letterSpacing: "0.08em" }}>
          <Plus style={{ width: 13, height: 13 }} /> New Category
        </button>
      </div>

      {/* Inline form */}
      {isOpen && (
        <div className="p-5 slide-in" style={{ backgroundColor: "#FDFAF6", border: "1px solid #C8913A" }}>
          <p className="text-xs uppercase tracking-wider mb-4 font-medium" style={{ color: "#8A8680", letterSpacing: "0.1em" }}>
            {editing ? "Edit Category" : "New Category"}
          </p>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[11px] uppercase tracking-wider mb-1.5 font-medium" style={{ color: "#8A8680" }}>Name</label>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && save()}
                placeholder="e.g. Seating" style={inputStyle} />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={save} disabled={saving}
                className="px-5 py-2 text-xs uppercase tracking-wider font-medium transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF", letterSpacing: "0.08em", height: 40 }}>
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </button>
              <button onClick={close}
                className="px-5 py-2 text-xs uppercase tracking-wider font-medium transition-colors"
                style={{ border: "1px solid #D4C9B0", color: "#8A8680", letterSpacing: "0.08em", height: 40 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-px">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse h-16" style={{ backgroundColor: "#EDE9E1" }} />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center" style={{ border: "1px dashed #D4C9B0" }}>
          <Tag style={{ width: 32, height: 32, color: "#D4C9B0", margin: "0 auto 12px" }} />
          <p className="font-display" style={{ fontFamily: "var(--font-dm-serif), Georgia, serif", color: "#8A8680" }}>No categories yet</p>
        </div>
      ) : (
        <div style={{ border: "1px solid #EAE3D2" }}>
          {categories.map((cat, i) => (
            <div key={cat.id}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[#F2EFE9]"
              style={{ borderBottom: i < categories.length - 1 ? "1px solid #EAE3D2" : "none" }}>
              <div className="flex items-center gap-4">
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: "#C8913A" }} />
                <div>
                  <p className="font-medium text-sm" style={{ color: "#1C1C1A" }}>{cat.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#8A8680" }}>
                    {cat._count?.products ?? 0} product{cat._count?.products !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(cat)}
                  className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[#EAE3D2] rounded-sm"
                  style={{ border: "1px solid #EAE3D2" }}>
                  <Pencil style={{ width: 13, height: 13, color: "#8A8680" }} />
                </button>
                <button onClick={() => del(cat)}
                  className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-red-50 rounded-sm"
                  style={{ border: "1px solid #EAE3D2" }}>
                  <Trash2 style={{ width: 13, height: 13, color: "#8A8680" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
