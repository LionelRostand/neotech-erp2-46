
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

/**
 * Format a phone number in French format
 * @param phoneNumber The phone number to format
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Apply French formatting (XX XX XX XX XX)
  return digitsOnly.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
};

/**
 * Format a time duration from minutes to hours and minutes
 * @param minutes Minutes to format
 * @returns Formatted time string (Xh Ymin)
 */
export const formatDuration = (minutes: number): string => {
  if (!minutes || isNaN(minutes)) return '0h';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  
  return `${hours}h ${mins}min`;
};

/**
 * Format a file size in bytes to a human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size (B, KB, MB, GB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
