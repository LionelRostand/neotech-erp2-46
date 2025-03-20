
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatMessageDate = (timestamp: Timestamp | Date | string | number | any) => {
  if (!timestamp) {
    return '';
  }
  
  let date: Date;
  
  // Check if timestamp is a Firebase Timestamp object
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else {
    // Fallback to current date if timestamp is invalid
    date = new Date();
    console.warn('Invalid timestamp format:', timestamp);
  }
  
  try {
    return format(date, 'dd MMM yyyy', { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const extractTextFromHtml = (html: string) => {
  if (!html) return '';
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  } catch (error) {
    console.error('Error extracting text from HTML:', error);
    return '';
  }
};
