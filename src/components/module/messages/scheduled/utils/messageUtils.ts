
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Contact } from '../../types/message-types';

export const formatScheduledDate = (timestamp: Timestamp | Date | any) => {
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
    console.warn('Invalid timestamp format:', timestamp);
    date = new Date();
  }
  
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  
  const formattedTime = format(date, 'HH:mm', { locale: fr });
  
  if (isToday) {
    return `Aujourd'hui à ${formattedTime}`;
  }
  
  if (isTomorrow) {
    return `Demain à ${formattedTime}`;
  }
  
  return format(date, "EEEE d MMMM 'à' HH:mm", { locale: fr });
};

export const getInitials = (name: string): string => {
  if (!name) return '';
  
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const getRecipientsList = (recipientIds: string[], contacts: Record<string, Contact>) => {
  return recipientIds.map(id => contacts[id])
                     .filter(Boolean)
                     .map(contact => `${contact.firstName} ${contact.lastName}`)
                     .join(', ');
};

// Add truncateText function for future reference
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
