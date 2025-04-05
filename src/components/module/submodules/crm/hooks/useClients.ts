
import { useState, useEffect, useCallback } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { toast } from 'sonner';

// Array of available sectors
export const sectors = [
  { value: 'technology', label: 'Technologie' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'retail', label: 'Commerce de détail' },
  { value: 'manufacturing', label: 'Industrie' },
  { value: 'consulting', label: 'Conseil' },
  { value: 'energy', label: 'Énergie' },
  { value: 'food', label: 'Alimentaire' },
  { value: 'transportation', label: 'Transport' },
  { value: 'media', label: 'Médias' },
  { value: 'construction', label: 'Construction' },
  { value: 'other', label: 'Autre' }
];

// Status options
export const statusOptions = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'lead', label: 'Prospect' }
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for client management
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Form data
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    sector: 'technology',
    revenue: '',
    status: 'active',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    website: '',
    description: '',
    notes: ''
  });
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      sector: 'technology',
      revenue: '',
      status: 'active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      website: '',
      description: '',
      notes: ''
    });
    setSelectedClient(null);
  };

  // Load clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Here we would normally call an API to get clients
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockClients: Client[] = [
          {
            id: '1',
            name: 'TechSolutions Inc.',
            sector: 'technology',
            revenue: '1500000',
            status: 'active',
            contactName: 'Jean Dupont',
            contactEmail: 'jean.dupont@techsolutions.com',
            contactPhone: '01 23 45 67 89',
            address: '25 Rue de l\'Innovation, 75001 Paris',
            website: 'www.techsolutions.com',
            description: 'Entreprise spécialisée dans les solutions cloud',
            notes: 'Client depuis 3 ans, relation solide',
            createdAt: '2022-01-15T10:30:00Z',
            customerSince: '2022-01-15T10:30:00Z'
          },
          {
            id: '2',
            name: 'Finance Plus',
            sector: 'finance',
            revenue: '3500000',
            status: 'active',
            contactName: 'Marie Lefebvre',
            contactEmail: 'marie.lefebvre@financeplus.fr',
            contactPhone: '01 98 76 54 32',
            address: '8 Avenue des Finances, 69002 Lyon',
            website: 'www.financeplus.fr',
            description: 'Cabinet de conseil financier',
            notes: 'Expansion prévue au prochain trimestre',
            createdAt: '2022-03-22T14:15:00Z',
            customerSince: '2022-03-22T14:15:00Z'
          },
          {
            id: '3',
            name: 'MédSanté',
            sector: 'healthcare',
            revenue: '2700000',
            status: 'inactive',
            contactName: 'Pierre Martin',
            contactEmail: 'p.martin@medsante.org',
            contactPhone: '01 45 67 89 12',
            address: '15 Boulevard de la Santé, 33000 Bordeaux',
            website: 'www.medsante.org',
            description: 'Clinique privée spécialisée en cardiologie',
            notes: 'Contrat en pause, reprise prévue en septembre',
            createdAt: '2022-06-10T09:45:00Z',
            customerSince: '2022-06-10T09:45:00Z'
          },
          {
            id: '4',
            name: 'Construc BTP',
            sector: 'construction',
            revenue: '5200000',
            status: 'active',
            contactName: 'Sophie Bernard',
            contactEmail: 'sophie@construc-btp.fr',
            contactPhone: '01 23 45 67 89',
            address: '42 Rue des Bâtisseurs, 59000 Lille',
            website: 'www.construc-btp.fr',
            description: 'Entreprise de construction et travaux publics',
            notes: 'Projets importants en cours',
            createdAt: '2022-09-05T11:20:00Z',
            customerSince: '2022-09-05T11:20:00Z'
          },
          {
            id: '5',
            name: 'EduFrance',
            sector: 'education',
            revenue: '900000',
            status: 'lead',
            contactName: 'Thomas Dubois',
            contactEmail: 'thomas.dubois@edufrance.edu',
            contactPhone: '01 76 54 32 10',
            address: '3 Rue de l\'Éducation, 44000 Nantes',
            website: 'www.edufrance.edu',
            description: 'Groupe d\'écoles privées',
            notes: 'Intéressé par nos solutions numériques',
            createdAt: '2022-11-18T16:00:00Z'
          }
        ];
        
        setClients(mockClients);
        setFilteredClients(mockClients);
        setError(null);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Une erreur est survenue lors du chargement des clients');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  // Filter clients when search or filter changes
  useEffect(() => {
    if (clients.length > 0) {
      let filtered = [...clients];
      
      // Apply sector filter
      if (sectorFilter !== 'all') {
        filtered = filtered.filter(client => client.sector === sectorFilter);
      }
      
      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(client => 
          client.name.toLowerCase().includes(search) ||
          client.contactName.toLowerCase().includes(search) ||
          client.contactEmail.toLowerCase().includes(search)
        );
      }
      
      setFilteredClients(filtered);
    }
  }, [clients, searchTerm, sectorFilter]);
  
  // Client CRUD operations
  const addClient = async (clientData: ClientFormData) => {
    try {
      // Here we would normally call an API to add a client
      // For now, we'll just update our local state
      const newClient: Client = {
        id: Date.now().toString(),
        ...clientData,
        status: clientData.status as 'active' | 'inactive' | 'lead',
        createdAt: new Date().toISOString(),
        customerSince: new Date().toISOString()
      };
      
      setClients(prev => [newClient, ...prev]);
      toast.success('Client ajouté avec succès');
      return newClient;
    } catch (err) {
      console.error('Error adding client:', err);
      toast.error('Erreur lors de l\'ajout du client');
      throw err;
    }
  };
  
  const updateClient = async (id: string, clientData: Partial<ClientFormData>) => {
    try {
      // Here we would normally call an API to update a client
      // For now, we'll just update our local state
      const updatedClients = clients.map(client => {
        if (client.id === id) {
          return {
            ...client,
            ...clientData,
            status: (clientData.status as 'active' | 'inactive' | 'lead') || client.status
          };
        }
        return client;
      });
      
      setClients(updatedClients);
      toast.success('Client mis à jour avec succès');
      return clients.find(client => client.id === id);
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error('Erreur lors de la mise à jour du client');
      throw err;
    }
  };
  
  const deleteClient = async (id: string) => {
    try {
      // Here we would normally call an API to delete a client
      // For now, we'll just update our local state
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Client supprimé avec succès');
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Erreur lors de la suppression du client');
      throw err;
    }
  };
  
  const refreshClients = async () => {
    setIsLoading(true);
    try {
      // Here we would normally refresh the client data
      // For now, we'll just simulate a refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Données des clients actualisées');
      return true;
    } catch (err) {
      console.error('Error refreshing clients:', err);
      toast.error('Erreur lors de l\'actualisation des clients');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Event handlers
  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      sector: client.sector,
      revenue: client.revenue,
      status: client.status,
      contactName: client.contactName,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      address: client.address,
      website: client.website || '',
      description: client.description || '',
      notes: client.notes || ''
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };
  
  const viewClientDetails = (client: Client) => {
    setSelectedClient(client);
    setIsViewDetailsOpen(true);
  };
  
  const handleCreateClient = async () => {
    try {
      await addClient(formData);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error in handleCreateClient:', err);
    }
  };
  
  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    
    try {
      await updateClient(selectedClient.id, formData);
      setIsEditDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error in handleUpdateClient:', err);
    }
  };
  
  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    
    try {
      await deleteClient(selectedClient.id);
      setIsDeleteDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error in handleDeleteClient:', err);
    }
  };
  
  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refreshClients,
    filteredClients,
    searchTerm,
    setSearchTerm,
    sectorFilter,
    setSectorFilter,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDetailsOpen,
    setIsViewDetailsOpen,
    selectedClient,
    formData,
    handleInputChange,
    handleSelectChange,
    handleCreateClient,
    handleUpdateClient,
    handleDeleteClient,
    openEditDialog,
    openDeleteDialog,
    viewClientDetails,
    resetForm,
    loading: isLoading
  };
};
