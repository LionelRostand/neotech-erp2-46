
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyService } from './services/companyService';
import { Company, CompanyFilters } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from '@/hooks/use-toast';
import CompaniesTable from './CompaniesTable';
import CompaniesToolbar from './CompaniesToolbar';
import CompaniesFilters from './CompaniesFilters';

const CompaniesList: React.FC = () => {
  const navigate = useNavigate();
  const { getCompanies } = useCompanyService();
  const { toast } = useToast();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CompanyFilters>({
    status: undefined,
    startDate: undefined,
    endDate: undefined
  });
  
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching companies...');
      const { companies: fetchedCompanies, hasMore: more } = await getCompanies(
        page, 
        10, 
        filters, 
        searchTerm
      );
      console.log('Companies fetched:', fetchedCompanies);
      setCompanies(fetchedCompanies);
      setHasMore(more);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les entreprises",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [getCompanies, page, filters, searchTerm, toast]);
  
  // Utilisation d'un effet avec un tableau de dépendances stable
  // On retire l'appel répété qui causait la boucle infinie
  useEffect(() => {
    console.log('CompaniesList component mounted');
    fetchCompanies();
    // La dépendance fetchCompanies est stable grâce à useCallback
  }, [fetchCompanies]);
  
  const handleSearch = () => {
    setPage(1); // Reset to first page
    fetchCompanies();
  };
  
  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') {
      // Ensure status is a valid value or undefined
      const statusValue = value === 'all' ? undefined : value as 'active' | 'inactive' | 'pending';
      setFilters(prev => ({
        ...prev,
        [key]: statusValue
      }));
    } else if (key === 'startDate' || key === 'endDate') {
      // Convert date strings to Date objects
      const dateValue = value === '' ? undefined : new Date(value);
      setFilters(prev => ({
        ...prev,
        [key]: dateValue
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };
  
  const resetFilters = () => {
    setFilters({
      status: undefined,
      startDate: undefined,
      endDate: undefined
    });
    setPage(1);
    fetchCompanies();
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const handleRefresh = () => {
    fetchCompanies();
  };
  
  const handleCreateCompany = () => {
    navigate('/modules/companies/create');
  };

  const handleViewCompany = (company: Company) => {
    // Naviguer vers la page de détails de l'entreprise quand elle sera disponible
    console.log('Company clicked:', company);
    toast({
      title: "Information",
      description: `Vous avez sélectionné : ${company.name}`,
    });
  };
  
  const totalPages = Math.ceil(companies.length / 10) + (hasMore ? 1 : 0);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Liste des entreprises</CardTitle>
        </CardHeader>
        <CardContent>
          <CompaniesToolbar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            onCreateCompany={handleCreateCompany}
            onRefresh={handleRefresh}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />
          
          {showFilters && (
            <CompaniesFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onResetFilters={resetFilters} 
            />
          )}
          
          <div className="mt-6">
            <CompaniesTable 
              companies={companies} 
              loading={loading} 
              onView={handleViewCompany} 
            />
          </div>
          
          {companies.length > 0 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(page - 1, 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const pageNumber = page <= 3 
                      ? i + 1 
                      : page >= totalPages - 2 
                        ? totalPages - 4 + i 
                        : page - 2 + i;
                    
                    if (pageNumber > 0 && pageNumber <= totalPages) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={page === pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(page + 1)}
                      className={!hasMore ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompaniesList;
