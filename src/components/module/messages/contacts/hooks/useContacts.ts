
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Contact } from '../../types/message-types';
import { useToast } from '@/hooks/use-toast';

export const useContacts = () => {
  const { getAll } = useFirestore(COLLECTIONS.CONTACTS);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const contactsData = await getAll();
      if (contactsData.length > 0) {
        setContacts(contactsData as Contact[]);
      } else {
        const mockContacts: Contact[] = Array.from({ length: 15 }, (_, i) => ({
          id: `mock-${i+1}`,
          firstName: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Philippe', 'Anne', 'Thomas', 'Claire', 'Paul', 'Julie', 'Lucas', 'Emma', 'Gabriel', 'Chloé', 'Arthur'][i],
          lastName: ['Dupont', 'Martin', 'Durand', 'Bernard', 'Petit', 'Robert', 'Richard', 'Dubois', 'Moreau', 'Laurent', 'Garcia', 'Roux', 'Leroy', 'Morel', 'Chevalier'][i],
          email: `contact${i+1}@example.com`,
          phone: `+33 6 12 34 56 ${i+1}${i+1}`,
          company: ['NeoTech', 'EcoCorp', 'DataSoft', 'MegaSolutions', 'TechInnovate', 'GlobalCom', 'Innovision', 'StarLink', 'QuantumLeap', 'FutureNet', 'ApexTech', 'BrightSol', 'ClearView', 'DynamicSys', 'EliteGroup'][i % 15],
          position: ['Directeur', 'Chef de projet', 'Développeur', 'Designer', 'Commercial', 'Analyste', 'Consultant', 'Ingénieur', 'Manager', 'Assistant', 'Stagiaire', 'Responsable', 'Coordinateur', 'Technicien', 'Expert'][i % 15],
          isActive: true,
          createdAt: new Date() as any,
          updatedAt: new Date() as any
        }));
        setContacts(mockContacts);
      }
    } catch (err: any) {
      console.error("Erreur lors de la récupération des contacts:", err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les contacts."
      });
    } finally {
      setLoading(false);
    }
  }, [getAll, toast]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const filterContacts = (search: string, contactsList: Contact[]) => {
    const lowerSearch = search.toLowerCase();
    return contactsList.filter(contact =>
      contact.firstName.toLowerCase().includes(lowerSearch) ||
      contact.lastName.toLowerCase().includes(lowerSearch) ||
      contact.email.toLowerCase().includes(lowerSearch) ||
      (contact.company?.toLowerCase().includes(lowerSearch) ?? false)
    );
  };

  return {
    contacts,
    setContacts,
    loading,
    error,
    filterContacts
  };
};
