
import { useState, useEffect, useCallback } from 'react';
import { useClientsData } from './useClientsData';
import { Client, ClientFormData } from '../types/crm-types';

export const useClients = () => {
  // Get clients data from Firestore
  const { 
    clients, 
    isLoading: loading, 
    error, 
    fetchClients,
    addClient: addClientToFirestore,
    updateClient: updateClientInFirestore,
    deleteClient: deleteClientFromFirestore
  } = useClientsData();

  // Local state
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);

  // Form data for adding/editing client
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    sector: '',
    status: 'active',
    revenue: '',
    address: '',
    website: '',
    notes: '',
  });

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      sector: '',
      status: 'active',
      revenue: '',
      address: '',
      website: '',
      notes: '',
    });
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Create client
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure status is a valid enum value
      const clientData = {
        ...formData,
        status: formData.status as 'active' | 'inactive' | 'lead'
      };
      await addClientToFirestore(clientData);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  // Update client
  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      // Ensure status is a valid enum value
      const clientData = {
        ...formData,
        status: formData.status as 'active' | 'inactive' | 'lead'
      };
      await updateClientInFirestore(selectedClient.id, clientData);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  // Delete client
  const handleDeleteClient = async () => {
    if (!selectedClient) return;

    try {
      await deleteClientFromFirestore(selectedClient.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  // Open edit dialog
  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      contactName: client.contactName,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      sector: client.sector,
      status: client.status,
      revenue: client.revenue,
      address: client.address || '',
      website: client.website || '',
      notes: client.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  // View client details
  const viewClientDetails = (client: Client) => {
    setSelectedClient(client);
    setIsViewDetailsOpen(true);
  };

  // Filter clients whenever searchTerm or sectorFilter changes
  useEffect(() => {
    if (!clients) {
      setFilteredClients([]);
      return;
    }

    let result = [...clients];

    // Apply sector filter
    if (sectorFilter !== 'all') {
      result = result.filter(client => client.sector === sectorFilter);
    }

    // Apply search term filter
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      result = result.filter(client => 
        client.name.toLowerCase().includes(lowercasedSearchTerm) ||
        client.contactName.toLowerCase().includes(lowercasedSearchTerm) ||
        client.contactEmail.toLowerCase().includes(lowercasedSearchTerm) ||
        (client.notes && client.notes.toLowerCase().includes(lowercasedSearchTerm))
      );
    }

    setFilteredClients(result);
  }, [clients, searchTerm, sectorFilter]);

  // Predefined sectors
  const sectors = [
    { label: 'Tous les secteurs', value: 'all' },
    { label: 'Technologie', value: 'technology' },
    { label: 'Finance', value: 'finance' },
    { label: 'Santé', value: 'healthcare' },
    { label: 'Éducation', value: 'education' },
    { label: 'Commerce de détail', value: 'retail' },
    { label: 'Fabrication', value: 'manufacturing' },
    { label: 'Services', value: 'services' },
    { label: 'Autre', value: 'other' }
  ];

  // Status options
  const statusOptions = [
    { label: 'Actif', value: 'active' },
    { label: 'Inactif', value: 'inactive' },
    { label: 'Lead', value: 'lead' }
  ];

  return {
    clients,
    filteredClients,
    searchTerm,
    setSearchTerm,
    sectorFilter,
    setSectorFilter,
    selectedClient,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isViewDetailsOpen,
    setIsViewDetailsOpen,
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
    error,
    sectors,
    statusOptions
  };
};
