
import { useState } from 'react';
import { useClientsData } from './useClientsData';
import { toast } from 'sonner';
import { Client, ClientFormData } from '../types/crm-types';

// Define sectors as a constant array that can be imported elsewhere
export const sectors = [
  'Technology',
  'Manufacturing',
  'Healthcare',
  'Finance',
  'Retail',
  'Education',
  'Construction',
  'Energy',
  'Transportation',
  'Hospitality',
  'Media',
  'Agriculture',
  'Other'
];

export const useClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    sector: 'Technology',
    revenue: '',
    status: 'active',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    notes: '',
    website: '',
  });

  const { 
    clients, 
    isLoading: loading, 
    error,
    addClient: addClientData,
    updateClient: updateClientData,
    deleteClient: deleteClientData
  } = useClientsData();

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add a new client
  const handleCreateClient = async () => {
    try {
      await addClientData(formData);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Client ajouté avec succès');
      return true;
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Erreur lors de l\'ajout du client');
      return false;
    }
  };

  // Update an existing client
  const handleUpdateClient = async () => {
    if (!selectedClient) return false;
    
    try {
      await updateClientData(selectedClient.id, formData);
      setIsEditDialogOpen(false);
      toast.success('Client mis à jour avec succès');
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Erreur lors de la mise à jour du client');
      return false;
    }
  };

  // Delete a client
  const handleDeleteClient = async () => {
    if (!selectedClient) return false;

    try {
      await deleteClientData(selectedClient.id);
      setIsDeleteDialogOpen(false);
      toast.success('Client supprimé avec succès');
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erreur lors de la suppression du client');
      return false;
    }
  };

  // Open edit dialog with client data
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
      notes: client.notes || '',
      website: client.website || '',
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

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: '',
      sector: 'Technology',
      revenue: '',
      status: 'active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      notes: '',
      website: '',
    });
  };

  // Filter clients by search term and filters
  const filteredClients = clients.filter(client => {
    const matchesSearch = searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === 'all' || client.sector === sectorFilter;
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesSector && matchesStatus;
  });

  return {
    clients,
    filteredClients,
    isLoading: loading,
    error,
    searchTerm,
    setSearchTerm,
    sectorFilter,
    setSectorFilter,
    statusFilter,
    setStatusFilter,
    selectedClient,
    setSelectedClient,
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
    loading
  };
};
