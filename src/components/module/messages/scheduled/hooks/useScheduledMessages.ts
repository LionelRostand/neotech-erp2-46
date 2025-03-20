
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Message, Contact } from '../../types/message-types';
import { useToast } from '@/hooks/use-toast';

export const useScheduledMessages = () => {
  const { getAll, remove } = useFirestore(COLLECTIONS.MESSAGES.SCHEDULED);
  const contactsCollection = useFirestore(COLLECTIONS.CONTACTS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Record<string, Contact>>({});
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [messageToCancel, setMessageToCancel] = useState<Message | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
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
          const mockMessages: Message[] = Array.from({ length: 8 }, (_, i) => {
            const today = new Date();
            const scheduledDate = new Date();
            
            // Répartir les dates programmées sur les prochains jours
            scheduledDate.setDate(today.getDate() + i % 7 + 1);
            scheduledDate.setHours(9 + i % 8, (i * 15) % 60);
            
            return {
              id: `mock-scheduled-${i+1}`,
              subject: [
                'Proposition commerciale à envoyer',
                'Suivi de projet - Rapport hebdomadaire',
                'Invitation à la conférence annuelle',
                'Rappel: Échéance de paiement',
                'Lancement de produit - Annonce'
              ][i % 5],
              content: `<p>Bonjour,</p><p>Ce message est programmé pour être envoyé automatiquement. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Cordialement,<br />L'équipe NeoTech</p>`,
              sender: 'current-user-id',
              recipients: [Object.keys(contactsMap)[i % Object.keys(contactsMap).length]],
              status: 'scheduled' as any,
              priority: ['normal', 'high'][i % 2] as any,
              category: ['general', 'commercial', 'administrative'][i % 3] as any,
              tags: i % 3 === 0 ? ['automatique', 'important'] : i % 2 === 0 ? ['suivi'] : [],
              hasAttachments: i % 3 === 0,
              isScheduled: true,
              scheduledAt: scheduledDate as any,
              createdAt: today as any,
              updatedAt: today as any,
            };
          });
          
          setMessages(mockMessages);
          setFilteredMessages(mockMessages);
        } else {
          setMessages(messagesData as Message[]);
          setFilteredMessages(messagesData as Message[]);
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

  const handleCancelMessage = (message: Message) => {
    setMessageToCancel(message);
    setShowCancelDialog(true);
  };

  const confirmCancelMessage = async () => {
    if (!messageToCancel) return;
    
    try {
      await remove(messageToCancel.id);
      setMessages(prev => prev.filter(msg => msg.id !== messageToCancel.id));
      
      toast({
        title: "Envoi annulé",
        description: "Le message programmé a été annulé et supprimé."
      });
    } catch (error) {
      console.error("Erreur lors de l'annulation du message:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'annuler le message. Veuillez réessayer."
      });
    } finally {
      setShowCancelDialog(false);
      setMessageToCancel(null);
    }
  };

  const handleSendNow = (messageId: string) => {
    // Simuler l'envoi immédiat
    toast({
      title: "Message envoyé",
      description: "Le message a été envoyé immédiatement."
    });
    
    // Supprimer de la liste des messages programmés
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  return {
    messages,
    filteredMessages, 
    isLoading,
    contacts,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    messageToCancel,
    showCancelDialog,
    setShowCancelDialog,
    handleCancelMessage,
    confirmCancelMessage,
    handleSendNow
  };
};
