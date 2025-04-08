
import { useState, useEffect, useCallback } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { toast } from 'sonner';

// Export the options directly from the hook file for easier imports
export const sectors = [
  { value: 'all', label: 'Tous les secteurs' },
  { value: 'technology', label: 'Technologie' },
  { value: 'healthcare', label: 'Santé' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Éducation' },
  { value: 'retail', label: 'Commerce de détail' },
  { value: 'manufacturing', label: 'Fabrication' },
  { value: 'consulting', label: 'Consultation' },
  { value: 'other', label: 'Autre' }
];

export const statusOptions = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'lead', label: 'Prospect' }
];

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    sector: '',
    revenue: '',
    status: 'active',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    website: '',
    description: '',
    notes: ''
  });
  
  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock client data
        const mockClients: Client[] = [
          {
            id: '1',
            name: 'TechCorp',
            sector: 'technology',
            revenue: '1000000',
            status: 'active' as const,
            contactName: 'John Doe',
            contactEmail: 'john@techcorp.com',
            contactPhone: '01 23 45 67 89',
            address: '123 Tech Street, Paris',
            website: 'www.techcorp.com',
            description: 'Leading tech company',
            notes: 'VIP client',
            createdAt: new Date().toISOString(),
            customerSince: '2020-01-01'
          },
          {
            id: '2',
            name: 'HealthCare Plus',
            sector: 'healthcare',
            revenue: '750000',
            status: 'active' as const,
            contactName: 'Jane Smith',
            contactEmail: 'jane@healthcareplus.com',
            contactPhone: '01 98 76 54 32',
            address: '456 Health Avenue, Lyon',
            website: 'www.healthcareplus.com',
            description: 'Healthcare provider',
            notes: 'Regular customer',
            createdAt: new Date().toISOString(),
            customerSince: '2021-03-15'
          },
          {
            id: '3',
            name: 'Finance Group',
            sector: 'finance',
            revenue: '2000000',
            status: 'inactive' as const,
            contactName: 'Robert Johnson',
            contactEmail: 'robert@financegroup.com',
            contactPhone: '01 45 67 89 12',
            address: '789 Finance Street, Paris',
            website: 'www.financegroup.com',
            description: 'Financial services',
            notes: 'Inactive as of last month',
            createdAt: new Date().toISOString(),
            customerSince: '2019-06-10'
          }
        ];
        
        setClients(mockClients);
        setError(null);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Une erreur est survenue lors du chargement des clients');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  // Filter clients based on search term and sector filter
  useEffect(() => {
    const filtered = clients.filter(client => {
      const matchesSearch = searchTerm === '' || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = sectorFilter === 'all' || client.sector === sectorFilter;
      
      return matchesSearch && matchesSector;
    });
    
    setFilteredClients(filtered);
  }, [clients, searchTerm, sectorFilter]);
  
  // Form handling
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      sector: '',
      revenue: '',
      status: 'active',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      website: '',
      description: '',
      notes: ''
    });
  }, []);
  
  // CRUD operations
  const handleCreateClient = useCallback(async (data: ClientFormData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ensure status is a valid Client status type
      const clientStatus = (data.status === 'active' || data.status === 'inactive' || data.status === 'lead') 
        ? data.status 
        : 'active';
      
      const newClient: Client = {
        id: Date.now().toString(),
        ...data,
        status: clientStatus,
        createdAt: new Date().toISOString(),
        customerSince: new Date().toISOString().split('T')[0]
      };
      
      setClients(prev => [newClient, ...prev]);
      resetForm();
      setIsAddDialogOpen(false);
      toast.success('Client créé avec succès');
    } catch (err) {
      console.error('Error creating client:', err);
      toast.error('Erreur lors de la création du client');
    }
  }, [resetForm]);
  
  const handleUpdateClient = useCallback(async (data: ClientFormData) => {
    if (!selectedClient) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ensure status is a valid Client status type
      const clientStatus = (data.status === 'active' || data.status === 'inactive' || data.status === 'lead') 
        ? data.status 
        : 'active';
      
      setClients(prev => 
        prev.map(client => 
          client.id === selectedClient.id 
            ? { ...client, ...data, status: clientStatus } 
            : client
        )
      );
      
      resetForm();
      setIsEditDialogOpen(false);
      toast.success('Client mis à jour avec succès');
    } catch (err) {
      console.error('Error updating client:', err);
      toast.error('Erreur lors de la mise à jour du client');
    }
  }, [selectedClient, resetForm]);
  
  const handleDeleteClient = useCallback(async () => {
    if (!selectedClient) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      setIsDeleteDialogOpen(false);
      toast.success('Client supprimé avec succès');
    } catch (err) {
      console.error('Error deleting client:', err);
      toast.error('Erreur lors de la suppression du client');
    }
  }, [selectedClient]);
  
  // Dialog handling
  const openEditDialog = useCallback((client: Client) => {
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
      description: client.description || '',
      notes: client.notes || ''
    });
    setIsEditDialogOpen(true);
  }, []);
  
  const openDeleteDialog = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  }, []);
  
  const viewClientDetails = useCallback((client: Client) => {
    setSelectedClient(client);
    setIsViewDetailsOpen(true);
  }, []);
  
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
    loading,
    error
  };
};
