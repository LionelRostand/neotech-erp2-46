
/**
 * Format a date according to the specified locale and options
 * @param dateString Date string to format
 * @param options DateTimeFormatOptions (defaults to standard DD/MM/YYYY)
 * @param locale Locale string (defaults to fr-FR)
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  },
  locale: string = 'fr-FR'
): string => {
  try {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date provided to formatDate:', dateString);
      return '';
    }
    
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a number as currency
 * @param value Number to format
 * @param currency Currency code (defaults to EUR)
 * @param locale Locale string (defaults to fr-FR)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: string = 'EUR',
  locale: string = 'fr-FR'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${value} ${currency}`;
  }
};

/**
 * Format a number with the specified number of decimal places
 * @param value Number to format
 * @param decimals Number of decimal places
 * @param locale Locale string (defaults to fr-FR)
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number,
  decimals: number = 2,
  locale: string = 'fr-FR'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
};
