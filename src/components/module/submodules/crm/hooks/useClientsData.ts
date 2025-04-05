
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Client } from '../types/crm-types';

export interface Client {
  id: string;
  name: string;
  sector: string;
  revenue: string;
  status: 'active' | 'inactive' | 'paused';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website?: string;
  logo?: string;
  description?: string;
  notes?: string;
  createdAt: string;
  updatedBy?: string;
  customerSince?: string;
}

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const clientsCollection = useFirestore(COLLECTIONS.CRM.CLIENTS);
  
  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsCollection.getAll();
      
      if (data.length > 0) {
        const formattedClients = data.map((doc: any) => {
          // Ensure we have a string ID
          const clientId = typeof doc.id === 'object' ? doc.id.id : doc.id;
          
          return {
            id: clientId,
            name: doc.name || '',
            sector: doc.sector || '',
            revenue: doc.revenue || '',
            status: doc.status || 'active',
            contactName: doc.contactName || '',
            contactEmail: doc.contactEmail || '',
            contactPhone: doc.contactPhone || '',
            address: doc.address || '',
            website: doc.website || '',
            logo: doc.logo || '',
            description: doc.description || '',
            notes: doc.notes || '',
            createdAt: doc.createdAt || new Date().toISOString(),
            updatedBy: doc.updatedBy || '',
            customerSince: doc.customerSince || ''
          } as Client;
        });
        
        setClients(formattedClients);
      } else {
        // If no data, add mock data
        const mockClients = generateMockClients();
        setClients(mockClients);
      }
    } catch (error) {
      console.error("Error loading clients:", error);
      toast.error("Erreur lors du chargement des clients");
      
      // Generate mock data on error
      const mockClients = generateMockClients();
      setClients(mockClients);
    } finally {
      setLoading(false);
    }
  };
  
  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const newClient = {
        ...client,
        createdAt: new Date().toISOString(),
        customerSince: new Date().toISOString().split('T')[0]
      };
      
      const result = await clientsCollection.add(newClient);
      
      const createdClient: Client = {
        ...newClient,
        id: result.id,
      };
      
      setClients(prev => [...prev, createdClient]);
      toast.success("Client ajouté avec succès");
      return true;
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Erreur lors de l'ajout du client");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const updateClient = async (id: string, client: Partial<Client>) => {
    try {
      setLoading(true);
      await clientsCollection.update(id, { ...client, updatedAt: new Date().toISOString() });
      
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...client } : c));
      toast.success("Client mis à jour avec succès");
      return true;
    } catch (error) {
      console.error("Error updating client:", error);
      toast.error("Erreur lors de la mise à jour du client");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteClient = async (id: string) => {
    try {
      setLoading(true);
      await clientsCollection.remove(id);
      
      setClients(prev => prev.filter(c => c.id !== id));
      toast.success("Client supprimé avec succès");
      return true;
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Erreur lors de la suppression du client");
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockClients = (): Client[] => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `mock-${i}`,
      name: `Client ${i + 1}`,
      sector: ['Technologie', 'Finance', 'Santé', 'Éducation', 'Commerce'][i % 5],
      revenue: `${Math.floor(Math.random() * 1000000) + 10000}€`,
      status: ['active', 'inactive', 'paused'][i % 3] as 'active' | 'inactive' | 'paused',
      contactName: `Contact ${i + 1}`,
      contactEmail: `contact${i + 1}@example.com`,
      contactPhone: `+33 1 23 45 67 ${i + 10}`,
      address: `${i + 1} Rue de la Paix, Paris`,
      website: `https://client${i + 1}.example.com`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      customerSince: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
    }));
  };
  
  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);
  
  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refresh: loadClients
  };
};
