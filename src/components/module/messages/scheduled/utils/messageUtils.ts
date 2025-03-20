
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Contact } from '../../types/message-types';

export const formatScheduledDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
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

export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const getRecipientsList = (recipientIds: string[], contacts: Record<string, Contact>) => {
  return recipientIds.map(id => contacts[id])
                     .filter(Boolean)
                     .map(contact => `${contact.firstName} ${contact.lastName}`)
                     .join(', ');
};
