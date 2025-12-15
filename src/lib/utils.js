import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

// Helper to merge Tailwind class names conditionally
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
