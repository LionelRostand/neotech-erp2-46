
import { useMemo } from 'react';
import { Message } from '../../types/message-types';

interface FilterParams {
  messages: Message[];
  searchTerm?: string;
  filter?: 'all' | 'upcoming';
}

export const useScheduledMessagesFilter = ({ messages = [], searchTerm = '', filter = 'all' }: FilterParams) => {
  // Filtrer les messages selon la recherche et les filtres actifs
  const filteredMessages = useMemo(() => {
    if (!messages || messages.length === 0) return [];
    
    let result = [...messages];
    
    // Filtre par texte de recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(message => 
        (message.subject?.toLowerCase().includes(search)) || 
        (message.content?.toLowerCase().includes(search))
      );
    }
    
    // Filtre par type (tous ou prochains)
    if (filter === 'upcoming') {
      const today = new Date();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(today.getDate() + 7);
      
      result = result.filter(message => {
        if (!message.scheduledAt) return false;
        
        const scheduledDate = message.scheduledAt.toDate ? 
          message.scheduledAt.toDate() : 
          new Date(message.scheduledAt);
        
        return scheduledDate >= today && scheduledDate <= oneWeekFromNow;
      });
    }
    
    return result;
  }, [messages, searchTerm, filter]);
  
  return { filteredMessages };
};
