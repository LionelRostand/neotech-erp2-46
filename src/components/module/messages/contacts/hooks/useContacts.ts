
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Contact } from '../../types/message-types';
import { useToast } from '@/hooks/use-toast';
import { fetchCollectionData } from '@/lib/fetchCollectionData';

export const useContacts = () => {
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const { 
    data: contacts = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['messages', 'contacts'],
    queryFn: async () => {
      try {
        const contactsData = await fetchCollectionData(COLLECTIONS.MESSAGES.CONTACTS);
        return contactsData as Contact[];
      } catch (err) {
        console.error("Error fetching contacts:", err);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les contacts."
        });
        return [];
      }
    }
  });

  const filterContacts = useCallback((searchTerm: string, contactsList: Contact[]) => {
    const lowerSearch = searchTerm.toLowerCase();
    return contactsList.filter(contact =>
      contact.firstName.toLowerCase().includes(lowerSearch) ||
      contact.lastName.toLowerCase().includes(lowerSearch) ||
      contact.email.toLowerCase().includes(lowerSearch) ||
      (contact.company?.toLowerCase().includes(lowerSearch) ?? false)
    );
  }, []);

  const filteredContacts = filterContacts(search, contacts);

  return {
    contacts: filteredContacts,
    loading: isLoading,
    error,
    setSearch,
    filterContacts
  };
};
