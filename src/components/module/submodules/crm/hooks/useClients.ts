
import { useState, useEffect, useCallback } from 'react';
import { useClientsData } from './clients/useClientsData';
import { Client, ClientFormData } from '../types/crm-types';

export const useClients = () => {
  const {
    clients,
    isLoading,
    error,
    isOfflineMode,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    seedMockClients,
    cancelLoading
  } = useClientsData();

  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Add default empty values for email and phone
  const initialFormState: ClientFormData = {
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    email: '',  // Add this required field
    phone: '',  // Add this required field
    sector: '',
    status: 'active',
    revenue: '',
    address: '',
    website: '',
    notes: ''
  };

  const [formData, setFormData] = useState<ClientFormData>(initialFormState);

  useEffect(() => {
    filterClients();
  }, [searchTerm, sectorFilter, clients]);

  // Reset form to default values
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      email: '',  // Add this required field
      phone: '',  // Add this required field
      sector: '',
      status: 'active',
      revenue: '',
      address: '',
      website: '',
      notes: ''
    });
  }, []);

  // Filter clients based on search term and sector filter
  const filterClients = useCallback(() => {
    if (!clients || !Array.isArray(clients)) {
      setFilteredClients([]);
      return;
    }

    let filtered = [...clients];

    // Filter by search term
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(lowercasedSearch) ||
        client.contactName.toLowerCase().includes(lowercasedSearch) ||
        client.contactEmail.toLowerCase().includes(lowercasedSearch) ||
        (client.sector && client.sector.toLowerCase().includes(lowercasedSearch))
      );
    }

    // Filter by sector
    if (sectorFilter) {
      filtered = filtered.filter(client => 
        client.sector === sectorFilter
      );
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, sectorFilter]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Create a new client
  const handleCreateClient = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      console.error("Missing required fields");
      return;
    }
    
    await addClient(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Update an existing client
  const handleUpdateClient = async () => {
    if (!selectedClient || !formData.name || !formData.email || !formData.phone) {
      console.error("Selected client is null or missing required fields");
      return;
    }
    
    await updateClient(selectedClient.id, formData);
    setIsEditDialogOpen(false);
    resetForm();
  };

  // Delete a client
  const handleDeleteClient = async () => {
    if (!selectedClient) {
      console.error("Selected client is null");
      return;
    }
    
    await deleteClient(selectedClient.id);
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
  };

  // Populate form with client data for editing
  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      contactName: client.contactName || '',
      contactEmail: client.contactEmail || '',
      contactPhone: client.contactPhone || '',
      email: client.email || '',  // Add this required field
      phone: client.phone || '',  // Add this required field
      sector: client.sector || '',
      status: client.status || 'active',
      revenue: client.revenue || '',
      address: client.address || '',
      website: client.website || '',
      notes: client.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  // View client details
  const viewClientDetails = (client: Client) => {
    setSelectedClient(client);
    setIsViewDetailsOpen(true);
  };

  // Refresh client data
  const refreshClients = async () => {
    await fetchClients();
  };

  // Get unique sectors from clients data for filter options
  const sectors = clients && clients.length > 0
    ? Array.from(new Set(clients.filter(c => c.sector).map(c => c.sector || '')))
        .filter(Boolean)
        .map(sector => ({ value: sector, label: sector }))
    : [];

  // Status options for dropdown
  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'lead', label: 'Prospect' }
  ];

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
    loading: isLoading,
    error,
    isOfflineMode,
    sectors,
    statusOptions,
    refreshClients,
    cancelLoading
  };
};
