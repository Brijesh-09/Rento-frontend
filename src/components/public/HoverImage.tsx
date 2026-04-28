"use client";

interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function HoverImage({ src, alt, className = "", style = {} }: HoverImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ ...style, transition: "transform 0.7s ease-out" }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
  );
}
