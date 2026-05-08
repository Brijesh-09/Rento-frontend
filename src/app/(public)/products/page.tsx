import { Suspense } from "react";
import { ProductsContent } from "@/components/public/ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div>
        <section style={{ backgroundColor: "#EDE9E1", borderBottom: "1px solid #D4C9B0" }}>
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
            <div className="h-4 w-32 animate-pulse rounded" style={{ backgroundColor: "#D4C9B0" }} />
            <div className="h-12 w-64 animate-pulse rounded mt-3" style={{ backgroundColor: "#D4C9B0" }} />
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-sm" style={{ backgroundColor: "#EDE9E1", aspectRatio: "3/4" }} />
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
