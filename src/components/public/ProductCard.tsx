"use client";
import { useState } from "react";
import { Plus, Minus, ShoppingBag, Check, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id ?? "");
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const variantLabel = selectedVariant
    ? [selectedVariant.color, selectedVariant.dimensions].filter(Boolean).join(" · ")
    : "Standard";

  // Image: variant-specific first, then product-level, then placeholder
  const displayImage =
    selectedVariant?.imageUrls?.[0] ||
    product.imageUrls?.[0] ||
    null;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId:   product.id,
      productName: product.name,
      variantId:   selectedVariantId || null,
      variantLabel,
      quantity:    qty,
      basePrice:   product.basePrice,
      imageUrl:    displayImage,
    });
    setAdded(true);
    toast.success(`${product.name} added`);
    setTimeout(() => setAdded(false), 2200);
  }

  const bgColors = ["#EDE9E1","#E8E4DC","#EAE3D2","#E5E0D8"];
  const bgColor  = bgColors[product.name.charCodeAt(0) % bgColors.length];

  return (
    <div className="group flex flex-col" style={{ backgroundColor: "#FDFAF6" }}>

      {/* Image — clicks through to detail page */}
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden"
        style={{ backgroundColor: bgColor, aspectRatio: "4/3" }}>
        {displayImage ? (
          <img src={displayImage} alt={product.name}
            className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
            style={{ objectFit: "cover" }} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <svg viewBox="0 0 80 60" fill="none" style={{ width: 80, height: 60, color: "#8A8680" }}>
              <rect x="10" y="30" width="60" height="4"  rx="1" fill="currentColor"/>
              <rect x="15" y="10" width="50" height="20" rx="2" fill="currentColor"/>
              <rect x="14" y="34" width="6"  height="16" rx="1" fill="currentColor"/>
              <rect x="60" y="34" width="6"  height="16" rx="1" fill="currentColor"/>
            </svg>
          </div>
        )}

        {/* Category tag */}
        {product.category?.name && (
          <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.12em] font-medium px-2 py-1"
            style={{ backgroundColor: "#F7F4EF", color: "#8A8680" }}>
            {product.category.name}
          </span>
        )}

        {/* Low stock badge */}
        {selectedVariant?.stock != null && selectedVariant.stock > 0 && selectedVariant.stock <= 10 && (
          <span className="absolute top-3 right-3 text-[9px] uppercase tracking-widest px-2 py-1 font-medium"
            style={{ backgroundColor: "#C8913A", color: "#F7F4EF" }}>
            Low stock
          </span>
        )}

        {/* "View Details" hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ backgroundColor: "rgba(28,28,26,0.35)" }}>
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider"
            style={{ backgroundColor: "#F7F4EF", color: "#1C1C1A", letterSpacing: "0.08em" }}>
            View Details <ArrowUpRight style={{ width: 12, height: 12 }} />
          </div>
        </div>

        {/* Multi-image dots */}
        {(product.imageUrls?.length ?? 0) > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {product.imageUrls.slice(0, 4).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: i === 0 ? "#F7F4EF" : "rgba(247,244,239,0.45)" }} />
            ))}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 flex-1" style={{ borderTop: "1px solid #EAE3D2" }}>
        <div>
          <Link href={`/products/${product.id}`}
            className="block font-medium text-sm leading-snug hover:text-[#C8913A] transition-colors"
            style={{ color: "#1C1C1A" }}>
            {product.name}
          </Link>
          {product.description && (
            <p className="mt-1 text-xs leading-relaxed line-clamp-2" style={{ color: "#8A8680" }}>
              {product.description}
            </p>
          )}
        </div>

        {/* Color/variant pills — clicking updates displayed image */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5">
            {product.variants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              const label = v.color || v.dimensions || "—";
              return (
                <button key={v.id}
                  onClick={(e) => { e.preventDefault(); setSelectedVariantId(v.id); }}
                  className="text-[10px] px-2 py-1 transition-all duration-150"
                  style={{
                    border:          `1px solid ${isSelected ? "#1C1C1A" : "#D4C9B0"}`,
                    backgroundColor: isSelected ? "#1C1C1A" : "transparent",
                    color:           isSelected ? "#F7F4EF" : "#8A8680",
                  }}>
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Price + stock */}
        <div className="flex items-baseline justify-between mt-auto">
          <span style={{ color: "#1C1C1A", fontFamily: "var(--font-dm-serif), Georgia, serif", fontSize: 18 }}>
            {formatPrice(product.basePrice)}
          </span>
          {selectedVariant?.stock != null && (
            <span className="text-[10px] uppercase tracking-wider"
              style={{ color: selectedVariant.stock > 0 ? "#3D5A4A" : "#C0392B" }}>
              {selectedVariant.stock > 0 ? `${selectedVariant.stock} avail.` : "Out of stock"}
            </span>
          )}
        </div>

        {/* Qty stepper + Add to Quote */}
        <div className="flex gap-2">
          <div className="flex items-center shrink-0" style={{ border: "1px solid #D4C9B0" }}>
            <button onClick={(e) => { e.preventDefault(); setQty(Math.max(1, qty - 1)); }}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[#EAE3D2]">
              <Minus style={{ width: 12, height: 12 }} />
            </button>
            <span className="w-8 text-center text-sm font-medium">{qty}</span>
            <button onClick={(e) => { e.preventDefault(); setQty(qty + 1); }}
              className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-[#EAE3D2]">
              <Plus style={{ width: 12, height: 12 }} />
            </button>
          </div>

          <button onClick={handleAdd} disabled={added}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 text-xs font-medium uppercase transition-all duration-200"
            style={{
              backgroundColor: added ? "#3D5A4A" : "#1C1C1A",
              color:           "#F7F4EF",
              letterSpacing:   "0.08em",
            }}>
            {added
              ? <><Check style={{ width: 12, height: 12 }} /> Added</>
              : <><ShoppingBag style={{ width: 12, height: 12 }} /> Add to Quote</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
