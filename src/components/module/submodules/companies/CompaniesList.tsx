
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Search, X } from 'lucide-react';
import { Company, CompanyFilters } from './types';
import { companyService } from './services/companyService';
import CompaniesTable from './CompaniesTable';
import CompaniesFilters from './CompaniesFilters';
import { toast } from 'sonner';

const CompaniesList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CompanyFilters>({});
  
  // Function to load companies
  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await companyService.getCompanies(1, 100, filters, searchTerm);
      setCompanies(response.companies);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load companies on mount and when filters or search change
  useEffect(() => {
    loadCompanies();
  }, [searchTerm, filters]);
  
  // Handle company view
  const handleViewCompany = (company: Company) => {
    // Implementation would navigate to a detailed view of the company
    console.log('View company:', company);
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCompanies();
  };
  
  // Update filters
  const handleFilterChange = (newFilters: CompanyFilters) => {
    setFilters(newFilters);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Liste des entreprises</h1>
        
        <div className="flex gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative w-full md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une entreprise..."
              className="pl-8 w-full md:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
          
          <Button onClick={() => window.location.href = '/modules/companies/create'}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <CompaniesFilters onFilterChange={handleFilterChange} />
        </div>
        
        <div className="md:col-span-3">
          <Card>
            <CompaniesTable 
              companies={companies} 
              isLoading={isLoading} 
              onView={handleViewCompany}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompaniesList;
