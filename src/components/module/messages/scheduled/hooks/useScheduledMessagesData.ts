
import { useState } from 'react';
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message } from '../../types/message-types';

export const useScheduledMessagesData = () => {
  // Ensure we have a valid collection path
  const scheduledMessagesPath = COLLECTIONS.MESSAGES?.SCHEDULED || 'message_scheduled';
  
  // Validate path is never empty
  if (!scheduledMessagesPath || scheduledMessagesPath.trim() === '') {
    console.error('Invalid collection path for scheduled messages');
  }
  
  const { data: messages, isLoading, error, refetch } = useFirebaseCollection<Message>(
    scheduledMessagesPath
  );
  
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
