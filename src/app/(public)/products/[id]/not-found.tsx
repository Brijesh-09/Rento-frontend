import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: "#F7F4EF" }}>
      <p className="text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: "#C8913A" }}>404</p>
      <h1 className="mb-4" style={{
        fontFamily: "'DM Serif Display', Georgia, serif",
        fontSize: "clamp(2rem,5vw,3.5rem)",
        color: "#1C1C1A",
        lineHeight: 1.1,
      }}>
        Page not found
      </h1>
      <p className="mb-8 text-sm max-w-sm" style={{ color: "#8A8680", lineHeight: 1.75 }}>
        The product you're looking for might have been removed or doesn't exist.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Link href="/products"
          className="px-7 py-3.5 text-sm font-medium uppercase"
          style={{ backgroundColor: "#1C1C1A", color: "#F7F4EF", letterSpacing: "0.1em" }}>
          Browse Products
        </Link>
        <Link href="/"
          className="px-7 py-3.5 text-sm font-medium uppercase"
          style={{ border: "1px solid #D4C9B0", color: "#8A8680", letterSpacing: "0.1em" }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
