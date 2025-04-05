
import { useState } from 'react';
import { useClientsData } from './useClientsData';
import { toast } from 'sonner';
import { Client, ClientFormData } from '../types/crm-types';

export const useClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const { 
    clients, 
    isLoading, 
    error,
    addClient: addClientData,
    updateClient: updateClientData,
    deleteClient: deleteClientData
  } = useClientsData();

  // Add a new client
  const addClient = async (data: ClientFormData) => {
    try {
      const newClient = {
        ...data,
        customerSince: data.customerSince || new Date().toISOString().split('T')[0]
      };
      
      await addClientData(newClient);
      toast.success('Client ajouté avec succès');
      setIsAddDialogOpen(false);
      return true;
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Erreur lors de l\'ajout du client');
      return false;
    }
  };

  // Update an existing client
  const updateClient = async (id: string, data: ClientFormData) => {
    try {
      await updateClientData(id, data);
      toast.success('Client mis à jour avec succès');
      setIsEditDialogOpen(false);
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Erreur lors de la mise à jour du client');
      return false;
    }
  };

  // Delete a client
  const deleteClient = async (id: string) => {
    try {
      await deleteClientData(id);
      toast.success('Client supprimé avec succès');
      setIsDeleteDialogOpen(false);
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erreur lors de la suppression du client');
      return false;
    }
  };

  // Filter clients by search term and status
  const filteredClients = clients.filter(client => {
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return {
    clients,
    filteredClients,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
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
    isViewDialogOpen,
    setIsViewDialogOpen,
    addClient,
    updateClient,
    deleteClient
  };
};
