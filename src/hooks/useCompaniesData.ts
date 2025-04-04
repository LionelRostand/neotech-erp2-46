import { useEffect, useState, useMemo } from 'react';
import { getCompanies } from '@/components/module/submodules/companies/services/companyService';
import { Company } from '@/components/module/submodules/companies/types';
import { useHrModuleData } from './useHrModuleData';

export const useCompaniesData = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { employees } = useHrModuleData();

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch companies'));
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Update company objects with proper fields
  export const processCompanyData = (company: any): Company => {
    return {
      id: company.id || '',
      name: company.name || '',
      address: company.address || {
        street: '',
        city: '',
        postalCode: '',
        country: ''
      },
      siret: company.siret || '',
      logo: company.logo || company.logoUrl || '',
      logoUrl: company.logoUrl || company.logo || '',
      city: company.city || company.address?.city || '',
      country: company.country || company.address?.country || '',
      phone: company.phone || '',
      email: company.email || '',
      website: company.website || '',
      industry: company.industry || '',
      size: company.size || '',
      status: company.status || 'active',
      registrationNumber: company.registrationNumber || company.siret || '',
      contactName: company.contactName || '',
      contactEmail: company.contactEmail || '',
      employeesCount: company.employeesCount || 0,
      createdAt: company.createdAt || new Date().toISOString(),
      updatedAt: company.updatedAt || new Date().toISOString()
    };
  };

  // Get company metrics
  const companyMetrics = useMemo(() => {
    // Count employees per company
    const employeesPerCompany = employees.reduce((acc, employee) => {
      const companyId = typeof employee.company === 'string' 
        ? employee.company 
        : employee.company?.id || '';
      
      if (companyId) {
        acc[companyId] = (acc[companyId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return companies.map(company => {
      const employeeCount = employeesPerCompany[company.id] || 0;
      return {
        id: company.id,
        name: company.name,
        logoUrl: company.logo || company.logoUrl,
        city: company.address?.city || company.city,
        country: company.address?.country || company.country,
        phone: company.phone,
        email: company.email,
        website: company.website,
        industry: company.industry,
        size: company.size,
        status: company.status,
        employeesCount: company.employeesCount || employeeCount,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      };
    });
  }, [companies, employees]);

  return {
    companies,
    companyMetrics,
    loading,
    error,
    refresh: async () => {
      setLoading(true);
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to refresh companies'));
        console.error('Error refreshing companies:', err);
      } finally {
        setLoading(false);
      }
    }
  };
};
