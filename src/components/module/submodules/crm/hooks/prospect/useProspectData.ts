
import { useEffect } from 'react';
import { Timestamp, DocumentData } from 'firebase/firestore';
import { where, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Prospect } from '../../types/crm-types';
import { toast } from 'sonner';

export const useProspectData = (
  setProspects: React.Dispatch<React.SetStateAction<Prospect[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const prospectCollection = useFirestore(COLLECTIONS.CRM.PROSPECTS);

  useEffect(() => {
    loadProspects();
  }, []);

  const loadProspects = async () => {
    try {
      setLoading(true);
      const constraints = [
        where('type', '==', 'prospect'),
        orderBy('lastContact', 'desc')
      ];
      
      const data = await prospectCollection.getAll(constraints);
      
      const formattedData = data.map((doc: DocumentData) => {
        const createdAtTimestamp = doc.createdAt as Timestamp | undefined;
        const lastContactTimestamp = doc.lastContact as Timestamp | undefined;
        
        let createdAtDate = '';
        let lastContactDate = '';
        
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
        
        // Gestion sécurisée de la date lastContact
        if (lastContactTimestamp) {
          if (typeof lastContactTimestamp === 'object' && 'toDate' in lastContactTimestamp && typeof lastContactTimestamp.toDate === 'function') {
            lastContactDate = lastContactTimestamp.toDate().toISOString().split('T')[0];
          } else if (lastContactTimestamp instanceof Date) {
            lastContactDate = lastContactTimestamp.toISOString().split('T')[0];
          } else if (typeof lastContactTimestamp === 'string') {
            lastContactDate = new Date(lastContactTimestamp).toISOString().split('T')[0];
          }
        }
        
        return {
          id: doc.id,
          name: doc.name || '',
          company: doc.company || '',
          email: doc.email || '',
          phone: doc.phone || '',
          status: doc.status || 'warm',
          source: doc.source || '',
          createdAt: createdAtDate,
          lastContact: lastContactDate,
          notes: doc.notes || ''
        } as Prospect;
      });
      
      setProspects(formattedData);
    } catch (error) {
      console.error("Erreur lors du chargement des prospects:", error);
      toast.error("Impossible de charger les prospects");
    } finally {
      setLoading(false);
    }
  };

  return { prospectCollection, loadProspects };
};
