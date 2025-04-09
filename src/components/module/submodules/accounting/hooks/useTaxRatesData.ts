
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { TaxRate } from '../types/accounting-types';
import { orderBy } from 'firebase/firestore';

export const useTaxRatesData = () => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Utiliser le hook useCollectionData pour récupérer les données en temps réel
  const { data, isLoading: dataLoading, error } = useCollectionData(
    COLLECTIONS.ACCOUNTING.TAXES,
    [orderBy('rate', 'asc')]
  );

  useEffect(() => {
    if (!dataLoading && data) {
      // Transformer les données en objets TaxRate
      const formattedTaxRates: TaxRate[] = data.map((doc: any) => ({
        id: doc.id,
        name: doc.name || '',
        rate: doc.rate || 0,
        description: doc.description || '',
        isDefault: doc.isDefault || false,
      }));
      
      // Si aucun taux par défaut n'est défini et qu'il y a des données, définir le premier comme défaut
      if (formattedTaxRates.length > 0 && !formattedTaxRates.some(tax => tax.isDefault)) {
        formattedTaxRates[0].isDefault = true;
      }
      
      setTaxRates(formattedTaxRates);
      setIsLoading(false);
    }
  }, [data, dataLoading]);

  return { taxRates, isLoading, error };
};
