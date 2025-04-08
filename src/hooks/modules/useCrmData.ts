
import { useEffect, useState, useCallback } from 'react';
import { where, orderBy, limit, QueryConstraint } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { fetchCollectionData } from '@/hooks/fetchCollectionData';
import { useFirestore } from '@/hooks/useFirestore';

/**
 * Hook to fetch data for the CRM module directly from Firebase
 */
export const useCrmData = () => {
  const [clients, setClients] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [settings, setSettings] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from a collection
  const fetchCollection = async (collectionPath, constraints = []) => {
    try {
      return await fetchCollectionData(collectionPath, constraints);
    } catch (err) {
      console.error(`Error fetching ${collectionPath}:`, err);
      throw err;
    }
  };

  // Load all CRM data
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        // Define all collections to fetch with their constraints
        const collectionsToFetch = [
          {
            name: COLLECTIONS.CRM.CLIENTS,
            setter: setClients,
            constraints: [orderBy('createdAt', 'desc'), limit(100)]
          },
          {
            name: COLLECTIONS.CRM.PROSPECTS,
            setter: setProspects,
            constraints: [orderBy('createdAt', 'desc'), limit(100)]
          },
          {
            name: COLLECTIONS.CRM.OPPORTUNITIES,
            setter: setOpportunities,
            constraints: [orderBy('updatedAt', 'desc'), limit(100)]
          },
          {
            name: COLLECTIONS.CRM.CONTACTS,
            setter: setContacts,
            constraints: [limit(100)]
          },
          {
            name: COLLECTIONS.CRM.LEADS,
            setter: setLeads,
            constraints: [orderBy('createdAt', 'desc'), limit(100)]
          },
          {
            name: COLLECTIONS.CRM.DEALS,
            setter: setDeals,
            constraints: [orderBy('updatedAt', 'desc'), limit(100)]
          },
          {
            name: COLLECTIONS.CRM.SETTINGS,
            setter: setSettings,
            constraints: []
          },
          {
            name: COLLECTIONS.CRM.REMINDERS,
            setter: setReminders,
            constraints: [orderBy('dueDate', 'asc'), where('completed', '==', false), limit(20)]
          }
        ];

        // Fetch all collections in parallel
        const promises = collectionsToFetch.map(async ({ name, setter, constraints }) => {
          try {
            const data = await fetchCollection(name, constraints);
            setter(data);
          } catch (err) {
            console.error(`Error fetching ${name}:`, err);
            // Don't fail completely if one collection fails
            setter([]);
          }
        });

        await Promise.all(promises);
        setError(null);
      } catch (err) {
        console.error('Error loading CRM data:', err);
        setError(err);
        toast.error('Erreur lors du chargement des données CRM');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Function to refresh all data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Same collection definitions as above
      const collectionsToFetch = [
        {
          name: COLLECTIONS.CRM.CLIENTS,
          setter: setClients,
          constraints: [orderBy('createdAt', 'desc'), limit(100)]
        },
        {
          name: COLLECTIONS.CRM.PROSPECTS,
          setter: setProspects,
          constraints: [orderBy('createdAt', 'desc'), limit(100)]
        },
        {
          name: COLLECTIONS.CRM.OPPORTUNITIES,
          setter: setOpportunities,
          constraints: [orderBy('updatedAt', 'desc'), limit(100)]
        },
        {
          name: COLLECTIONS.CRM.CONTACTS,
          setter: setContacts,
          constraints: [limit(100)]
        },
        {
          name: COLLECTIONS.CRM.LEADS,
          setter: setLeads,
          constraints: [orderBy('createdAt', 'desc'), limit(100)]
        },
        {
          name: COLLECTIONS.CRM.DEALS,
          setter: setDeals,
          constraints: [orderBy('updatedAt', 'desc'), limit(100)]
        },
        {
          name: COLLECTIONS.CRM.SETTINGS,
          setter: setSettings,
          constraints: []
        },
        {
          name: COLLECTIONS.CRM.REMINDERS,
          setter: setReminders,
          constraints: [orderBy('dueDate', 'asc'), where('completed', '==', false), limit(20)]
        }
      ];

      // Fetch all collections
      const promises = collectionsToFetch.map(async ({ name, setter, constraints }) => {
        try {
          const data = await fetchCollection(name, constraints);
          setter(data);
        } catch (err) {
          console.error(`Error fetching ${name}:`, err);
          // Don't fail completely if one collection fails
          setter([]);
        }
      });

      await Promise.all(promises);
      setError(null);
      toast.success('Données CRM mises à jour');
    } catch (err) {
      console.error('Error refreshing CRM data:', err);
      setError(err);
      toast.error('Erreur lors de la mise à jour des données CRM');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    clients,
    prospects,
    opportunities,
    contacts,
    leads,
    deals,
    settings,
    reminders,
    isLoading,
    error,
    refreshData
  };
};
