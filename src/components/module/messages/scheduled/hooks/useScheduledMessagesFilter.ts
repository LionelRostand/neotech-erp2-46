
import { useState, useEffect } from 'react';
import { Message, Contact } from '../../types/message-types';

export const useScheduledMessagesFilter = (
  messages: Message[],
  contacts: Record<string, Contact>
) => {
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');

  // Filtrer les messages selon les critères
  useEffect(() => {
    let filtered = [...messages];
    
    // Filtrage par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(message => 
        message.subject.toLowerCase().includes(term) ||
        message.recipients.some(recipientId => {
          const contact = contacts[recipientId];
          return (
            contact?.firstName.toLowerCase().includes(term) ||
            contact?.lastName.toLowerCase().includes(term) ||
            contact?.email.toLowerCase().includes(term)
          );
        }) ||
        message.content.toLowerCase().includes(term)
      );
    }
    
    // Filtrage par date
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);
    
    switch (filter) {
      case 'today':
        filtered = filtered.filter(message => {
          const scheduledDate = message.scheduledAt?.toDate();
          return scheduledDate && 
                 scheduledDate.getDate() === now.getDate() &&
                 scheduledDate.getMonth() === now.getMonth() && 
                 scheduledDate.getFullYear() === now.getFullYear();
        });
        break;
      case 'tomorrow':
        filtered = filtered.filter(message => {
          const scheduledDate = message.scheduledAt?.toDate();
          const tomorrowDate = new Date(now);
          tomorrowDate.setDate(now.getDate() + 1);
          return scheduledDate && 
                 scheduledDate.getDate() === tomorrowDate.getDate() &&
                 scheduledDate.getMonth() === tomorrowDate.getMonth() && 
                 scheduledDate.getFullYear() === tomorrowDate.getFullYear();
        });
        break;
      case 'this-week':
        filtered = filtered.filter(message => {
          const scheduledDate = message.scheduledAt?.toDate();
          return scheduledDate && scheduledDate <= nextWeek;
        });
        break;
      case 'high-priority':
        filtered = filtered.filter(message => message.priority === 'high' || message.priority === 'urgent');
        break;
      case 'all':
      default:
        // Aucun filtrage supplémentaire
        break;
    }
    
    setFilteredMessages(filtered);
  }, [messages, searchTerm, filter, contacts]);

  return {
    filteredMessages,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter
  };
};
