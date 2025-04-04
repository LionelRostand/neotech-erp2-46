
import { useEffect, useState } from 'react';
import { useHrData } from './modules/useHrData';
import { Company } from '@/components/module/submodules/companies/types';
import { Employee } from '@/types/employee';

/**
 * Hook to fetch and process HR module data
 */
export const useHrModuleData = () => {
  const { employees: rawEmployees, payslips, contracts, departments, isLoading, error } = useHrData();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Process employees data
  useEffect(() => {
    if (rawEmployees) {
      const processedEmployees = rawEmployees.map(emp => ({
        id: emp.id,
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        email: emp.email || '',
        phone: emp.phone || '',
        position: emp.position || emp.role || 'Employé',
        department: emp.department || 'Non spécifié',
        photo: emp.photoURL || emp.photo || '',
        hireDate: emp.hireDate || emp.startDate || new Date().toISOString(),
        status: emp.status || 'active',
        address: emp.address || {},
        contract: emp.contract || '',
        socialSecurityNumber: emp.socialSecurityNumber || '1 99 99 99 999 999 99',
        birthDate: emp.birthDate || '',
        documents: emp.documents || [],
      })) as Employee[];
      
      setEmployees(processedEmployees);
    }
  }, [rawEmployees]);

  // Extract companies from employees if available
  useEffect(() => {
    if (employees && employees.length > 0) {
      // Create a map to ensure unique companies
      const companiesMap = new Map<string, Company>();
      
      employees.forEach(emp => {
        if (emp.company) {
          const companyId = typeof emp.company === 'string' ? emp.company : emp.company.id;
          
          if (!companiesMap.has(companyId)) {
            if (typeof emp.company === 'string') {
              // Only has the id, create a basic company object
              companiesMap.set(companyId, {
                id: companyId,
                name: 'Entreprise',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            } else {
              // Has the full company object
              companiesMap.set(companyId, emp.company as Company);
            }
          }
        }
      });
      
      // Convert map to array
      setCompanies(Array.from(companiesMap.values()));
    }
  }, [employees]);

  return {
    employees,
    payslips,
    contracts,
    departments,
    companies,
    isLoading,
    error
  };
};
