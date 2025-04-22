
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
