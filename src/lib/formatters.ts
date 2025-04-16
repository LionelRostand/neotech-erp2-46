
/**
 * Format a number as a currency amount in Euros
 * @param value The number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  if (isNaN(value)) return '0 €';
  
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0 
  }).format(value);
};

/**
 * Format a number as a percentage
 * @param value The number to format
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number): string => {
  if (isNaN(value)) return '0%';
  
  return new Intl.NumberFormat('fr-FR', { 
    style: 'percent',
    maximumFractionDigits: 1
  }).format(value / 100);
};

/**
 * Format a date in French format
 * @param date The date to format
 * @returns Formatted date string (DD/MM/YYYY)
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date invalide';
  }
};
