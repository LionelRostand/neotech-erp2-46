
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import { toast } from 'sonner';
import { addDocument, updateDocument, deleteDocument } from '@/hooks/firestore/firestore-utils';

export interface Client {
  id: string;
  name: string;
  sector: string;
  revenue: string;
  status: 'active' | 'inactive' | 'lead';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website?: string;
  description?: string;
  notes?: string;
  createdAt: string;
  customerSince?: string;
}

export interface ClientFormData {
  name: string;
  sector: string;
  revenue: string;
  status: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website?: string;
  description?: string;
  notes?: string;
}

// Export sectors array
export const sectors = [
  { value: 'technology', label: 'Technologie' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Éducation' },
  { value: 'retail', label: 'Commerce de détail' },
  { value: 'manufacturing', label: 'Industrie' },
  { value: 'hospitality', label: 'Hôtellerie' },
  { value: 'consulting', label: 'Conseil' },
  { value: 'real_estate', label: 'Immobilier' },
  { value: 'construction', label: 'Construction' },
  { value: 'other', label: 'Autre' }
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Additional state for UI management
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
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
  
  // Fetch clients from Firestore
  const { 
    data: clientsData, 
    isLoading: loading, 
    error: fetchError 
  } = useCollectionData(
    COLLECTIONS.CRM.CLIENTS,
    [orderBy('name')]
  );
  
  // Update local state when data is fetched
  useEffect(() => {
    if (clientsData) {
      setClients(clientsData as Client[]);
      setIsLoading(false);
    }
    if (fetchError) {
      setError('Failed to load clients');
      setIsLoading(false);
    }
  }, [clientsData, fetchError]);
  
  // Filter clients based on search term and sector filter
  useEffect(() => {
    let filtered = [...clients];
    
    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (sectorFilter !== 'all') {
      filtered = filtered.filter(client => client.sector === sectorFilter);
    }
    
    setFilteredClients(filtered);
  }, [clients, searchTerm, sectorFilter]);
  
  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Client operations
  const handleCreateClient = async () => {
    try {
      const newClient = {
        ...formData,
        status: formData.status as 'active' | 'inactive' | 'lead',
        createdAt: new Date().toISOString(),
        customerSince: new Date().toISOString().split('T')[0]
      };
      
      const result = await addClient(newClient);
      if (result) {
        resetForm();
        setIsAddDialogOpen(false);
        toast.success('Client ajouté avec succès');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Erreur lors de la création du client');
    }
  };
  
  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    
    try {
      const success = await updateClient(selectedClient.id, formData);
      if (success) {
        setIsEditDialogOpen(false);
        toast.success('Client mis à jour avec succès');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Erreur lors de la mise à jour du client');
    }
  };
  
  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    
    try {
      const success = await deleteClient(selectedClient.id);
      if (success) {
        setIsDeleteDialogOpen(false);
        toast.success('Client supprimé avec succès');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erreur lors de la suppression du client');
    }
  };
  
  // Dialog management functions
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
  };
  
  // API operations
  const addClient = async (clientData: ClientFormData): Promise<Client | null> => {
    try {
      const result = await addDocument(COLLECTIONS.CRM.CLIENTS, clientData);
      const newClient = { 
        id: typeof result === 'object' ? result.id : result, 
        ...clientData, 
        status: clientData.status as 'active' | 'inactive' | 'lead',
        createdAt: new Date().toISOString() 
      };
      setClients(prev => [...prev, newClient]);
      return newClient;
    } catch (error) {
      console.error('Error adding client:', error);
      setError('Failed to add client');
      return null;
    }
  };
  
  const updateClient = async (id: string, clientData: Partial<ClientFormData>): Promise<boolean> => {
    try {
      await updateDocument(COLLECTIONS.CRM.CLIENTS, id, clientData);
      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...clientData } : client
      ));
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      setError('Failed to update client');
      return false;
    }
  };
  
  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      await deleteDocument(COLLECTIONS.CRM.CLIENTS, id);
      setClients(prev => prev.filter(client => client.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Failed to delete client');
      return false;
    }
  };
  
  const refreshClients = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This would be replaced with actual refresh logic
      return true;
    } catch (error) {
      console.error('Error refreshing clients:', error);
      setError('Failed to refresh clients');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    clients,
    filteredClients,
    isLoading,
    loading,
    error,
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
    addClient,
    updateClient,
    deleteClient,
    refreshClients
  };
};
