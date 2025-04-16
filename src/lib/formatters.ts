
/**
 * Format a date according to the specified locale and options
 * @param dateInput Date string, Date object, or null/undefined to format
 * @param options DateTimeFormatOptions (defaults to standard DD/MM/YYYY)
 * @param locale Locale string (defaults to fr-FR)
 * @returns Formatted date string
 */
export const formatDate = (
  dateInput: string | Date | null | undefined, 
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  },
  locale: string = 'fr-FR'
): string => {
  try {
    if (!dateInput) return '';
    
    // Handle Date objects directly
    if (dateInput instanceof Date) {
      if (isNaN(dateInput.getTime())) {
        console.warn('Invalid Date object provided to formatDate');
        return '';
      }
      return new Intl.DateTimeFormat(locale, options).format(dateInput);
    }
    
    // If string is in French DD/MM/YYYY format, parse it properly
    if (typeof dateInput === 'string') {
      // Check if string is empty or not a valid date string
      if (!dateInput.trim()) {
        return '';
      }
      
      // Check if this looks like DD/MM/YYYY format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateInput)) {
        const [day, month, year] = dateInput.split('/').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        if (!isNaN(parsedDate.getTime())) {
          return new Intl.DateTimeFormat(locale, options).format(parsedDate);
        }
      }
      
      // Standard date parsing with extra validation
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string provided to formatDate:', dateInput);
        return '';
      }
      
      return new Intl.DateTimeFormat(locale, options).format(date);
    }
    
    return '';
  } catch (error) {
    console.error('Error formatting date:', error, 'for input:', dateInput);
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
    if (isNaN(value)) {
      console.warn('Invalid number provided to formatCurrency:', value);
      return '0,00 €';
    }
    
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
    if (isNaN(value)) {
      console.warn('Invalid number provided to formatNumber:', value);
      return '0';
    }
    
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

/**
 * Safely parses a date string into a Date object
 * @param dateStr Date string to parse
 * @returns A valid Date object or null if invalid
 */
export const safeParseDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  
  try {
    // Handle French format DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      return isNaN(date.getTime()) ? null : date;
    }
    
    // Try standard parsing
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    return null;
  }
};
