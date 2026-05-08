"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface ProductGalleryProps {
  images: string[];          // base product images
  variantImages?: string[];  // current variant images (override gallery)
  productName: string;
}

export function ProductGallery({ images, variantImages, productName }: ProductGalleryProps) {
  // When variant images exist, show them first; fall back to product images
  const displayImages = (variantImages && variantImages.length > 0)
    ? [...variantImages, ...images.filter((u) => !variantImages.includes(u))]
    : images;

  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  // Reset to first image whenever the set changes (e.g. variant switched)
  useEffect(() => {
    setActive(0);
    setZoomed(false);
  }, [variantImages]);

  const hasImages = displayImages.length > 0;
  const prev = () => { setActive((i) => (i - 1 + displayImages.length) % displayImages.length); setZoomed(false); };
  const next = () => { setActive((i) => (i + 1) % displayImages.length); setZoomed(false); };

  return (
    <div className="flex flex-col gap-3 select-none">

      {/* ── Main viewer ── */}
      <div className="relative overflow-hidden group" style={{ backgroundColor: "#EDE9E1", aspectRatio: "1/1" }}>
        {hasImages ? (
          <>
            <div className="w-full h-full overflow-hidden" style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
              onClick={() => setZoomed(!zoomed)}>
              <img
                src={displayImages[active]}
                alt={`${productName} — ${active + 1}`}
                className="w-full h-full transition-transform duration-500 ease-out"
                style={{
                  objectFit:  "cover",
                  transform:  zoomed ? "scale(1.75)" : "scale(1)",
                  transformOrigin: "center center",
                }}
              />
            </div>

            {/* Zoom badge */}
            <div className="absolute top-3 right-3 transition-opacity"
              style={{ opacity: zoomed ? 1 : undefined }}>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "rgba(28,28,26,0.65)", color: "#F7F4EF", backdropFilter: "blur(4px)" }}>
                {zoomed
                  ? <><ZoomOut style={{ width: 11, height: 11 }} /> Click to zoom out</>
                  : <><ZoomIn  style={{ width: 11, height: 11 }} /> Click to zoom in</>
                }
              </div>
            </div>

            {/* Nav arrows */}
            {displayImages.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  style={{ backgroundColor: "rgba(247,244,239,0.92)", color: "#1C1C1A" }}>
                  <ChevronLeft style={{ width: 20, height: 20 }} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  style={{ backgroundColor: "rgba(247,244,239,0.92)", color: "#1C1C1A" }}>
                  <ChevronRight style={{ width: 20, height: 20 }} />
                </button>
              </>
            )}

            {/* Image counter */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-3 right-3 px-2.5 py-1 text-[10px] font-medium"
                style={{ backgroundColor: "rgba(28,28,26,0.55)", color: "#F7F4EF", backdropFilter: "blur(4px)" }}>
                {active + 1} / {displayImages.length}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg viewBox="0 0 80 60" fill="none" style={{ width: 100, color: "#8A8680" }}>
              <rect x="10" y="30" width="60" height="4"  rx="1" fill="currentColor"/>
              <rect x="15" y="10" width="50" height="20" rx="2" fill="currentColor"/>
              <rect x="14" y="34" width="6"  height="16" rx="1" fill="currentColor"/>
              <rect x="60" y="34" width="6"  height="16" rx="1" fill="currentColor"/>
            </svg>
          </div>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {displayImages.length > 1 && (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(displayImages.length, 6)}, 1fr)` }}>
          {displayImages.map((img, i) => (
            <button key={i} onClick={() => { setActive(i); setZoomed(false); }}
              className="overflow-hidden transition-all"
              style={{
                aspectRatio: "1/1",
                border:   `2px solid ${i === active ? "#C8913A" : "#EAE3D2"}`,
                opacity:  i === active ? 1 : 0.55,
              }}>
              <img src={img} alt={`${productName} thumb ${i + 1}`}
                className="w-full h-full" style={{ objectFit: "cover" }} />
            </button>
          ))}
        </div>
      )}

      {/* ── Dot strip for > 6 images ── */}
      {displayImages.length > 6 && (
        <div className="flex justify-center gap-1.5 mt-1">
          {displayImages.map((_, i) => (
            <button key={i} onClick={() => { setActive(i); setZoomed(false); }}
              className="rounded-full transition-all"
              style={{
                width:           i === active ? 18 : 5,
                height:          5,
                backgroundColor: i === active ? "#C8913A" : "#D4C9B0",
              }} />
          ))}
        </div>
      )}
    </div>
  );
}
