
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Client, ClientFormData } from '../types/crm-types';
import { useClientsData } from './useClientsData';
import { toast } from 'sonner';

// Define sectors and status options with proper types
export const sectors = [
  { value: 'technology', label: 'Technologie' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Éducation' },
  { value: 'retail', label: 'Commerce' },
  { value: 'manufacturing', label: 'Industrie' },
  { value: 'consulting', label: 'Conseil' },
  { value: 'real-estate', label: 'Immobilier' },
  { value: 'hospitality', label: 'Hôtellerie' },
  { value: 'other', label: 'Autre' }
];

export const statusOptions = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'lead', label: 'Prospect' }
];

export const useClients = () => {
  // Client data
  const { clients, isLoading, error, fetchClients, addClient, updateClient, deleteClient } = useClientsData();
  
  // State for filtered clients
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  // Selected client and form data
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    sector: 'technology',
    status: 'active',
    revenue: '1-10M',
    address: '',
    website: '',
    notes: ''
  });
  
  // Apply filters to clients
  useEffect(() => {
    if (!clients) {
      setFilteredClients([]);
      return;
    }
    
    let result = [...clients];
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      result = result.filter(client => 
        client.name.toLowerCase().includes(lowercasedFilter) ||
        client.contactName.toLowerCase().includes(lowercasedFilter) ||
        client.contactEmail.toLowerCase().includes(lowercasedFilter) ||
        (client.sector && client.sector.toLowerCase().includes(lowercasedFilter))
      );
    }
    
    // Apply sector filter
    if (sectorFilter) {
      result = result.filter(client => client.sector === sectorFilter);
    }
    
    setFilteredClients(result);
  }, [clients, searchTerm, sectorFilter]);
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Client CRUD operations
  const handleCreateClient = async () => {
    try {
      await addClient({
        name: formData.name,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        sector: formData.sector,
        status: formData.status as 'active' | 'inactive' | 'lead',
        revenue: formData.revenue,
        address: formData.address || '',
        website: formData.website || '',
        notes: formData.notes || '',
      });
      
      toast.success('Client ajouté avec succès');
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error creating client:', err);
      toast.error('Erreur lors de l\'ajout du client');
    }
  };
  
  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    
    try {
      await updateClient(selectedClient.id, {
        name: formData.name,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        sector: formData.sector,
        status: formData.status,
        revenue: formData.revenue,
        address: formData.address,
        website: formData.website,
        notes: formData.notes
      });
      
      toast.success('Client mis à jour avec succès');
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error('Erreur lors de la mise à jour du client');
    }
  };
  
  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    
    try {
      await deleteClient(selectedClient.id);
      
      toast.success('Client supprimé avec succès');
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Erreur lors de la suppression du client');
    }
  };
  
  // Dialog control functions
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
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      sector: 'technology',
      status: 'active',
      revenue: '1-10M',
      address: '',
      website: '',
      notes: ''
    });
  };
  
  return {
    clients,
    filteredClients,
    isLoading: isLoading,
    loading: isLoading,
    error: error ? error.message : null,
    selectedClient,
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
    sectors,
    statusOptions,
    fetchClients
  };
};
