
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
  const prospectCollection = useFirestore(COLLECTIONS.CRM);

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
        
        return {
          id: doc.id,
          name: doc.name || '',
          company: doc.company || '',
          email: doc.email || '',
          phone: doc.phone || '',
          status: doc.status || 'warm',
          source: doc.source || '',
          createdAt: createdAtTimestamp ? createdAtTimestamp.toDate().toISOString().split('T')[0] : '',
          lastContact: lastContactTimestamp ? lastContactTimestamp.toDate().toISOString().split('T')[0] : '',
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
