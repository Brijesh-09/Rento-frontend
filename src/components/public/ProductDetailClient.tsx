"use client";
import { useState } from "react";
import { ProductGallery } from "./ProductGallery";
import { ProductActions } from "./ProductActions";
import type { Product, ProductVariant } from "@/types";

export function ProductDetailClient({ product }: { product: Product }) {
  const [activeVariant, setActiveVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );

  const productImages  = product.imageUrls ?? [];
  const variantImages  = activeVariant?.imageUrls ?? [];

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Gallery — reacts to variant selection */}
      <div className="fade-up">
        <ProductGallery
          images={productImages}
          variantImages={variantImages}
          productName={product.name}
        />
      </div>

      {/* Actions — drives variant selection */}
      <div className="fade-up-1">
        <ProductActions
          product={product}
          onVariantChange={setActiveVariant}
        />
      </div>
    </div>
  );
}
