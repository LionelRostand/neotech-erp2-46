
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client, ClientFormData } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Sector options for clients
export const sectors = [
  { value: 'technology', label: 'Technologie' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Éducation' },
  { value: 'manufacturing', label: 'Fabrication' },
  { value: 'retail', label: 'Commerce de détail' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Autre' }
];

// Status options for clients
export const statusOptions = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'lead', label: 'Lead' }
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  
  // Form data for adding/editing clients
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    sector: '',
    status: 'active',
    website: '',
    notes: ''
  });
  
  // Load clients from Firestore
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientsRef = collection(db, COLLECTIONS.CRM.CLIENTS);
        const q = query(clientsRef, orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        
        // If collection is empty, add mock data
        if (querySnapshot.empty) {
          await seedMockClients();
          fetchClients(); // Recall this function to get the seeded data
          return;
        }
        
        const loadedClients = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            contactName: data.contactName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            sector: data.sector || '',
            status: data.status || 'active',
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
            website: data.website || '',
            notes: data.notes || ''
          } as Client;
        });
        
        setClients(loadedClients);
        setError('');
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Erreur lors du chargement des clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search term and sector filter
  const filteredClients = clients.filter(client => {
    const matchesSector = sectorFilter === 'all' || client.sector === sectorFilter;
    const matchesSearch = searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSector && matchesSearch;
  });

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // CRUD operations
  const handleCreateClient = async () => {
    try {
      setLoading(true);
      const clientsRef = collection(db, COLLECTIONS.CRM.CLIENTS);
      
      const newClient = {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(clientsRef, newClient);
      
      // Add to local state
      setClients(prev => [
        {
          id: docRef.id,
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        } as Client,
        ...prev
      ]);
      
      resetForm();
      setIsAddDialogOpen(false);
      return true;
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Erreur lors de la création du client');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClient = async () => {
    if (!selectedClient) return false;
    
    try {
      setLoading(true);
      const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, selectedClient.id);
      
      const updatedData = {
        ...formData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(clientRef, updatedData);
      
      // Update in local state
      setClients(prev => 
        prev.map(client => 
          client.id === selectedClient.id 
            ? { ...client, ...formData, updatedAt: new Date() } 
            : client
        )
      );
      
      setIsEditDialogOpen(false);
      return true;
    } catch (err) {
      console.error('Error updating client:', err);
      setError('Erreur lors de la mise à jour du client');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return false;
    
    try {
      setLoading(true);
      const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS, selectedClient.id);
      
      await deleteDoc(clientRef);
      
      // Remove from local state
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      
      setIsDeleteDialogOpen(false);
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Erreur lors de la suppression du client');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Dialog handlers
  const resetForm = () => {
    setFormData({
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      sector: '',
      status: 'active',
      website: '',
      notes: ''
    });
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      contactName: client.contactName,
      email: client.email,
      phone: client.phone,
      address: client.address,
      sector: client.sector,
      status: client.status,
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

  // Seed mock data if the collection is empty
  const seedMockClients = async () => {
    try {
      const clientsRef = collection(db, COLLECTIONS.CRM.CLIENTS);
      
      const mockClients = [
        {
          name: 'TechCorp',
          contactName: 'Marc Dupont',
          email: 'marc.dupont@techcorp.fr',
          phone: '+33 1 23 45 67 89',
          address: '123 Avenue de la Tech, 75001 Paris',
          sector: 'technology',
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          website: 'www.techcorp.fr',
          notes: 'Client depuis 2019, très satisfait de nos services.'
        },
        {
          name: 'MédiSanté',
          contactName: 'Claire Dubois',
          email: 'claire.dubois@medisante.fr',
          phone: '+33 1 34 56 78 90',
          address: '456 Boulevard Médical, 69002 Lyon',
          sector: 'healthcare',
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          website: 'www.medisante.fr',
          notes: 'Gros potentiel de croissance sur 2023.'
        },
        {
          name: 'FinaSmart',
          contactName: 'Pierre Martin',
          email: 'pierre.martin@finasmart.fr',
          phone: '+33 1 45 67 89 01',
          address: '789 Rue de la Finance, 33000 Bordeaux',
          sector: 'finance',
          status: 'inactive',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          website: 'www.finasmart.fr',
          notes: 'Contrat en pause depuis janvier 2023.'
        }
      ];
      
      // Add mock data to Firestore
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
    // State
    clients,
    filteredClients,
    loading,
    error,
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
    
    // Handlers
    handleInputChange,
    handleSelectChange,
    handleCreateClient,
    handleUpdateClient,
    handleDeleteClient,
    openEditDialog,
    openDeleteDialog,
    viewClientDetails,
    resetForm
  };
};
