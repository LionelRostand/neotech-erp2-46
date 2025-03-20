
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message, Contact } from '../../types/message-types';
import { useToast } from '@/hooks/use-toast';
import { generateMockScheduledMessages } from '../utils/mockScheduledMessages';

export const useScheduledMessagesData = () => {
  const { getAll } = useFirestore(COLLECTIONS.MESSAGES.SCHEDULED);
  const contactsCollection = useFirestore(COLLECTIONS.CONTACTS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Record<string, Contact>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Récupérer les messages et les contacts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les contacts
        const contactsData = await contactsCollection.getAll();
        const contactsMap: Record<string, Contact> = {};
        contactsData.forEach(contact => {
          contactsMap[contact.id] = contact as Contact;
        });
        setContacts(contactsMap);
        
        // Récupérer les messages programmés
        const messagesData = await getAll();
        
        if (messagesData.length === 0) {
          // Créer des données fictives pour la démo
          const mockMessages = generateMockScheduledMessages(Object.keys(contactsMap));
          setMessages(mockMessages);
        } else {
          setMessages(messagesData as Message[]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les messages programmés."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [getAll, contactsCollection.getAll, toast]);

  return {
    messages,
    setMessages,
    contacts,
    isLoading
  };
};
