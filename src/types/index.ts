export interface Category {
  id: string;
  name: string;
  createdAt: string;
  products?: Product[];
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  basePrice: number | null;
  createdAt: string;
  category?: Category;
  variants?: ProductVariant[];
  _count?: { variants: number };
}

export interface ProductVariant {
  id: string;
  productId: string;
  color: string | null;
  dimensions: string | null;
  stock: number | null;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  quotes?: Quote[];
  _count?: { quotes: number };
}

export interface QuoteItem {
  id: string;
  quoteId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product?: Pick<Product, "id" | "name" | "basePrice">;
  variant?: Pick<ProductVariant, "id" | "color" | "dimensions"> | null;
}

export interface Quote {
  id: string;
  userId: string;
  eventName: string | null;
  eventType: string | null;
  location: string;
  startDate: string;
  endDate: string;
  notes: string | null;
  status: QuoteStatus;
  createdAt: string;
  user?: Pick<User, "id" | "name" | "email" | "phone">;
  items?: QuoteItem[];
}

export type QuoteStatus = "PENDING" | "REVIEWING" | "QUOTED" | "CONFIRMED" | "CLOSED";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    pagination?: Pagination;
    message?: string;
    summary?: Record<string, number>;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Cart (client-side only — no DB, lives in localStorage)
export interface CartItem {
  productId: string;
  productName: string;
  variantId: string | null;
  variantLabel: string;
  quantity: number;
  basePrice: number | null;
}
