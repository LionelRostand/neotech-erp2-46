
import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client, ClientFormData } from '../types/crm-types';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Define sectors and status options for reuse
export const sectors = [
  'technology',
  'manufacturing',
  'finance',
  'healthcare',
  'retail',
  'education',
  'government',
  'energy',
  'media',
  'consulting',
  'autre'
];

export const statusOptions = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'lead', label: 'Prospect' }
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  // Form state
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
    notes: ''
  });
  
  // Load clients from Firestore
  useEffect(() => {
    fetchClients();
  }, []);
  
  // Filter clients based on search term and sector filter
  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, sectorFilter]);
  
  const fetchClients = async () => {
    try {
      setLoading(true);
      const clientsRef = collection(db, COLLECTIONS.CRM.CLIENTS);
      const q = query(clientsRef, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      
      // If collection is empty, add mock data
      if (querySnapshot.empty) {
        await seedMockClients();
        fetchClients(); // Recall to get the seeded data
        return;
      }
      
      const fetchedClients = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Format dates as strings
        let createdAtStr = '';
        
        if (data.createdAt) {
          if (data.createdAt.toDate) { // Firestore Timestamp
            createdAtStr = data.createdAt.toDate().toISOString();
          } else if (data.createdAt instanceof Date) {
            createdAtStr = data.createdAt.toISOString();
          } else {
            createdAtStr = new Date(data.createdAt).toISOString();
          }
        } else {
          createdAtStr = new Date().toISOString();
        }
        
        // Ensure status is a valid enum value
        const status = data.status || 'active';
        const validStatus = ['active', 'inactive', 'lead'].includes(status) 
          ? status as Client['status'] 
          : 'active' as Client['status'];
        
        return {
          id: doc.id,
          name: data.name || '',
          sector: data.sector || '',
          revenue: data.revenue || '',
          status: validStatus,
          contactName: data.contactName || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          address: data.address || '',
          website: data.website || '',
          description: data.description || '',
          notes: data.notes || '',
          createdAt: createdAtStr,
          customerSince: data.customerSince || createdAtStr.split('T')[0]
        } as Client;
      });
      
      setClients(fetchedClients);
      setError('');
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Erreur lors du chargement des clients');
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };
  
  // Filter clients based on search term and sector filter
  const filterClients = () => {
    let filtered = [...clients];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(search) ||
        client.contactName.toLowerCase().includes(search) ||
        client.contactEmail.toLowerCase().includes(search)
      );
    }
    
    // Apply sector filter
    if (sectorFilter !== 'all') {
      filtered = filtered.filter(client => client.sector === sectorFilter);
    }
    
    setFilteredClients(filtered);
  };
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // CRUD Operations
  const handleCreateClient = async () => {
    try {
      setLoading(true);
      
      // Ensure status is a valid enum value
      const validStatus = ['active', 'inactive', 'lead'].includes(formData.status) 
        ? formData.status 
        : 'active';
      
      // Create new client in Firestore
      const clientsRef = collection(db, COLLECTIONS.CRM.CLIENTS);
      const newClient = {
        ...formData,
        status: validStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        customerSince: new Date().toISOString().split('T')[0]
      };
      
      const docRef = await addDoc(clientsRef, newClient);
      
      // Add client to local state
      const newClientWithId: Client = {
        ...formData,
        id: docRef.id,
        status: validStatus as Client['status'],
        createdAt: new Date().toISOString(),
        customerSince: new Date().toISOString().split('T')[0]
      };
      
      setClients(prev => [newClientWithId, ...prev]);
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Client ajouté avec succès');
    } catch (err) {
      console.error('Error creating client:', err);
      toast.error('Erreur lors de la création du client');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    
    try {
      setLoading(true);
      
      // Ensure status is a valid enum value
      const validStatus = ['active', 'inactive', 'lead'].includes(formData.status) 
        ? formData.status 
        : 'active';
      
      // Update client in Firestore
      const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, selectedClient.id);
      const updatedClient = {
        ...formData,
        status: validStatus,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(clientRef, updatedClient);
      
      // Update client in local state
      setClients(prev => 
        prev.map(client => 
          client.id === selectedClient.id 
            ? { 
                ...client, 
                ...formData,
                status: validStatus as Client['status'],
                updatedAt: new Date().toISOString()
              } 
            : client
        )
      );
      
      setIsEditDialogOpen(false);
      toast.success('Client mis à jour avec succès');
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error('Erreur lors de la mise à jour du client');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    
    try {
      setLoading(true);
      
      // Delete client from Firestore
      const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, selectedClient.id);
      await deleteDoc(clientRef);
      
      // Remove client from local state
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      
      setIsDeleteDialogOpen(false);
      toast.success('Client supprimé avec succès');
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Erreur lors de la suppression du client');
    } finally {
      setLoading(false);
    }
  };
  
  // Dialog handlers
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
      notes: client.notes || '',
      description: client.description || ''
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
      notes: ''
    });
  };
  
  // Seed mock clients if collection is empty
  const seedMockClients = async () => {
    try {
      const clientsRef = collection(db, COLLECTIONS.CRM.CLIENTS);
      
      const mockClients = [
        {
          name: 'Acme Corporation',
          sector: 'technology',
          revenue: '1000000',
          status: 'active',
          contactName: 'John Doe',
          contactEmail: 'john@acme.com',
          contactPhone: '0123456789',
          address: '123 Main St, Paris',
          website: 'https://acme.com',
          notes: 'Important client',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          customerSince: '2022-01-15'
        },
        {
          name: 'Tech Solutions',
          sector: 'consulting',
          revenue: '500000',
          status: 'active',
          contactName: 'Marie Dupont',
          contactEmail: 'marie@techsolutions.fr',
          contactPhone: '0987654321',
          address: '456 Business Ave, Lyon',
          website: 'https://techsolutions.fr',
          notes: 'New client, great potential',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          customerSince: '2023-06-22'
        }
      ];
      
      const promises = mockClients.map(client => 
        addDoc(clientsRef, client)
      );
      
      await Promise.all(promises);
      console.log('Mock clients seeded successfully');
    } catch (err) {
      console.error('Error seeding mock clients:', err);
    }
  };
  
  return {
    clients: filteredClients,
    loading,
    error,
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
    fetchClients
  };
};
