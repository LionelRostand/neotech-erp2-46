
/**
 * Format a date according to the specified locale and options
 * @param dateString Date string to format
 * @param options DateTimeFormatOptions (defaults to standard DD/MM/YYYY)
 * @param locale Locale string (defaults to fr-FR)
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | null | undefined, 
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  },
  locale: string = 'fr-FR'
): string => {
  try {
    if (!dateString) return '';
    
    // Validate that the input is actually a string
    if (typeof dateString !== 'string') {
      console.warn('Non-string value provided to formatDate:', dateString);
      return '';
    }
    
    // Handle exotic date formats or values that could be problematic
    if (dateString === 'Invalid Date' || dateString === 'NaN' || dateString === 'undefined') {
      console.warn('Invalid date string literal:', dateString);
      return '';
    }
    
    // Special case for timestamps stored as numbers
    let date: Date;
    if (/^\d+$/.test(dateString)) {
      // This might be a numeric timestamp
      const timestamp = parseInt(dateString, 10);
      date = new Date(timestamp);
    } else {
      // Make sure the date is valid first
      const timestamp = Date.parse(dateString);
      if (isNaN(timestamp)) {
        console.warn('Invalid date provided to formatDate:', dateString);
        return '';
      }
      date = new Date(dateString);
    }
    
    // Double-check the date is valid (some valid timestamps can produce invalid dates)
    if (
      isNaN(date.getTime()) || 
      date.getFullYear() < 1900 || 
      date.getFullYear() > 2100
    ) {
      console.warn('Date out of reasonable range:', dateString);
      return '';
    }
    
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error, 'for input:', dateString);
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

/**
 * Format a phone number according to the French format or other formats
 * @param phoneNumber Phone number to format
 * @param countryCode Country code for formatting rules (defaults to FR)
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (
  phoneNumber: string,
  countryCode: string = 'FR'
): string => {
  try {
    if (!phoneNumber) return '';
    
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    if (countryCode === 'FR') {
      // France: format as XX XX XX XX XX
      if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
      }
    }
    
    // If no specific format matched or number is not the right length, return the cleaned version
    return cleaned;
  } catch (error) {
    console.error('Error formatting phone number:', error);
    return phoneNumber;
  }
};
