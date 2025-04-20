
import { useState, useEffect } from 'react';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message } from '../../types/message-types';

export const useScheduledMessagesData = () => {
  const { data: messages, isLoading, error, refetch } = useFirebaseCollection<Message>(
    COLLECTIONS.MESSAGES.SCHEDULED
  );
  
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'upcoming' | 'all'>('all');
  
  // Filtrer les messages selon le terme de recherche et les filtres
  useEffect(() => {
    if (!messages) {
      setFilteredMessages([]);
      return;
    }

    let result = [...messages];
    
    // Appliquer le filtre de recherche
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(message => 
        message.subject.toLowerCase().includes(term) || 
        message.content.toLowerCase().includes(term)
      );
    }
    
    // Appliquer le filtre temporel
    if (filter === 'upcoming') {
      const now = new Date();
      result = result.filter(message => {
        if (!message.scheduledAt) return false;
        
        // Convertir Timestamp en Date
        const scheduledDate = message.scheduledAt.toDate ? 
          message.scheduledAt.toDate() : 
          new Date(message.scheduledAt);
          
        return scheduledDate > now && scheduledDate.getTime() - now.getTime() <= 7 * 24 * 60 * 60 * 1000; // 7 jours
      });
    }
    
    setFilteredMessages(result);
  }, [messages, searchTerm, filter]);

  return {
    messages: filteredMessages,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter
  };
};
