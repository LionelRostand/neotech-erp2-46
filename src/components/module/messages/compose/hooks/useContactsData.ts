
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useToast } from '@/hooks/use-toast';
import { Contact } from '../../types/message-types';
import { useSearchParams } from 'react-router-dom';

export const useContactsData = () => {
  const { getAll } = useFirestore(COLLECTIONS.MESSAGES.CONTACTS);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const preSelectedContactId = searchParams.get('to');

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsData = await getAll();
        if (contactsData.length > 0) {
          setContacts(contactsData as Contact[]);
          setFilteredContacts(contactsData as Contact[]);
          
          // Présélectionner un contact si l'ID est dans l'URL
          if (preSelectedContactId) {
            const selectedContact = contactsData.find(c => c.id === preSelectedContactId);
            if (selectedContact) {
              setSelectedContacts([selectedContact as Contact]);
            }
          }
        } else {
          // Créer des données fictives pour la démo
          const mockContacts: Contact[] = Array.from({ length: 10 }, (_, i) => ({
            id: `mock-${i+1}`,
            firstName: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Philippe', 'Anne', 'Thomas', 'Claire', 'Paul', 'Julie'][i],
            lastName: ['Dupont', 'Martin', 'Durand', 'Bernard', 'Petit', 'Robert', 'Richard', 'Dubois', 'Moreau', 'Laurent'][i],
            email: `contact${i+1}@example.com`,
            phone: `+33 6 12 34 56 ${i+1}${i+1}`,
            company: ['NeoTech', 'EcoCorp', 'DataSoft', 'MegaSolutions', 'TechInnovate'][i % 5],
            position: ['Directeur', 'Chef de projet', 'Développeur', 'Designer', 'Commercial'][i % 5],
            isActive: true,
            createdAt: new Date() as any,
            updatedAt: new Date() as any
          }));
          setContacts(mockContacts);
          setFilteredContacts(mockContacts);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de récupérer les contacts."
        });
      }
    };

    fetchContacts();
  }, [getAll, preSelectedContactId, toast]);

  // Filtrer les contacts selon le terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = contacts.filter(contact => 
        !selectedContacts.some(sc => sc.id === contact.id) && (
          contact.firstName.toLowerCase().includes(term) ||
          contact.lastName.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          contact.company?.toLowerCase().includes(term)
        )
      );
      setFilteredContacts(filtered);
    }
  }, [searchTerm, contacts, selectedContacts]);

  // Helper function
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return {
    contacts,
    filteredContacts,
    searchTerm,
    setSearchTerm,
    showContactSearch,
    setShowContactSearch,
    selectedContacts,
    setSelectedContacts,
    getInitials
  };
};
