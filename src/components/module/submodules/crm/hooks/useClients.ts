
import { useState, useEffect, useCallback } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { useClientsData } from './useClientsData';
import { toast } from 'sonner';

export const useClients = () => {
  // Get clients data from Firestore with offline fallback
  const { 
    clients, 
    isLoading: loading, 
    error,
    isOfflineMode,
    fetchClients,
    addClient: addClientToDb,
    updateClient: updateClientInDb,
    deleteClient: deleteClientFromDb,
    seedMockClients
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

  // Function to refresh clients data
  const refreshClients = useCallback(async () => {
    try {
      await fetchClients();
      toast.success('Données clients mises à jour');
    } catch (err) {
      console.error('Error refreshing clients:', err);
      toast.error('Impossible de rafraîchir les données. Véfiez votre connexion.');
    }
  }, [fetchClients]);

  // Create client
  const handleCreateClient = async (clientData: ClientFormData) => {
    if (!clientData.name.trim()) {
      toast.error("Le nom du client est requis");
      return;
    }
    
    try {
      // Ensure status is a valid enum value
      const validClientData = {
        ...clientData,
        status: clientData.status as 'active' | 'inactive' | 'lead'
      };
      
      await addClientToDb(validClientData);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating client:', error);
      // Error is already handled in the useClientsData hook
    }
  };

  // Update client
  const handleUpdateClient = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedClient) {
      console.error("No client selected for update");
      toast.error("Erreur: Aucun client sélectionné");
      return;
    }
    
    if (!formData.name.trim()) {
      toast.error("Le nom du client est requis");
      return;
    }

    try {
      console.log("Updating client with ID:", selectedClient.id);
      console.log("Update data:", formData);
      
      // Ensure status is a valid enum value
      const clientData = {
        ...formData,
        status: formData.status as 'active' | 'inactive' | 'lead'
      };
      
      const result = await updateClientInDb(selectedClient!.id, clientData);
      
      // Check if the operation was completed offline
      if (result && '_offlineUpdated' in result && result._offlineUpdated) {
        console.log('Client updated in offline mode:', result);
      }
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating client:', error);
      
      // If there's an error, we'll show it, but we don't close the dialog
      // so user can try again
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur lors de la mise à jour: ${message}`);
    }
  };

  // Delete client
  const handleDeleteClient = async () => {
    if (!selectedClient) {
      console.error("No client selected for deletion");
      toast.error("Erreur: Aucun client sélectionné");
      return;
    }

    try {
      console.log("Deleting client", selectedClient.id);
      await deleteClientFromDb(selectedClient.id);
      
      // Also update the local state to remove the client immediately
      // even if we're offline
      setFilteredClients(prev => prev.filter(client => client.id !== selectedClient.id));
      
      // Close the delete dialog after successful deletion
      setIsDeleteDialogOpen(false);
      toast.success("Client supprimé avec succès");
    } catch (error) {
      console.error('Error deleting client:', error);
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      toast.error(`Erreur lors de la suppression: ${message}`);
      // We do not close the dialog in case of error so the user can try again
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
    isOfflineMode,
    sectors,
    statusOptions,
    refreshClients
  };
};
