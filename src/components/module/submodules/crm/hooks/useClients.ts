
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FIREBASE_COLLECTIONS } from '@/firebase-collections';
import { Client, ClientFormData } from '../types/crm-types';
import { toast } from 'sonner';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI state for the client component
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
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
    customerSince: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const refreshClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const clientsCollection = collection(db, FIREBASE_COLLECTIONS.CRM.CLIENTS);
      const q = query(clientsCollection, orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const clientsData: Client[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || new Date().toISOString(),
        updatedAt: doc.data().updatedAt || new Date().toISOString(),
      } as Client));
      
      setClients(clientsData);
      setFilteredClients(clientsData);
      setError('');
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.message || 'Failed to fetch clients');
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshClients();
  }, [refreshClients]);

  // Filter clients when searchTerm or sectorFilter changes
  useEffect(() => {
    if (clients.length === 0) return;
    
    const filtered = clients.filter(client => {
      const matchesSearch = searchTerm === '' || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = sectorFilter === '' || client.sector === sectorFilter;
      
      return matchesSearch && matchesSector;
    });
    
    setFilteredClients(filtered);
  }, [clients, searchTerm, sectorFilter]);

  const addClient = async (clientData: ClientFormData): Promise<Client> => {
    try {
      const clientsCollection = collection(db, FIREBASE_COLLECTIONS.CRM.CLIENTS);
      
      const newClient = {
        ...clientData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(clientsCollection, newClient);
      
      const addedClient: Client = {
        id: docRef.id,
        ...newClient,
      } as Client;
      
      setClients(prev => [...prev, addedClient]);
      return addedClient;
    } catch (err: any) {
      console.error('Error adding client:', err);
      throw new Error(err.message || 'Failed to add client');
    }
  };

  const updateClient = async (id: string, clientData: Partial<ClientFormData>): Promise<Client> => {
    try {
      const clientRef = doc(db, FIREBASE_COLLECTIONS.CRM.CLIENTS, id);
      
      const updatedClient = {
        ...clientData,
        updatedAt: new Date().toISOString(),
      };
      
      await updateDoc(clientRef, updatedClient);
      
      const updatedClientWithId: Client = {
        id,
        ...clients.find(c => c.id === id)!,
        ...updatedClient,
      } as Client;
      
      setClients(prev => prev.map(client => 
        client.id === id ? updatedClientWithId : client
      ));
      
      return updatedClientWithId;
    } catch (err: any) {
      console.error('Error updating client:', err);
      throw new Error(err.message || 'Failed to update client');
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const clientRef = doc(db, FIREBASE_COLLECTIONS.CRM.CLIENTS, id);
      await deleteDoc(clientRef);
      
      setClients(prev => prev.filter(client => client.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting client:', err);
      throw new Error(err.message || 'Failed to delete client');
    }
  };

  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      customerSince: new Date().toISOString().split('T')[0]
    });
  };

  // Client dialog actions
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
      customerSince: client.customerSince || new Date().toISOString().split('T')[0]
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

  const handleCreateClient = async () => {
    setLoading(true);
    try {
      await addClient(formData);
      toast.success('Client ajouté avec succès');
      resetForm();
      setIsAddDialogOpen(false);
    } catch (err) {
      toast.error('Erreur lors de l\'ajout du client');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    
    setLoading(true);
    try {
      await updateClient(selectedClient.id, formData);
      toast.success('Client mis à jour avec succès');
      setIsEditDialogOpen(false);
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du client');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    
    setLoading(true);
    try {
      await deleteClient(selectedClient.id);
      toast.success('Client supprimé avec succès');
      setIsDeleteDialogOpen(false);
    } catch (err) {
      toast.error('Erreur lors de la suppression du client');
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refreshClients,
    // UI state
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
