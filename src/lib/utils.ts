
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatCurrency as formatCurrencyFn, formatDate as formatDateFn } from "./formatters";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  return formatCurrencyFn(amount, currency);
}

export function formatDate(date: Date | string): string {
  return formatDateFn(date);
}

/**
 * Generate initials from a full name
 * @param name Full name to generate initials from
 * @returns Initials (typically 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
