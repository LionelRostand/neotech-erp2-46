
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
    if (typeof dateInput === 'object' && dateInput instanceof Date) {
      if (isNaN(dateInput.getTime())) {
        console.warn('Invalid Date object provided to formatDate');
        return '';
      }
      return new Intl.DateTimeFormat(locale, options).format(dateInput);
    }
    
    // Validate that the input is actually a string
    if (typeof dateInput !== 'string' && typeof dateInput !== 'number') {
      console.warn('Non-string/non-number value provided to formatDate:', dateInput);
      return '';
    }
    
    // Convert potential number to string for consistent handling
    const dateStr = String(dateInput);
    
    // Handle exotic date formats or values that could be problematic
    if (dateStr === 'Invalid Date' || dateStr === 'NaN' || dateStr === 'undefined' || dateStr.trim() === '') {
      console.warn('Invalid date string literal:', dateStr);
      return '';
    }
    
    // Try different parsing approaches
    let date: Date | null = null;
    
    // Special case for timestamps stored as numbers
    if (typeof dateInput === 'number' || /^\d+$/.test(dateStr)) {
      // This might be a numeric timestamp
      const timestamp = typeof dateInput === 'number' ? dateInput : parseInt(dateStr, 10);
      
      // Validate the timestamp is reasonable (between years 1900-2100)
      const testDate = new Date(timestamp);
      if (
        isNaN(testDate.getTime()) || 
        testDate.getFullYear() < 1900 || 
        testDate.getFullYear() > 2100
      ) {
        console.warn('Timestamp out of reasonable range:', dateInput);
        return '';
      }
      
      date = testDate;
    } else if (dateStr.includes('/')) {
      // Try to parse DD/MM/YYYY format
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        
        date = new Date(year, month, day);
        if (isNaN(date.getTime())) {
          date = null;
        }
      }
    }
    
    // If previous methods failed, try standard parsing
    if (!date) {
      try {
        // Make sure the date is valid first
        const timestamp = Date.parse(dateStr);
        if (isNaN(timestamp)) {
          console.warn('Invalid date provided to formatDate:', dateInput);
          return '';
        }
        
        // Create the date object and verify it's a reasonable date
        date = new Date(dateStr);
        if (
          isNaN(date.getTime()) || 
          date.getFullYear() < 1900 || 
          date.getFullYear() > 2100
        ) {
          console.warn('Date out of reasonable range:', dateInput);
          return '';
        }
      } catch (err) {
        console.warn('Error creating date from string:', dateStr, err);
        return '';
      }
    }
    
    // At this point, we should have a valid date object
    if (!date || isNaN(date.getTime())) {
      return '';
    }
    
    return new Intl.DateTimeFormat(locale, options).format(date);
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
