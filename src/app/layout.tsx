import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: { default: "FURNR — Event Furniture Rentals", template: "%s | FURNR" },
  description: "Premium furniture rentals for events, conferences & exhibitions across India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load fonts — gracefully skipped if network unavailable at build time */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">
        {children}
        <Toaster
          richColors
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "'DM Sans', system-ui, sans-serif",
              borderRadius: "2px",
              border: "1px solid #D4C9B0",
              background: "#F7F4EF",
              color: "#1C1C1A",
            },
          }}
        />
      </body>
    </html>
  );
}
