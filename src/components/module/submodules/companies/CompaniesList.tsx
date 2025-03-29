
import React, { useState, useEffect } from 'react';
import CompaniesToolbar from './CompaniesToolbar';
import CompaniesTable from './CompaniesTable';
import CompaniesFilters from './CompaniesFilters';
import { Company } from './types';
import { getAllCompanies } from './services/companyService';
import { Card, CardContent } from '@/components/ui/card';

const CompaniesList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const companiesData = await getAllCompanies();
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleStatusFilter = (status: string) => {
    setFilters({ ...filters, status });
  };

  const handleSearch = (search: string) => {
    setFilters({ ...filters, search });
  };

  const filteredCompanies = companies.filter((company) => {
    // Status filter
    if (filters.status !== 'all' && company.status !== filters.status) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerms = filters.search.toLowerCase();
      return (
        company.name.toLowerCase().includes(searchTerms) ||
        company.contactName?.toLowerCase().includes(searchTerms) ||
        company.contactEmail?.toLowerCase().includes(searchTerms)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <CompaniesToolbar onSearch={handleSearch} />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-4">
              <CompaniesFilters 
                activeStatus={filters.status} 
                onStatusChange={handleStatusFilter} 
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <CompaniesTable 
            companies={filteredCompanies} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default CompaniesList;
