
import { useState, useEffect, ChangeEvent } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { toast } from 'sonner';

// Mock sectors for clients
export const sectors = [
  { value: 'technology', label: 'Technologie' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'retail', label: 'Commerce de détail' },
  { value: 'manufacturing', label: 'Industrie' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Autre' },
];

// Mock clients data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Technoware Solutions',
    contactName: 'Jean Dupont',
    contactEmail: 'jean.dupont@technoware.fr',
    contactPhone: '01 23 45 67 89',
    status: 'active',
    sector: 'technology',
    revenue: '5M-10M',
    website: 'https://technoware.fr',
    address: '15 rue de l\'Innovation, 75001 Paris',
    notes: 'Client fidèle depuis 3 ans',
    customerSince: '2020-05-15',
    createdAt: '2020-05-15T14:30:00.000Z',
    updatedAt: '2023-02-10T09:45:00.000Z',
  },
  {
    id: '2',
    name: 'Banque Centrale',
    contactName: 'Marie Lambert',
    contactEmail: 'marie.lambert@banquecentrale.fr',
    contactPhone: '01 98 76 54 32',
    status: 'active',
    sector: 'finance',
    revenue: '50M+',
    website: 'https://banquecentrale.fr',
    address: '7 avenue des Finances, 75008 Paris',
    notes: 'Contrat de service renouvelé en 2023',
    customerSince: '2018-11-20',
    createdAt: '2018-11-20T10:15:00.000Z',
    updatedAt: '2023-01-15T11:20:00.000Z',
  },
  {
    id: '3',
    name: 'Hôpital Saint-Louis',
    contactName: 'Dr. Pierre Martin',
    contactEmail: 'p.martin@hopitalsaintlouis.fr',
    contactPhone: '01 45 67 89 10',
    status: 'inactive',
    sector: 'healthcare',
    revenue: '20M-50M',
    website: 'https://hopitalsaintlouis.fr',
    address: '1 rue de la Santé, 75010 Paris',
    notes: 'Pause temporaire des services',
    customerSince: '2019-03-05',
    createdAt: '2019-03-05T09:00:00.000Z',
    updatedAt: '2022-11-30T15:45:00.000Z',
  },
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form and dialog state
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    status: 'active',
    sector: '',
    revenue: '',
    website: '',
    address: '',
    notes: '',
    customerSince: new Date().toISOString().split('T')[0],
  });

  // Fetch clients (simulate API call)
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
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

  // Filter clients when searchTerm or sectorFilter changes
  useEffect(() => {
    const filtered = clients.filter(client => {
      const matchesSearch = !searchTerm || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = !sectorFilter || client.sector === sectorFilter;
      
      return matchesSearch && matchesSector;
    });
    
    setFilteredClients(filtered);
  }, [clients, searchTerm, sectorFilter]);

  // Form handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      status: 'active',
      sector: '',
      revenue: '',
      website: '',
      address: '',
      notes: '',
      customerSince: new Date().toISOString().split('T')[0],
    });
  };

  // CRUD operations
  const addClient = async (clientData: ClientFormData): Promise<Client> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setClients(prev => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = async (id: string, clientData: Partial<ClientFormData>): Promise<Client> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let updatedClient: Client | null = null;
    
    setClients(prev => {
      const updated = prev.map(client => {
        if (client.id === id) {
          updatedClient = {
            ...client,
            ...clientData,
            updatedAt: new Date().toISOString(),
          };
          return updatedClient;
        }
        return client;
      });
      
      return updated;
    });
    
    if (!updatedClient) {
      throw new Error('Client not found');
    }
    
    return updatedClient;
  };

  const deleteClient = async (id: string): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const refreshClients = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 800));
      setClients(mockClients);
      setError(null);
    } catch (err) {
      console.error('Error refreshing clients:', err);
      setError('Une erreur est survenue lors du rafraîchissement des clients');
    } finally {
      setIsLoading(false);
    }
  };

  // UI handlers
  const handleCreateClient = async () => {
    try {
      await addClient(formData);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Client ajouté avec succès');
    } catch (err) {
      console.error('Error creating client:', err);
      toast.error('Erreur lors de l\'ajout du client');
    }
  };

  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    
    try {
      await updateClient(selectedClient.id, formData);
      setIsEditDialogOpen(false);
      toast.success('Client mis à jour avec succès');
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error('Erreur lors de la mise à jour du client');
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    
    try {
      await deleteClient(selectedClient.id);
      setIsDeleteDialogOpen(false);
      toast.success('Client supprimé avec succès');
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Erreur lors de la suppression du client');
    }
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      contactName: client.contactName,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone || '',
      status: client.status,
      sector: client.sector || '',
      revenue: client.revenue || '',
      website: client.website || '',
      address: client.address || '',
      notes: client.notes || '',
      customerSince: client.customerSince.split('T')[0],
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

  return {
    clients,
    filteredClients,
    isLoading,
    loading: isLoading, // Alias for CrmClients
    error,
    addClient,
    updateClient,
    deleteClient,
    refreshClients,
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
    resetForm
  };
};
