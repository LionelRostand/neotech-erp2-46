
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { TaxDeclaration } from '../types/accounting-types';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';

export const useTaxDeclarationsData = (filterStatus?: string) => {
  const [taxDeclarations, setTaxDeclarations] = useState<TaxDeclaration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Préparer les contraintes de requête
  const constraints: QueryConstraint[] = [orderBy('dueDate', 'desc')];
  
  if (filterStatus) {
    constraints.push(where('status', '==', filterStatus));
  }

  // Utiliser le hook useCollectionData pour récupérer les données en temps réel
  const { data, isLoading: dataLoading, error } = useCollectionData(
    COLLECTIONS.ACCOUNTING.TAXES,
    constraints
  );

  useEffect(() => {
    if (!dataLoading && data) {
      // Transformer les données en objets TaxDeclaration
      const formattedDeclarations: TaxDeclaration[] = data.filter((doc: any) => doc.type === 'declaration').map((doc: any) => ({
        id: doc.id,
        period: doc.period || '',
        dateFiled: doc.dateFiled || null,
        dueDate: doc.dueDate || '',
        amount: doc.amount || 0,
        estimatedAmount: doc.estimatedAmount || 0,
        status: doc.status || 'upcoming',
        filedBy: doc.filedBy || '',
        notes: doc.notes || '',
        createdAt: doc.createdAt || '',
        updatedAt: doc.updatedAt || ''
      }));
      
      setTaxDeclarations(formattedDeclarations);
      setIsLoading(false);
    }
  }, [data, dataLoading]);

  return { taxDeclarations, isLoading, error };
};
