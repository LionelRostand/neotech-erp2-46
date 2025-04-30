
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company } from '@/components/module/submodules/companies/types';

/**
 * Hook to efficiently fetch company data for select dropdowns
 * Uses React Query for caching and prevents excess Firebase calls
 */
export const useCompaniesForSelect = () => {
  // Use React Query to cache our results and minimize Firebase calls
  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies-select'],
    queryFn: async () => {
      try {
        console.log('Fetching companies for select dropdown...');
        const companiesRef = collection(db, 'companies');
        const q = query(companiesRef, orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Sans nom',
          industry: doc.data().industry || '',
          status: doc.data().status || 'active',
        })) as Company[];
      } catch (err) {
        console.error('Error fetching companies:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    gcTime: 10 * 60 * 1000,  // Keep unused data in cache for 10 minutes
  });
  
  // Memoize the sorted and filtered companies list
  const formattedCompanies = useMemo(() => {
    if (!companies) return [];
    
    // Filter out invalid companies and ensure all have required fields
    return companies
      .filter(company => company && company.id && company.name)
      .map(company => ({
        id: company.id,
        name: company.name,
        industry: company.industry || '',
        status: company.status || 'active'
      }));
  }, [companies]);
  
  return {
    companies: formattedCompanies,
    isLoading,
    error
  };
};
