
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import { toast } from 'sonner';
import { TaxDeclaration } from '../types/accounting-types';

export const useTaxDeclarations = () => {
  const [declarations, setDeclarations] = useState<TaxDeclaration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const declarationsCollection = useFirestore(COLLECTIONS.ACCOUNTING.TAXES + '/declarations');

  const loadDeclarations = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Always sort by period in descending order
      const constraints = [orderBy('period', 'desc')];
      
      const data = await declarationsCollection.getAll(constraints);
      
      // Transform into TaxDeclaration objects
      const declarationsData = data.map((doc: any) => ({
        id: doc.id,
        period: doc.period || '',
        startDate: doc.startDate || '',
        endDate: doc.endDate || '',
        dueDate: doc.dueDate || '',
        totalTaxCollected: doc.totalTaxCollected || 0,
        totalTaxPaid: doc.totalTaxPaid || 0,
        balance: doc.balance || 0,
        status: doc.status || 'draft',
        reference: doc.reference || '',
        notes: doc.notes || '',
        attachments: doc.attachments || [],
        // Backward compatibility fields
        amount: doc.amount || 0,
        estimatedAmount: doc.estimatedAmount || 0,
        dateFiled: doc.dateFiled || '',
        filedBy: doc.filedBy || '',
        createdAt: doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toISOString() : '',
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toISOString() : '',
      }));
      
      setDeclarations(declarationsData as TaxDeclaration[]);
    } catch (error) {
      console.error('Erreur lors du chargement des déclarations:', error);
      toast.error('Impossible de charger les déclarations');
    } finally {
      setIsLoading(false);
    }
  }, [declarationsCollection]);
  
  useEffect(() => {
    loadDeclarations();
  }, [loadDeclarations]);
  
  return { declarations, isLoading, reload: loadDeclarations };
};
