import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null) {
  if (price == null) return "Get Quote";
  return `₹${price.toLocaleString("en-IN")}`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getRentalDays(start: string, end: string) {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING:   "Pending",
  REVIEWING: "Reviewing",
  QUOTED:    "Quoted",
  CONFIRMED: "Confirmed",
  CLOSED:    "Closed",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  REVIEWING: "bg-blue-50 text-blue-700 border-blue-200",
  QUOTED:    "bg-purple-50 text-purple-700 border-purple-200",
  CONFIRMED: "bg-green-50 text-green-700 border-green-200",
  CLOSED:    "bg-gray-50 text-gray-600 border-gray-200",
};
