
import { useState, useEffect } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message, Contact } from '../../types/message-types';
import { useToast } from '@/hooks/use-toast';
import { generateMockScheduledMessages } from '../utils/mockScheduledMessages';

export const useScheduledMessagesData = () => {
  const scheduledCollection = useSafeFirestore(COLLECTIONS.MESSAGES.SCHEDULED);
  const contactsCollection = useSafeFirestore(COLLECTIONS.CONTACTS);
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
        const messagesData = await scheduledCollection.getAll();
        
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
        
        // En cas d'erreur, utiliser des données mock pour que l'utilisateur puisse quand même voir quelque chose
        const mockMessages = generateMockScheduledMessages(Object.keys(contacts));
        setMessages(mockMessages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Fonction de nettoyage qui reset l'état de chargement des données dans les hooks useSafeFirestore
    return () => {
      scheduledCollection.resetFetchState();
      contactsCollection.resetFetchState();
    };
  }, [scheduledCollection, contactsCollection, toast]);

  return {
    messages,
    setMessages,
    contacts,
    isLoading
  };
};
