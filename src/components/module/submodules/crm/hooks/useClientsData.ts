
import { useEffect, useState } from 'react';
import { Timestamp, DocumentData } from 'firebase/firestore';
import { where, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

export interface Client {
  id: string;
  name: string;
  sector: string;
  revenue: string;
  status: 'active' | 'inactive';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  createdAt?: string;
  customerSince?: string;
  lastContact?: string;
  notes?: string;
  website?: string;
}

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const clientsCollection = useFirestore(COLLECTIONS.CRM.CLIENTS);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const constraints = [
        orderBy('createdAt', 'desc')
      ];
      
      const data = await clientsCollection.getAll(constraints);
      
      const formattedData = data.map((doc: DocumentData) => {
        const createdAtTimestamp = doc.createdAt as Timestamp | undefined;
        
        let createdAtDate = '';
        
        // Gestion sécurisée de la date createdAt
        if (createdAtTimestamp) {
          if (typeof createdAtTimestamp === 'object' && 'toDate' in createdAtTimestamp && typeof createdAtTimestamp.toDate === 'function') {
            createdAtDate = createdAtTimestamp.toDate().toISOString().split('T')[0];
          } else if (createdAtTimestamp instanceof Date) {
            createdAtDate = createdAtTimestamp.toISOString().split('T')[0];
          } else if (typeof createdAtTimestamp === 'string') {
            createdAtDate = new Date(createdAtTimestamp).toISOString().split('T')[0];
          }
        }
        
        return {
          id: doc.id,
          name: doc.name || '',
          sector: doc.sector || '',
          revenue: doc.revenue || '0',
          status: doc.status || 'active',
          contactName: doc.contactName || '',
          contactEmail: doc.contactEmail || '',
          contactPhone: doc.contactPhone || '',
          address: doc.address || '',
          createdAt: createdAtDate,
          customerSince: doc.customerSince || '',
          lastContact: doc.lastContact || '',
          notes: doc.notes || '',
          website: doc.website || ''
        } as Client;
      });
      
      setClients(formattedData);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      toast.error("Impossible de charger les clients");
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      setLoading(true);
      const newClient = {
        ...clientData,
        createdAt: new Date().toISOString(),
        customerSince: clientData.customerSince || new Date().toISOString().split('T')[0]
      };
      
      const id = await clientsCollection.add(newClient);
      
      setClients(prev => [{
        id,
        ...newClient
      } as Client, ...prev]);
      
      toast.success("Client ajouté avec succès");
      return id;
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
      toast.error("Impossible d'ajouter le client");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    try {
      setLoading(true);
      await clientsCollection.update(id, clientData);
      
      setClients(prev => prev.map(client => 
        client.id === id ? { ...client, ...clientData } : client
      ));
      
      toast.success("Client mis à jour avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast.error("Impossible de mettre à jour le client");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      setLoading(true);
      await clientsCollection.remove(id);
      
      setClients(prev => prev.filter(client => client.id !== id));
      
      toast.success("Client supprimé avec succès");
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      toast.error("Impossible de supprimer le client");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refresh: loadClients
  };
};
