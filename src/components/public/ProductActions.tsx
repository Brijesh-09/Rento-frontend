"use client";
import { useState, useEffect } from "react";
import { Plus, Minus, ShoppingBag, Check, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";

interface Props {
  product: Product;
  onVariantChange?: (variant: ProductVariant | undefined) => void;
}

export function ProductActions({ product, onVariantChange }: Props) {
  const { addItem, items } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants?.[0]?.id ?? ""
  );
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const variantLabel    = selectedVariant
    ? [selectedVariant.color, selectedVariant.dimensions].filter(Boolean).join(" · ")
    : "Standard";
  const alreadyInCart   = items.some(
    (i) => i.productId === product.id && i.variantId === selectedVariantId
  );
  const outOfStock = selectedVariant?.stock != null && selectedVariant.stock === 0;

  // Notify parent so gallery can switch image
  useEffect(() => {
    onVariantChange?.(selectedVariant);
  }, [selectedVariantId]);

  function handleAdd() {
    if (outOfStock) return;
    const displayImage =
      selectedVariant?.imageUrls?.[0] ||
      product.imageUrls?.[0] ||
      null;
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
    toast.success(`${product.name} added to your quote list`);
    setTimeout(() => setAdded(false), 2500);
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  }

  // Group variants by color for the color swatch row
  const colors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  ) as string[];

  // Known colors → hex mapping for swatches
  const COLOR_HEX: Record<string, string> = {
    black: "#1C1C1A", white: "#F7F4EF", gold: "#C8913A", golden: "#C8913A",
    silver: "#C0C0C0", chrome: "#C0C0C0", beige: "#EAE3D2", brown: "#8B5E3C",
    grey: "#8A8680", gray: "#8A8680", red: "#C0392B", blue: "#2980B9",
    green: "#3D5A4A", wooden: "#8B5E3C", graphite: "#4A4A48", maroon: "#800000",
    navy: "#1B2A4A", cream: "#F7F4EF", natural: "#D4C9B0",
  };

  function getSwatchColor(color: string) {
    return COLOR_HEX[color.toLowerCase()] ?? "#D4C9B0";
  }

  return (
    <div className="space-y-7">

      {/* ── Price ── */}
      <div className="flex items-baseline gap-3">
        <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 36, color: "#1C1C1A", lineHeight: 1 }}>
          {formatPrice(product.basePrice)}
        </span>
        {product.basePrice && (
          <span className="text-xs uppercase tracking-wider" style={{ color: "#8A8680" }}>/ day</span>
        )}
      </div>

      {/* ── Color swatches (if variants have colors) ── */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[11px] uppercase tracking-[0.12em] font-medium" style={{ color: "#8A8680" }}>
              Color
            </p>
            <span className="text-[11px] font-medium" style={{ color: "#1C1C1A" }}>
              — {selectedVariant?.color ?? colors[0]}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.variants
              ?.filter((v, i, arr) => arr.findIndex((x) => x.color === v.color) === i) // unique by color
              .map((v) => {
                const isSelected = v.id === selectedVariantId ||
                  (selectedVariant?.color === v.color);
                const hex = getSwatchColor(v.color ?? "");
                const isLight = ["#F7F4EF","#EAE3D2","#D4C9B0","#C0C0C0"].includes(hex);
                return (
                  <button
                    key={v.id}
                    title={v.color ?? ""}
                    onClick={() => setSelectedVariantId(v.id)}
                    className="relative transition-all duration-150"
                    style={{
                      width:  36,
                      height: 36,
                      backgroundColor: hex,
                      border: isSelected
                        ? `3px solid #C8913A`
                        : `2px solid ${isLight ? "#D4C9B0" : "transparent"}`,
                      outline: isSelected ? "2px solid #F7F4EF" : "none",
                      outlineOffset: isSelected ? "-5px" : 0,
                    }}
                  >
                    {v.stock === 0 && (
                      // Diagonal strikethrough for out of stock
                      <div className="absolute inset-0 overflow-hidden opacity-60">
                        <div style={{
                          position: "absolute", top: "50%", left: -4, right: -4, height: 1.5,
                          backgroundColor: isLight ? "#8A8680" : "#F7F4EF",
                          transform: "rotate(-45deg)",
                        }} />
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Size / Dimension selector (if variants have dimensions) ── */}
      {product.variants?.some((v) => v.dimensions) && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] font-medium mb-3" style={{ color: "#8A8680" }}>
            Size / Dimensions
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants
              ?.filter((v) => v.dimensions)
              .filter((v, i, arr) => arr.findIndex((x) => x.dimensions === v.dimensions) === i)
              .map((v) => {
                const isSelected = v.id === selectedVariantId ||
                  selectedVariant?.dimensions === v.dimensions;
                return (
                  <button key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className="px-4 py-2 text-xs transition-all duration-150"
                    style={{
                      border:          `1.5px solid ${isSelected ? "#1C1C1A" : "#D4C9B0"}`,
                      backgroundColor: isSelected ? "#1C1C1A" : "#FDFAF6",
                      color:           isSelected ? "#F7F4EF" : "#8A8680",
                    }}>
                    {v.dimensions}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* ── Full variant cards (if no color/dimension breakdown — fallback) ── */}
      {colors.length === 0 && !product.variants?.some((v) => v.dimensions) && product.variants && product.variants.length > 1 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] font-medium mb-3" style={{ color: "#8A8680" }}>Variant</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v, i) => {
              const isSelected = v.id === selectedVariantId;
              return (
                <button key={v.id} onClick={() => setSelectedVariantId(v.id)}
                  className="px-4 py-2.5 text-xs transition-all duration-150"
                  style={{
                    border:          `1.5px solid ${isSelected ? "#1C1C1A" : "#D4C9B0"}`,
                    backgroundColor: isSelected ? "#1C1C1A" : "#FDFAF6",
                    color:           isSelected ? "#F7F4EF" : "#8A8680",
                  }}>
                  Variant {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Selected variant stock ── */}
      {selectedVariant?.stock != null && (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: selectedVariant.stock > 10 ? "#3D5A4A" : selectedVariant.stock > 0 ? "#C8913A" : "#C0392B" }} />
          <span className="text-xs" style={{ color: "#8A8680" }}>
            {selectedVariant.stock > 10
              ? `${selectedVariant.stock} units available`
              : selectedVariant.stock > 0
                ? `Only ${selectedVariant.stock} left`
                : "Currently out of stock"}
          </span>
        </div>
      )}

      {/* ── Qty ── */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.12em] font-medium mb-3" style={{ color: "#8A8680" }}>Quantity</p>
        <div className="flex items-center" style={{ border: "1px solid #D4C9B0", width: "fit-content" }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-11 h-11 flex items-center justify-center transition-colors hover:bg-[#EAE3D2]">
            <Minus style={{ width: 14, height: 14 }} />
          </button>
          <span className="w-12 text-center font-medium" style={{ color: "#1C1C1A" }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)}
            className="w-11 h-11 flex items-center justify-center transition-colors hover:bg-[#EAE3D2]">
            <Plus style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>

      {/* ── CTAs ── */}
      <div className="flex flex-col gap-2.5">
        <button onClick={handleAdd} disabled={added || outOfStock}
          className="w-full flex items-center justify-center gap-3 py-4 text-sm font-medium uppercase transition-all duration-300 disabled:opacity-50"
          style={{
            backgroundColor: added ? "#3D5A4A" : outOfStock ? "#D4C9B0" : "#C8913A",
            color: "#F7F4EF",
            letterSpacing: "0.1em",
          }}>
          {added
            ? <><Check style={{ width: 16, height: 16 }} /> Added to Quote</>
            : outOfStock
              ? "Out of Stock"
              : <><ShoppingBag style={{ width: 16, height: 16 }} /> Add to Quote</>
          }
        </button>

        {alreadyInCart && !added && (
          <Link href="/quote"
            className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-medium uppercase transition-all hover:bg-[#1C1C1A] hover:text-[#F7F4EF]"
            style={{ border: "1.5px solid #1C1C1A", color: "#1C1C1A", letterSpacing: "0.1em" }}>
            View Quote List <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        )}
      </div>

      {/* ── Share ── */}
      <button onClick={handleShare}
        className="flex items-center gap-2 text-xs uppercase tracking-wider transition-colors hover:text-[#C8913A]"
        style={{ color: "#8A8680", letterSpacing: "0.1em" }}>
        <Share2 style={{ width: 12, height: 12 }} /> Share this product
      </button>
    </div>
  );
}
