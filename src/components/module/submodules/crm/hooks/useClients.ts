
import { useState, useEffect, useCallback } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { toast } from 'sonner';
import { useClientsData } from './useClientsData';

// Export the options directly from the hook file for easier imports
export const sectors = [
  { value: 'all', label: 'Tous les secteurs' },
  { value: 'technology', label: 'Technologie' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Éducation' },
  { value: 'retail', label: 'Commerce de détail' },
  { value: 'manufacturing', label: 'Fabrication' },
  { value: 'consulting', label: 'Consultation' },
  { value: 'other', label: 'Autre' }
];

export const statusOptions = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'lead', label: 'Prospect' }
];

export const useClients = () => {
  // Use the real Firebase data from useClientsData
  const { 
    clients, 
    isLoading: loading, 
    error: fetchError,
    addClient,
    updateClient,
    deleteClient
  } = useClientsData();

  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    sector: '',
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
  
  // Set error from fetch if any
  useEffect(() => {
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setError(null);
    }
  }, [fetchError]);
  
  // Filter clients based on search term and sector filter
  useEffect(() => {
    const filtered = clients.filter(client => {
      const matchesSearch = searchTerm === '' || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.contactName && client.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.contactEmail && client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSector = sectorFilter === 'all' || client.sector === sectorFilter;
      
      return matchesSearch && matchesSector;
    });
    
    setFilteredClients(filtered);
  }, [clients, searchTerm, sectorFilter]);
  
  // Form handling
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      sector: '',
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
  }, []);
  
  // CRUD operations
  const handleCreateClient = useCallback(async (data: ClientFormData) => {
    try {
      // Cast the status to the proper type
      await addClient({
        ...data,
        status: data.status as 'active' | 'inactive' | 'lead',
        customerSince: new Date().toISOString().split('T')[0]
      });
      
      resetForm();
      setIsAddDialogOpen(false);
      toast.success('Client créé avec succès');
    } catch (err) {
      console.error('Error creating client:', err);
      toast.error('Erreur lors de la création du client');
    }
  }, [addClient, resetForm]);
  
  const handleUpdateClient = useCallback(async (data: ClientFormData) => {
    if (!selectedClient) return;
    
    try {
      // We need to cast the status here as well
      await updateClient(selectedClient.id, {
        ...data,
        status: data.status as 'active' | 'inactive' | 'lead'
      });
      
      resetForm();
      setIsEditDialogOpen(false);
      toast.success('Client mis à jour avec succès');
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error('Erreur lors de la mise à jour du client');
    }
  }, [selectedClient, updateClient, resetForm]);
  
  const handleDeleteClient = useCallback(async () => {
    if (!selectedClient) return;
    
    try {
      await deleteClient(selectedClient.id);
      
      setIsDeleteDialogOpen(false);
      toast.success('Client supprimé avec succès');
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Erreur lors de la suppression du client');
    }
  }, [selectedClient, deleteClient]);
  
  // Dialog handling
  const openEditDialog = useCallback((client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      sector: client.sector,
      revenue: client.revenue,
      status: client.status,
      contactName: client.contactName || '',
      contactEmail: client.contactEmail || '',
      contactPhone: client.contactPhone || '',
      address: client.address || '',
      website: client.website || '',
      description: client.description || '',
      notes: client.notes || ''
    });
    setIsEditDialogOpen(true);
  }, []);
  
  const openDeleteDialog = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  }, []);
  
  const viewClientDetails = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsViewDetailsOpen(true);
  }, []);
  
  return {
    clients,
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
    loading,
    error
  };
};
