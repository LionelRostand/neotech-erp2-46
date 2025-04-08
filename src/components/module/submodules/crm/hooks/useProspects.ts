
import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Prospect, ProspectFormData, ReminderData } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useProspects = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  
  // Options for select fields
  const sourceOptions = [
    { value: 'website', label: 'Site web' },
    { value: 'referral', label: 'Référence' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'event', label: 'Événement' },
    { value: 'cold_call', label: 'Appel à froid' },
    { value: 'email', label: 'Email marketing' },
    { value: 'other', label: 'Autre' }
  ];
  
  const statusOptions = [
    { value: 'new', label: 'Nouveau' },
    { value: 'contacted', label: 'Contacté' },
    { value: 'meeting', label: 'Rendez-vous' },
    { value: 'proposal', label: 'Proposition' },
    { value: 'negotiation', label: 'Négociation' },
    { value: 'converted', label: 'Converti' },
    { value: 'lost', label: 'Perdu' },
    { value: 'qualified', label: 'Qualifié' },
    { value: 'unqualified', label: 'Non qualifié' }
  ];

  // Load prospects from Firestore
  useEffect(() => {
    const fetchProspects = async () => {
      try {
        setIsLoading(true);
        const prospectsRef = collection(db, COLLECTIONS.CRM.PROSPECTS);
        const q = query(prospectsRef, orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        
        // If collection is empty, add mock data
        if (querySnapshot.empty) {
          await seedMockProspects();
          fetchProspects(); // Recall this function to get the seeded data
          return;
        }
        
        const loadedProspects = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const createdAtDate = data.createdAt instanceof Date 
            ? data.createdAt.toISOString().split('T')[0]
            : data.createdAt && data.createdAt.toDate 
              ? data.createdAt.toDate().toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0];
              
          // Cast status to ensure it's a valid enum value
          const status = data.status || 'new';
          const validStatus = ['new', 'contacted', 'meeting', 'proposal', 'negotiation', 'converted', 'lost'].includes(status) 
            ? status as Prospect['status'] 
            : 'new' as Prospect['status'];
          
          return {
            id: doc.id,
            company: data.company || '',
            contactName: data.contactName || '',
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || '',
            status: validStatus,
            source: data.source || '',
            createdAt: createdAtDate,
            notes: data.notes || '',
            industry: data.industry || '',
            website: data.website || '',
            address: data.address || '',
            size: data.size || '',
            estimatedValue: data.estimatedValue || 0,
            name: data.company || '', // For compatibility with CRM components
            email: data.contactEmail || '', // For compatibility
            phone: data.contactPhone || ''  // For compatibility
          } as Prospect;
        });
        
        setProspects(loadedProspects);
        setError('');
      } catch (err) {
        console.error('Error fetching prospects:', err);
        setError('Erreur lors du chargement des prospects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProspects();
  }, []);

  // CRUD operations
  const addProspect = async (data: ProspectFormData): Promise<void> => {
    try {
      const prospectsRef = collection(db, COLLECTIONS.CRM.PROSPECTS);
      
      // Ensure status is a valid type
      const validStatus = ['new', 'contacted', 'meeting', 'proposal', 'negotiation', 'converted', 'lost'].includes(data.status) 
        ? data.status 
        : 'new';
      
      const newProspect = {
        ...data,
        status: validStatus,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(prospectsRef, newProspect);
      
      // Add to local state
      const createdAtDate = new Date().toISOString().split('T')[0];
      
      const newProspectWithId: Prospect = {
        id: docRef.id,
        company: data.company,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        status: validStatus as Prospect['status'],
        source: data.source,
        createdAt: createdAtDate,
        name: data.company,
        email: data.contactEmail || '',
        phone: data.contactPhone || '',
        industry: data.industry,
        website: data.website,
        address: data.address,
        size: data.size,
        estimatedValue: data.estimatedValue
      };
      
      setProspects(prev => [newProspectWithId, ...prev]);
      
    } catch (err) {
      console.error('Error adding prospect:', err);
      throw new Error('Failed to add prospect');
    }
  };

  const updateProspect = async (id: string, data: ProspectFormData): Promise<void> => {
    try {
      const prospectRef = doc(db, COLLECTIONS.CRM.PROSPECTS, id);
      
      // Ensure status is a valid type
      const validStatus = ['new', 'contacted', 'meeting', 'proposal', 'negotiation', 'converted', 'lost'].includes(data.status) 
        ? data.status 
        : 'new';
        
      const updatedData = {
        ...data,
        status: validStatus
      };
      
      await updateDoc(prospectRef, updatedData);
      
      // Update in local state
      setProspects(prev => 
        prev.map(prospect => 
          prospect.id === id 
            ? { 
                ...prospect, 
                ...data,
                status: validStatus as Prospect['status'],
                name: data.company, // For compatibility with CRM components
                email: data.contactEmail || prospect.email,
                phone: data.contactPhone || prospect.phone
              } 
            : prospect
        )
      );
      
    } catch (err) {
      console.error('Error updating prospect:', err);
      throw new Error('Failed to update prospect');
    }
  };

  const deleteProspect = async (id: string): Promise<void> => {
    try {
      const prospectRef = doc(db, COLLECTIONS.CRM.PROSPECTS, id);
      
      await deleteDoc(prospectRef);
      
      // Remove from local state
      setProspects(prev => prev.filter(prospect => prospect.id !== id));
      
    } catch (err) {
      console.error('Error deleting prospect:', err);
      throw new Error('Failed to delete prospect');
    }
  };

  const convertToClient = async (prospect: Prospect): Promise<string> => {
    try {
      // Convert prospect to client in Firestore
      const clientsRef = collection(db, COLLECTIONS.CRM.CLIENTS);
      
      const clientData = {
        name: prospect.company,
        contactName: prospect.contactName,
        email: prospect.contactEmail,
        phone: prospect.contactPhone,
        address: prospect.address,
        sector: prospect.industry,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        website: prospect.website,
        notes: `Converti depuis prospect le ${new Date().toLocaleDateString('fr-FR')}. ${prospect.notes}`
      };
      
      const clientDocRef = await addDoc(clientsRef, clientData);
      
      // Delete the prospect
      await deleteProspect(prospect.id);
      
      return clientDocRef.id;
    } catch (err) {
      console.error('Error converting prospect to client:', err);
      throw new Error('Failed to convert prospect to client');
    }
  };

  const addReminder = async (prospectId: string, reminderData: ReminderData): Promise<void> => {
    try {
      const remindersRef = collection(db, COLLECTIONS.CRM.REMINDERS);
      
      const reminder = {
        ...reminderData,
        prospectId,
        completed: false,
        createdAt: serverTimestamp()
      };
      
      await addDoc(remindersRef, reminder);
      
    } catch (err) {
      console.error('Error adding reminder:', err);
      throw new Error('Failed to add reminder');
    }
  };

  // Seed mock data if the collection is empty
  const seedMockProspects = async () => {
    try {
      const prospectCollection = collection(db, COLLECTIONS.CRM.PROSPECTS);
      
      const mockProspects = [
        {
          company: 'Tech Innovations',
          contactName: 'Pierre Dupont',
          contactEmail: 'pierre@techinnovations.fr',
          contactPhone: '01 23 45 67 89',
          status: 'new',
          source: 'website',
          industry: 'technology',
          website: 'www.techinnovations.fr',
          address: '123 Boulevard de l\'Innovation, Paris',
          size: 'medium',
          estimatedValue: 25000,
          notes: 'Prospect intéressé par notre solution CRM',
          createdAt: serverTimestamp()
        },
        {
          company: 'Green Solutions',
          contactName: 'Marie Lambert',
          contactEmail: 'marie@greensolutions.fr',
          contactPhone: '01 98 76 54 32',
          status: 'contacted',
          source: 'linkedin',
          industry: 'environmental',
          website: 'www.greensolutions.fr',
          address: '456 Rue de l\'Écologie, Lyon',
          size: 'small',
          estimatedValue: 15000,
          notes: 'Premier contact effectué, en attente de retour',
          createdAt: serverTimestamp()
        },
        {
          company: 'Global Finance',
          contactName: 'Julien Martin',
          contactEmail: 'julien@globalfinance.fr',
          contactPhone: '01 45 67 89 01',
          status: 'meeting',
          source: 'referral',
          industry: 'finance',
          website: 'www.globalfinance.fr',
          address: '789 Avenue des Finances, Bordeaux',
          size: 'large',
          estimatedValue: 50000,
          notes: 'Rendez-vous programmé pour la semaine prochaine',
          createdAt: serverTimestamp()
        }
      ];
      
      const promises = mockProspects.map(prospect => 
        addDoc(prospectCollection, prospect)
      );
      
      await Promise.all(promises);
      console.log('Données de démonstration des prospects ajoutées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout des données de démonstration:', error);
    }
  };

  return {
    prospects,
    isLoading,
    error,
    sourceOptions,
    statusOptions,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedProspect,
    setSelectedProspect,
    addProspect,
    updateProspect,
    deleteProspect,
    convertToClient,
    addReminder
  };
};
