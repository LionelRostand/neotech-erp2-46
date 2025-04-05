
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useClientsData, Client } from './useClientsData';

export const sectors = ['Technologie', 'Industrie', 'Santé', 'Finance', 'Commerce', 'Services', 'Autres'];

export const useClients = () => {
  const { clients, loading, addClient, updateClient, deleteClient, refresh } = useClientsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    revenue: '',
    status: 'active' as 'active' | 'inactive',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    notes: '',
    website: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateClient = async () => {
    const success = await addClient(formData);
    if (success) {
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    
    const success = await updateClient(selectedClient.id, formData);
    if (success) {
      setIsEditDialogOpen(false);
      resetForm();
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    
    const success = await deleteClient(selectedClient.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
    }
  };

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
      website: client.website || ''
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
      sector: '',
      revenue: '',
      status: 'active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      notes: '',
      website: ''
    });
  };

  // Filter clients based on search term and sector filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesSector = sectorFilter === 'all' ? true : client.sector === sectorFilter;
    
    return matchesSearch && matchesSector;
  });

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
    loading
  };
};
