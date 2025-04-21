
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes conditionally
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  // Check if date is valid
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Date invalide';
  }
  
  // Format the date
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Truncate a string to a maximum length
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Get file extension from a filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

/**
 * Get initials from a name
 * Can handle both single name string or separate first and last names
 */
export function getInitials(firstName: string, lastName?: string): string {
  // If only one parameter is provided, it might be a full name that needs to be split
  if (firstName && !lastName) {
    const nameParts = firstName.trim().split(' ');
    
    if (nameParts.length >= 2) {
      // If the name contains a space, use the first letter of the first and last part
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length > 0) {
      // If there's only one name part, use the first and (if available) second letter
      return nameParts[0].length > 1 
        ? `${nameParts[0].charAt(0)}${nameParts[0].charAt(1)}`.toUpperCase()
        : `${nameParts[0].charAt(0)}`.toUpperCase();
    }
  }
  
  // Handle case where firstName or lastName might be undefined or empty
  const first = firstName && firstName.length > 0 ? firstName.charAt(0) : '';
  const last = lastName && lastName.length > 0 ? lastName.charAt(0) : '';
  
  return `${first}${last}`.toUpperCase();
}

