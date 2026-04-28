"use client";
import { useState, useEffect, useCallback } from "react";
import type { CartItem } from "@/types";

const CART_KEY = "fr_cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const save = useCallback((next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  }, []);

  const addItem = useCallback(
    (item: CartItem) => {
      const current = readCart();
      const idx = current.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );
      if (idx >= 0) {
        current[idx].quantity += item.quantity;
        save([...current]);
      } else {
        save([...current, item]);
      }
    },
    [save]
  );

  const updateQty = useCallback(
    (productId: string, variantId: string | null, quantity: number) => {
      const current = readCart();
      if (quantity <= 0) {
        save(current.filter((i) => !(i.productId === productId && i.variantId === variantId)));
      } else {
        save(
          current.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, quantity }
              : i
          )
        );
      }
    },
    [save]
  );

  const removeItem = useCallback(
    (productId: string, variantId: string | null) => {
      save(readCart().filter((i) => !(i.productId === productId && i.variantId === variantId)));
    },
    [save]
  );

  const clearCart = useCallback(() => save([]), [save]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  return { items, addItem, updateQty, removeItem, clearCart, totalItems };
}
