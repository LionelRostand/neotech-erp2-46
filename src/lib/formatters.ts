
/**
 * Format a number as currency according to French locale standards
 * @param amount The amount to format
 * @param currency The currency code (default: EUR)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format a number with thousand separators
 * @param value The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

/**
 * Format a date according to French locale standards
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDateFR(date: Date | string): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format a date - alias to formatDateFR for compatibility
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  return formatDateFR(date);
}

/**
 * Format a percentage
 * @param value The value to format as percentage
 * @returns Formatted percentage string
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}
