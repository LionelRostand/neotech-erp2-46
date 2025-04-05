
import { useState, useEffect } from 'react';
import { ProspectFormData, ReminderData, Prospect } from '../types/crm-types';
import { toast } from 'sonner';
import { useProspectDialogs } from './prospect/useProspectDialogs';

export const useProspects = () => {
  // State variables
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<ProspectFormData>({
    name: '',
    company: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    email: '',
    phone: '',
    status: 'new',
    source: '',
    industry: '',
    website: '',
    address: '',
    notes: ''
  });
  
  const [reminderData, setReminderData] = useState<ReminderData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Mock source options
  const sourcesOptions = [
    { value: 'Site web', label: 'Site web' },
    { value: 'Référence', label: 'Référence' },
    { value: 'Réseaux sociaux', label: 'Réseaux sociaux' },
    { value: 'Email', label: 'Email' },
    { value: 'Événement', label: 'Événement' },
    { value: 'Publicité', label: 'Publicité' },
    { value: 'Autre', label: 'Autre' }
  ];

  // Mock status options
  const statusOptions = [
    { value: 'new', label: 'Nouveau' },
    { value: 'contacted', label: 'Contacté' },
    { value: 'meeting', label: 'Rendez-vous' },
    { value: 'proposal', label: 'Proposition' },
    { value: 'negotiation', label: 'Négociation' },
    { value: 'converted', label: 'Converti' },
    { value: 'lost', label: 'Perdu' }
  ];
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      email: '',
      phone: '',
      status: 'new',
      source: 'Site web',
      industry: '',
      website: '',
      address: '',
      notes: ''
    });
    
    setReminderData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  // Load prospects
  useEffect(() => {
    const fetchProspects = async () => {
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProspects: Prospect[] = [
          {
            id: '1',
            name: 'Société A',
            company: 'Société A',
            contactName: 'Jean Dupont',
            contactEmail: 'jean@societeA.fr',
            contactPhone: '01 23 45 67 89',
            email: 'contact@societeA.fr',
            phone: '01 98 76 54 32',
            status: 'new',
            source: 'Site web',
            industry: 'Technologie',
            website: 'www.societeA.fr',
            address: '123 Rue de Paris, 75001 Paris',
            notes: 'Premier contact effectué par email',
            createdAt: new Date().toISOString(),
            lastContact: new Date().toISOString().split('T')[0]
          },
          {
            id: '2',
            name: 'Entreprise B',
            company: 'Entreprise B',
            contactName: 'Marie Martin',
            contactEmail: 'marie@entrepriseB.fr',
            contactPhone: '01 23 45 67 88',
            email: 'contact@entrepriseB.fr',
            phone: '01 98 76 54 33',
            status: 'contacted',
            source: 'Référence',
            industry: 'Finance',
            website: 'www.entrepriseB.fr',
            address: '456 Avenue des Champs-Élysées, 75008 Paris',
            notes: 'Intéressé par notre solution de gestion',
            createdAt: new Date().toISOString(),
            lastContact: new Date().toISOString().split('T')[0]
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

  // Dialog management
  const dialogs = useProspectDialogs(
    setSelectedProspect,
    setFormData,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDetailsOpen,
    setIsConvertDialogOpen,
    setIsReminderDialogOpen
  );

  // Filter prospects based on search term and status filter
  const filterProspects = (prospects: Prospect[], searchTerm: string, statusFilter: string) => {
    return prospects.filter(prospect => {
      const matchesFilter = statusFilter === 'all' || prospect.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // CRUD operations
  const addProspect = async (data: ProspectFormData): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newProspect: Prospect = {
        id: Date.now().toString(),
        name: data.name || '',
        company: data.company,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        email: data.email || '',
        phone: data.phone || '',
        status: data.status as Prospect['status'],
        source: data.source,
        industry: data.industry,
        website: data.website,
        address: data.address,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        lastContact: data.lastContact || new Date().toISOString().split('T')[0]
      };
      
      setProspects(prev => [newProspect, ...prev]);
      return true;
    } catch (err) {
      console.error('Error adding prospect:', err);
      toast.error('Erreur lors de l\'ajout du prospect');
      return false;
    }
  };

  const updateProspect = async (id: string, data: ProspectFormData): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProspects(prev => 
        prev.map(prospect => 
          prospect.id === id 
            ? { 
                ...prospect, 
                ...data,
                lastContact: data.lastContact || prospect.lastContact
              } 
            : prospect
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error updating prospect:', err);
      toast.error('Erreur lors de la mise à jour du prospect');
      return false;
    }
  };

  const deleteProspect = async (id: string): Promise<boolean> => {
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
  };

  const convertToClient = async (prospect: Prospect): Promise<string | null> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update the prospect status to converted
      setProspects(prev => 
        prev.map(p => 
          p.id === prospect.id 
            ? { ...p, status: 'converted', convertedAt: new Date().toISOString() } 
            : p
        )
      );
      
      // In a real scenario, this would create a client and return the client ID
      const clientId = `client-${Date.now()}`;
      return clientId;
    } catch (err) {
      console.error('Error converting prospect to client:', err);
      toast.error('Erreur lors de la conversion du prospect en client');
      return null;
    }
  };

  const addReminder = async (prospectId: string, data: ReminderData): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real scenario, this would add a reminder to the database
      toast.success('Rappel ajouté avec succès');
      return true;
    } catch (err) {
      console.error('Error adding reminder:', err);
      toast.error('Erreur lors de l\'ajout du rappel');
      return false;
    }
  };

  // Utility functions
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      case 'meeting':
        return 'bg-amber-100 text-amber-800';
      case 'proposal':
        return 'bg-green-100 text-green-800';
      case 'negotiation':
        return 'bg-teal-100 text-teal-800';
      case 'converted':
        return 'bg-indigo-100 text-indigo-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new':
        return 'Nouveau';
      case 'contacted':
        return 'Contacté';
      case 'meeting':
        return 'Rendez-vous';
      case 'proposal':
        return 'Proposition';
      case 'negotiation':
        return 'Négociation';
      case 'converted':
        return 'Converti';
      case 'lost':
        return 'Perdu';
      default:
        return status;
    }
  };

  // Filter prospects
  const filteredProspects = filterProspects(prospects, searchTerm, statusFilter);

  return {
    prospects,
    filteredProspects,
    isLoading: loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDetailsOpen,
    setIsViewDetailsOpen,
    isConvertDialogOpen,
    setIsConvertDialogOpen,
    isReminderDialogOpen,
    setIsReminderDialogOpen,
    selectedProspect,
    formData,
    reminderData,
    setReminderData,
    sourcesOptions,
    statusOptions,
    handleInputChange,
    handleSelectChange,
    resetForm,
    addProspect,
    updateProspect,
    deleteProspect,
    convertToClient,
    addReminder,
    openAddDialog: dialogs.openAddDialog,
    openEditDialog: dialogs.openEditDialog,
    openDeleteDialog: dialogs.openDeleteDialog,
    openViewDetails: dialogs.openViewDetails,
    openConvertDialog: dialogs.openConvertDialog,
    openReminderDialog: dialogs.openReminderDialog,
    getStatusBadgeClass,
    getStatusText
  };
};
