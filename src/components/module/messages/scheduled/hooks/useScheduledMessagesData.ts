
import { useState } from 'react';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message } from '../../types/message-types';

export const useScheduledMessagesData = () => {
  // Use definite path from COLLECTIONS
  const scheduledMessagesPath = COLLECTIONS.MESSAGES.SCHEDULED;
  
  console.log('scheduledMessagesPath:', scheduledMessagesPath); // Debug log
  
  // Only proceed with the collection call if we have a valid path
  const { 
    data: messages, 
    isLoading, 
    error, 
    refetch 
  } = useFirebaseCollection<Message>(scheduledMessagesPath);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'upcoming' | 'all'>('all');
  
  return {
    messages: messages || [],
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter
  };
};
