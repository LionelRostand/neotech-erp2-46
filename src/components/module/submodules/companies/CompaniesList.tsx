
import React, { useState, useEffect } from 'react';
import CompaniesToolbar from './CompaniesToolbar';
import CompaniesTable from './CompaniesTable';
import CompaniesFilters from './CompaniesFilters';
import { Company, CompanyFilters } from './types';
import { useCompanyService } from './services/companyService';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const CompaniesList: React.FC = () => {
  const { getCompanies } = useCompanyService();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<CompanyFilters>({
    status: 'all',
  });
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { companies: companiesData } = await getCompanies(1, 100, filters, searchTerm);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ status: 'all' });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearch = () => {
    fetchCompanies();
  };

  const handleCreateCompany = () => {
    navigate('/modules/companies/create');
  };

  const handleViewCompany = (company: Company) => {
    console.log('View company:', company);
    // Implementation for viewing company details
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="space-y-6">
      <CompaniesToolbar 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearch={handleSearch}
        onCreateCompany={handleCreateCompany}
        onRefresh={fetchCompanies}
        onToggleFilters={handleToggleFilters}
        showFilters={showFilters}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {showFilters && (
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-4">
                <CompaniesFilters 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onResetFilters={handleResetFilters}
                />
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
          <CompaniesTable 
            companies={companies} 
            loading={loading} 
            onView={handleViewCompany}
          />
        </div>
      </div>
    </div>
  );
};

export default CompaniesList;
