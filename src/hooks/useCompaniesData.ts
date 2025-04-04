
import { useState, useEffect, useCallback } from 'react';
import { useCompanyService } from '@/components/module/submodules/companies/services/companyService';
import { Company, CompanyFilters } from '@/components/module/submodules/companies/types';
import { toast } from 'sonner';

export const useCompaniesData = (initialFilters: CompanyFilters = {}) => {
  const companyService = useCompanyService();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<CompanyFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    totalItems: 0,
    totalPages: 1
  });

  // Load companies
  const loadCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch companies with pagination and filters
      const result = await companyService.getCompanies(
        pagination.page,
        pagination.limit,
        filters,
        searchQuery
      );
      
      setCompanies(result.companies);
      setFilteredCompanies(result.companies); // Initially the same
      setPagination(result.pagination);
      
    } catch (err) {
      console.error("Error loading companies:", err);
      setError(err instanceof Error ? err : new Error('Failed to load companies'));
      toast.error("Erreur lors du chargement des entreprises");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, searchQuery, companyService]);

  // Apply filters
  const applyFilters = useCallback(() => {
    // If we're using server-side filtering, this should just trigger a reload
    loadCompanies();
  }, [loadCompanies]);

  // Handle filters change
  const handleFilterChange = useCallback((newFilters: CompanyFilters) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  }, []);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  }, []);

  // Load companies on initial render and when dependencies change
  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  // Apply filters when filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters, filters]);

  return {
    companies,
    filteredCompanies,
    isLoading,
    error,
    pagination,
    filters,
    searchQuery,
    setCompanies,
    loadCompanies,
    handleFilterChange,
    resetFilters,
    handleSearch,
    handlePageChange
  };
};

export default useCompaniesData;
