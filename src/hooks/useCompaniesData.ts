
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  size?: string;
  status: 'Actif' | 'Inactif';
  employeesCount?: number;
  createdDate?: string;
}

/**
 * Hook pour accéder aux données des entreprises directement depuis Firebase
 */
export const useCompaniesData = () => {
  const { companies, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les entreprises avec des informations supplémentaires
  const formattedCompanies = useMemo(() => {
    if (!companies || companies.length === 0) {
      return [];
    }
    
    return companies.map(company => {
      // Calculer le nombre d'employés pour cette entreprise
      const companyEmployeesCount = employees 
        ? employees.filter(emp => emp.company === company.id || emp.company === company.name).length
        : 0;
      
      return {
        id: company.id,
        name: company.name || 'Entreprise sans nom',
        logo: company.logo || company.logoUrl,
        address: company.address,
        city: company.city,
        country: company.country,
        phone: company.phone,
        email: company.email,
        website: company.website,
        industry: company.industry,
        size: company.size,
        status: company.status || 'Actif',
        employeesCount: companyEmployeesCount || company.employeesCount || 0,
        createdDate: company.createdDate ? formatDate(company.createdDate) : undefined,
      } as Company;
    });
  }, [companies, employees]);
  
  // Fonction pour formater les dates
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur de formatage de date:', dateStr, error);
      return dateStr;
    }
  };

  // Obtenir des statistiques sur les entreprises
  const companiesStats = useMemo(() => {
    const active = formattedCompanies.filter(company => company.status === 'Actif').length;
    const inactive = formattedCompanies.filter(company => company.status === 'Inactif').length;
    const total = formattedCompanies.length;
    
    // Calculer le nombre total d'employés
    const totalEmployees = formattedCompanies.reduce(
      (sum, company) => sum + (company.employeesCount || 0), 
      0
    );
    
    return { active, inactive, total, totalEmployees };
  }, [formattedCompanies]);
  
  return {
    companies: formattedCompanies,
    stats: companiesStats,
    isLoading,
    error
  };
};
