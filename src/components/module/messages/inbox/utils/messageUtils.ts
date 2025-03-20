
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatMessageDate = (timestamp: Timestamp | Date | string | number | any) => {
  let date: Date;
  
  // Handle different types of timestamp input
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
    // Firebase Timestamp object
    date = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    // JavaScript Date object
    date = timestamp;
  } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    // String or number timestamp
    date = new Date(timestamp);
  } else {
    // Fallback to current date if invalid input
    console.warn('Format de timestamp invalide:', timestamp);
    date = new Date();
    return '';
  }
  
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return format(date, 'HH:mm', { locale: fr });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isYesterday) {
    return 'Hier';
  }
  
  // Si dans la même semaine, afficher le jour
  const sixDaysAgo = new Date(now);
  sixDaysAgo.setDate(now.getDate() - 6);
  
  if (date > sixDaysAgo) {
    return format(date, 'EEEE', { locale: fr });
  }
  
  // Sinon afficher la date complète
  return format(date, 'dd/MM/yyyy', { locale: fr });
};

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const extractTextFromHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};
