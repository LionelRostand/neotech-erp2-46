
import { useState } from 'react';
import { toast } from "sonner";

// Sample client data
const mockClients = [
  { 
    id: '1', 
    name: 'Acme Corporation', 
    sector: 'Technologie', 
    revenue: '850000', 
    status: 'active',
    contactName: 'John Doe',
    contactEmail: 'john@acme.com',
    contactPhone: '+33612345678',
    address: '12 Rue de Paris, 75001 Paris'
  },
  { 
    id: '2', 
    name: 'Global Industries', 
    sector: 'Industrie', 
    revenue: '2500000', 
    status: 'active',
    contactName: 'Marie Martin',
    contactEmail: 'marie@global-ind.com',
    contactPhone: '+33698765432',
    address: '45 Avenue Victor Hugo, 69002 Lyon'
  },
  { 
    id: '3', 
    name: 'Tech Innovations', 
    sector: 'Technologie', 
    revenue: '375000', 
    status: 'inactive',
    contactName: 'Pierre Dubois',
    contactEmail: 'pierre@tech-innov.com',
    contactPhone: '+33601122334',
    address: '8 Rue Nationale, 44000 Nantes'
  },
];

export const sectors = ['Technologie', 'Industrie', 'Santé', 'Finance', 'Commerce', 'Services', 'Autres'];

export const useClients = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    revenue: '',
    status: 'active',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateClient = () => {
    const newClient = {
      id: Date.now().toString(),
      ...formData
    };
    
    setClients(prev => [newClient, ...prev]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Client ajouté avec succès");
  };

  const handleUpdateClient = () => {
    if (!selectedClient) return;
    
    setClients(prev => 
      prev.map(client => 
        client.id === selectedClient.id 
          ? { ...client, ...formData } 
          : client
      )
    );
    
    setIsEditDialogOpen(false);
    resetForm();
    toast.success("Client mis à jour avec succès");
  };

  const handleDeleteClient = () => {
    if (!selectedClient) return;
    
    setClients(prev => prev.filter(client => client.id !== selectedClient.id));
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
    toast.success("Client supprimé avec succès");
  };

  const openEditDialog = (client: any) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      sector: client.sector,
      revenue: client.revenue,
      status: client.status,
      contactName: client.contactName,
      contactEmail: client.contactEmail,
      contactPhone: client.contactPhone,
      address: client.address
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (client: any) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const viewClientDetails = (client: any) => {
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
      address: ''
    });
  };

  // Filter clients based on search term and sector filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter ? client.sector === sectorFilter : true;
    
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
    resetForm
  };
};
