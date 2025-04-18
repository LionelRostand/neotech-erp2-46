
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    // If the date is invalid, try to parse it as a French date (DD/MM/YYYY)
    if (typeof date === 'string' && date.includes('/')) {
      const parts = date.split('/');
      if (parts.length === 3) {
        const d = new Date(+parts[2], +parts[1] - 1, +parts[0]);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
    }
    return typeof date === 'string' ? date : '';
  }
  
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateTime(date: string | Date): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return typeof date === 'string' ? date : '';
  }
  
  return d.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Use the formatCurrency from formatters.ts instead of defining it here
// This function has been removed to avoid duplicate exports

export function calculateAge(birthDate: string | Date): number {
  if (!birthDate) return 0;
  
  let date: Date;
  
  if (typeof birthDate === 'string') {
    // If the format is DD/MM/YYYY (French format)
    if (birthDate.includes('/')) {
      const parts = birthDate.split('/');
      if (parts.length === 3) {
        date = new Date(+parts[2], +parts[1] - 1, +parts[0]);
      } else {
        date = new Date(birthDate);
      }
    } else {
      date = new Date(birthDate);
    }
  } else {
    date = birthDate;
  }
  
  if (isNaN(date.getTime())) return 0;
  
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  
  return age;
}

export function truncate(str: string, length: number): string {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

// Import the formatCurrency function from formatters.ts
export { formatCurrency } from './formatters';
