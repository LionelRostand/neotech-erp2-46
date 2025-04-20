
import { useState, useEffect, useMemo } from 'react';
import { Message, MessagePriority } from '../../types/message-types';

type FilterField = 'priority' | 'hasAttachments' | 'category' | 'dateRange';

interface FilterOptions {
  priority: MessagePriority[] | null;
  hasAttachments: boolean | null;
  category: string[] | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export const useScheduledMessagesFilter = (messages: Message[] | undefined) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priority: null,
    hasAttachments: null,
    category: null,
    dateRange: {
      start: null,
      end: null
    }
  });
  
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  
  const updateFilter = (field: FilterField, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      priority: null,
      hasAttachments: null,
      category: null,
      dateRange: {
        start: null,
        end: null
      }
    });
  };
  
  // Appliquer les filtres
  useEffect(() => {
    if (!messages) {
      setFilteredMessages([]);
      return;
    }
    
    let result = [...messages];
    
    // Filtre par priorité
    if (filters.priority && filters.priority.length > 0) {
      result = result.filter(message => 
        filters.priority!.includes(message.priority)
      );
    }
    
    // Filtre par pièces jointes
    if (filters.hasAttachments !== null) {
      result = result.filter(message => 
        message.hasAttachments === filters.hasAttachments
      );
    }
    
    // Filtre par catégorie
    if (filters.category && filters.category.length > 0) {
      result = result.filter(message => 
        message.category && filters.category!.includes(message.category)
      );
    }
    
    // Filtre par plage de dates
    if (filters.dateRange.start || filters.dateRange.end) {
      result = result.filter(message => {
        if (!message.scheduledAt) return false;
        
        const scheduledDate = message.scheduledAt.toDate ? 
          message.scheduledAt.toDate() : 
          new Date(message.scheduledAt);
        
        // Vérifier la date de début
        if (filters.dateRange.start && scheduledDate < filters.dateRange.start) {
          return false;
        }
        
        // Vérifier la date de fin
        if (filters.dateRange.end) {
          const endDate = new Date(filters.dateRange.end);
          endDate.setHours(23, 59, 59, 999); // Fin de journée
          
          if (scheduledDate > endDate) {
            return false;
          }
        }
        
        return true;
      });
    }
    
    setFilteredMessages(result);
  }, [messages, filters]);
  
  // Stats pour l'interface utilisateur
  const stats = useMemo(() => {
    if (!messages || messages.length === 0) {
      return {
        totalMessages: 0,
        highPriority: 0,
        withAttachments: 0
      };
    }
    
    return {
      totalMessages: messages.length,
      highPriority: messages.filter(m => m.priority === 'high').length,
      withAttachments: messages.filter(m => m.hasAttachments).length
    };
  }, [messages]);
  
  return {
    filteredMessages,
    filters,
    updateFilter,
    resetFilters,
    stats
  };
};
