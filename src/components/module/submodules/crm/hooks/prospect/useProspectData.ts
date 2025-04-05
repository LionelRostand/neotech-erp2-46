
import { useEffect } from 'react';
import { Timestamp, DocumentData } from 'firebase/firestore';
import { where, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/hooks/useFirestore';
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
        orderBy('createdAt', 'desc')
      ];
      
      const data = await prospectCollection.getAll(constraints);
      
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
          company: doc.company || '',
          contactName: doc.contactName || '',
          contactEmail: doc.contactEmail || '',
          contactPhone: doc.contactPhone || '',
          status: doc.status || 'new',
          source: doc.source || '',
          createdAt: createdAtDate,
          notes: doc.notes || '',
          industry: doc.industry || '',
          website: doc.website || '',
          address: doc.address || '',
          size: doc.size || '',
          estimatedValue: doc.estimatedValue || '',
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
