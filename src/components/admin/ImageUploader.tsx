"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string[];              // current image URLs
  onChange: (urls: string[]) => void;
  folder?: string;              // DO Spaces sub-folder e.g. "products"
  max?: number;
  label?: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export function ImageUploader({
  value = [],
  onChange,
  folder = "products",
  max = 5,
  label = "Images",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver,  setDragOver]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    if (value.length + fileArr.length > max) {
      toast.error(`Maximum ${max} images allowed`);
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      fileArr.forEach((f) => form.append("images", f));

      const res = await fetch(`${API}/upload?folder=${folder}`, {
        method: "POST",
        body:   form,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Upload failed");

      onChange([...value, ...json.data.urls]);
      toast.success(`${json.data.count} image${json.data.count > 1 ? "s" : ""} uploaded`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [value, onChange, folder, max]);

  async function removeImage(url: string) {
    try {
      await fetch(`${API}/upload`, {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ urls: [url] }),
      });
    } catch {
      // Ignore — URL already removed from state below
    }
    onChange(value.filter((u) => u !== url));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      <label className="block text-[11px] uppercase tracking-[0.1em] font-medium"
        style={{ color: "#8A8680" }}>{label}</label>

      {/* Drop zone */}
      {value.length < max && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className="flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
          style={{
            border:          `2px dashed ${dragOver ? "#C8913A" : "#D4C9B0"}`,
            backgroundColor: dragOver ? "rgba(200,145,58,0.05)" : "#FDFAF6",
            padding:         "24px 16px",
            minHeight:       100,
          }}
        >
          {uploading ? (
            <Loader2 style={{ width: 24, height: 24, color: "#C8913A" }} className="animate-spin" />
          ) : (
            <Upload style={{ width: 20, height: 20, color: "#8A8680" }} />
          )}
          <div className="text-center">
            <p className="text-xs font-medium" style={{ color: "#1C1C1A" }}>
              {uploading ? "Uploading..." : "Click or drag images here"}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "#8A8680" }}>
              JPG, PNG, WebP — max 8 MB each · up to {max} images
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
        </div>
      )}

      {/* Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {value.map((url, i) => (
            <div key={url} className="group relative aspect-square overflow-hidden"
              style={{ backgroundColor: "#EDE9E1" }}>
              <img src={url} alt={`Image ${i + 1}`}
                className="w-full h-full"
                style={{ objectFit: "cover" }} />
              {/* Overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "rgba(28,28,26,0.55)" }}>
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                  style={{ backgroundColor: "rgba(247,244,239,0.15)", color: "#F7F4EF" }}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>
              {/* Primary badge */}
              {i === 0 && (
                <div className="absolute bottom-1 left-1 text-[8px] uppercase tracking-wider px-1.5 py-0.5 font-medium"
                  style={{ backgroundColor: "#C8913A", color: "#F7F4EF" }}>
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div className="flex items-center gap-2">
          <ImageIcon style={{ width: 13, height: 13, color: "#D4C9B0" }} />
          <span className="text-xs" style={{ color: "#D4C9B0" }}>No images yet</span>
        </div>
      )}
    </div>
  );
}
