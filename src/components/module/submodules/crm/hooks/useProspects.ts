
import { useState, useEffect, useCallback } from 'react';
import { Prospect, ProspectFormData, ReminderData } from '../types/crm-types';
import { toast } from 'sonner';

export const useProspects = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  // List of source options for dropdown
  const sourceOptions = [
    { value: 'website', label: 'Site web' },
    { value: 'referral', label: 'Parrainage' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'email', label: 'Email' },
    { value: 'event', label: 'Événement' },
    { value: 'other', label: 'Autre' }
  ];

  // List of status options for dropdown
  const statusOptions = [
    { value: 'new', label: 'Nouveau' },
    { value: 'contacted', label: 'Contacté' },
    { value: 'meeting', label: 'Rendez-vous' },
    { value: 'proposal', label: 'Proposition' },
    { value: 'negotiation', label: 'Négociation' },
    { value: 'converted', label: 'Converti' },
    { value: 'lost', label: 'Perdu' }
  ];

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProspects: Prospect[] = [
          {
            id: '1',
            name: 'John Doe',
            company: 'Acme Inc',
            contactName: 'John Doe',
            contactEmail: 'john@acme.com',
            contactPhone: '01 23 45 67 89',
            email: 'john@acme.com',
            phone: '01 23 45 67 89',
            status: 'contacted' as const,
            source: 'website',
            industry: 'technology',
            website: 'www.acme.com',
            address: '123 Business St, Paris',
            estimatedValue: 15000,
            notes: 'Promising lead from website contact form',
            lastContact: '2023-09-15',
            nextContact: '2023-09-30',
            createdAt: '2023-09-01',
          },
          {
            id: '2',
            name: 'Marie Johnson',
            company: 'Tech Solutions',
            contactName: 'Marie Johnson',
            contactEmail: 'marie@techsolutions.com',
            contactPhone: '01 98 76 54 32',
            email: 'marie@techsolutions.com',
            phone: '01 98 76 54 32',
            status: 'meeting' as const,
            source: 'linkedin',
            industry: 'technology',
            website: 'www.techsolutions.com',
            address: '456 Tech Ave, Lyon',
            size: 'medium',
            estimatedValue: 25000,
            notes: 'Meeting scheduled for next week to discuss project requirements',
            lastContact: '2023-09-20',
            nextContact: '2023-10-05',
            createdAt: '2023-09-10',
          },
          {
            id: '3',
            name: 'Pierre Dupont',
            company: 'Health Services',
            contactName: 'Pierre Dupont',
            contactEmail: 'pierre@healthservices.fr',
            contactPhone: '01 45 67 89 12',
            email: 'pierre@healthservices.fr',
            phone: '01 45 67 89 12',
            status: 'new' as const,
            source: 'email',
            industry: 'healthcare',
            website: 'www.healthservices.fr',
            address: '789 Health Blvd, Marseille',
            size: 'large',
            estimatedValue: 50000,
            notes: 'Initial contact made via email campaign',
            lastContact: '2023-09-18',
            nextContact: '2023-09-25',
            createdAt: '2023-09-18',
          }
        ];
        
        setProspects(mockProspects);
        setError(null);
      } catch (err) {
        console.error('Error fetching prospects:', err);
        setError('Une erreur est survenue lors du chargement des prospects');
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();
  }, []);

  // Add a new prospect
  const addProspect = useCallback(async (data: ProspectFormData): Promise<Prospect> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ensure status is valid Prospect status type
      let prospectStatus: Prospect['status'];
      if (['new', 'contacted', 'meeting', 'proposal', 'negotiation', 'converted', 'lost'].includes(data.status)) {
        prospectStatus = data.status as Prospect['status'];
      } else {
        prospectStatus = 'new';
      }
      
      const newProspect: Prospect = {
        id: Date.now().toString(),
        name: data.name || data.contactName,
        company: data.company,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        email: data.email || data.contactEmail,
        phone: data.phone || data.contactPhone,
        status: prospectStatus,
        source: data.source,
        industry: data.industry,
        website: data.website,
        address: data.address,
        size: data.size,
        estimatedValue: data.estimatedValue,
        notes: data.notes,
        lastContact: data.lastContact || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
      };
      
      setProspects(prev => [newProspect, ...prev]);
      return newProspect;
    } catch (err) {
      console.error('Error adding prospect:', err);
      toast.error('Erreur lors de l\'ajout du prospect');
      throw err;
    }
  }, []);

  // Update an existing prospect
  const updateProspect = useCallback(async (id: string, data: Partial<ProspectFormData>): Promise<Prospect> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ensure status is valid Prospect status type if it's being updated
      let prospectStatus: Prospect['status'] | undefined;
      if (data.status) {
        if (['new', 'contacted', 'meeting', 'proposal', 'negotiation', 'converted', 'lost'].includes(data.status)) {
          prospectStatus = data.status as Prospect['status'];
        } else {
          prospectStatus = 'new';
        }
      }
      
      const updatedProspects = prospects.map(prospect => {
        if (prospect.id === id) {
          return {
            ...prospect,
            ...data,
            // Override with corrected status if provided
            ...(prospectStatus ? { status: prospectStatus } : {})
          } as Prospect;
        }
        return prospect;
      });
      
      setProspects(updatedProspects);
      
      const updatedProspect = updatedProspects.find(p => p.id === id);
      if (!updatedProspect) {
        throw new Error('Prospect not found');
      }
      
      return updatedProspect;
    } catch (err) {
      console.error('Error updating prospect:', err);
      toast.error('Erreur lors de la mise à jour du prospect');
      throw err;
    }
  }, [prospects]);

  // Delete a prospect
  const deleteProspect = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProspects(prev => prev.filter(prospect => prospect.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting prospect:', err);
      toast.error('Erreur lors de la suppression du prospect');
      return false;
    }
  }, []);

  // Convert a prospect to a client
  const convertToClient = useCallback(async (prospect: Prospect): Promise<string> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update prospect status to 'converted'
      const updatedProspects = prospects.map(p => {
        if (p.id === prospect.id) {
          return {
            ...p,
            status: 'converted' as const,
            convertedAt: new Date().toISOString(),
            convertedToClientId: Date.now().toString()
          } as Prospect;
        }
        return p;
      });
      
      setProspects(updatedProspects);
      
      // In a real app, you would create a new client record here
      const clientId = Date.now().toString();
      
      return clientId;
    } catch (err) {
      console.error('Error converting prospect to client:', err);
      toast.error('Erreur lors de la conversion du prospect en client');
      throw err;
    }
  }, [prospects]);

  // Add a reminder for a prospect
  const addReminder = useCallback(async (prospectId: string, reminderData: ReminderData): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would save the reminder to the database
      console.log(`Adding reminder for prospect ${prospectId}:`, reminderData);
      
      toast.success('Rappel ajouté avec succès');
      return true;
    } catch (err) {
      console.error('Error adding reminder:', err);
      toast.error('Erreur lors de l\'ajout du rappel');
      return false;
    }
  }, []);

  return {
    prospects,
    isLoading: loading,
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
