import type {
  ApiResponse,
  Category,
  Product,
  ProductVariant,
  User,
  Quote,
  QuoteStatus,
} from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || "Request failed");
  }
  return json;
}

// ── Categories ────────────────────────────────────────────────────────────────
export const api = {
  categories: {
    list: () => request<Category[]>("/categories"),
    get: (id: string) => request<Category>(`/categories/${id}`),
    create: (data: { name: string }) =>
      request<Category>("/categories", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: { name: string }) =>
      request<Category>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ deleted: boolean }>(`/categories/${id}`, { method: "DELETE" }),
  },

  // ── Products ───────────────────────────────────────────────────────────────
  products: {
    list: (params?: {
      categoryId?: string;
      search?: string;
      page?: number;
      limit?: number;
    }) => {
      const q = new URLSearchParams();
      if (params?.categoryId) q.set("categoryId", params.categoryId);
      if (params?.search)     q.set("search", params.search);
      if (params?.page)       q.set("page", String(params.page));
      if (params?.limit)      q.set("limit", String(params.limit));
      return request<Product[]>(`/products?${q.toString()}`);
    },
    get: (id: string) => request<Product>(`/products/${id}`),
    create: (data: Partial<Product>) =>
      request<Product>("/products", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Product>) =>
      request<Product>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ deleted: boolean }>(`/products/${id}`, { method: "DELETE" }),
  },

  // ── Variants ───────────────────────────────────────────────────────────────
  variants: {
    list: (productId: string) =>
      request<ProductVariant[]>(`/products/${productId}/variants`),
    create: (productId: string, data: Partial<ProductVariant>) =>
      request<ProductVariant>(`/products/${productId}/variants`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (productId: string, variantId: string, data: Partial<ProductVariant>) =>
      request<ProductVariant>(`/products/${productId}/variants/${variantId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (productId: string, variantId: string) =>
      request<{ deleted: boolean }>(
        `/products/${productId}/variants/${variantId}`,
        { method: "DELETE" }
      ),
  },

  // ── Users ──────────────────────────────────────────────────────────────────
  users: {
    list: () => request<User[]>("/users"),
    get: (id: string) => request<User>(`/users/${id}`),
    create: (data: { name: string; email: string; phone: string }) =>
      request<User>("/users", { method: "POST", body: JSON.stringify(data) }),
  },

  // ── Quotes ─────────────────────────────────────────────────────────────────
  quotes: {
    list: (params?: { status?: QuoteStatus; page?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params?.status) q.set("status", params.status);
      if (params?.page)   q.set("page", String(params.page));
      if (params?.limit)  q.set("limit", String(params.limit));
      return request<Quote[]>(`/quotes?${q.toString()}`);
    },
    get: (id: string) => request<Quote>(`/quotes/${id}`),
    create: (data: unknown) =>
      request<Quote>("/quotes", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: string, status: QuoteStatus) =>
      request<Quote>(`/quotes/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    delete: (id: string) =>
      request<{ deleted: boolean }>(`/quotes/${id}`, { method: "DELETE" }),
  },

  // ── Seed ──────────────────────────────────────────────────────────────────
  seed: () => request<unknown>("/seed", { method: "POST" }),
};
