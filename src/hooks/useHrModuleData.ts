
import { useEffect, useState } from 'react';
import { useHrData } from './modules/useHrData';
import { Company } from '@/components/module/submodules/companies/types';
import { Employee } from '@/types/employee';

/**
 * Hook to fetch and process HR module data
 */
export const useHrModuleData = () => {
  const { 
    employees: rawEmployees = [], 
    payslips = [], 
    contracts = [], 
    departments = [], 
    leaveRequests = [], 
    attendance = [],
    absenceRequests = [],
    hrDocuments = [],
    timeSheets = [],
    evaluations = [],
    trainings = [],
    hrReports = [],
    hrAlerts = [],
    isLoading = true, 
    error = null 
  } = useHrData() || {};
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Process employees data
  useEffect(() => {
    if (rawEmployees && Array.isArray(rawEmployees)) {
      const processedEmployees = rawEmployees
        .filter(emp => emp !== null && emp !== undefined)
        .map(emp => ({
          id: emp.id || `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          email: emp.email || '',
          phone: emp.phone || '',
          position: emp.position || emp.role || 'Employé',
          department: emp.department || 'Non spécifié',
          departmentId: emp.departmentId || emp.department || '',
          photo: emp.photoURL || emp.photo || '',
          photoURL: emp.photoURL || emp.photo || '',
          hireDate: emp.hireDate || emp.startDate || new Date().toISOString(),
          startDate: emp.startDate || emp.hireDate || new Date().toISOString(),
          status: (emp.status === 'Actif' ? 'active' : emp.status) || 'active',
          address: emp.address || {},
          contract: emp.contract || '',
          socialSecurityNumber: emp.socialSecurityNumber || '1 99 99 99 999 999 99',
          birthDate: emp.birthDate || '',
          documents: emp.documents || [],
          company: emp.company || '',
          role: emp.role || emp.position || '',
          title: emp.title || emp.position || '',
          manager: emp.manager || '',
          managerId: emp.managerId || '',
          professionalEmail: emp.professionalEmail || emp.email || '',
          skills: emp.skills || [],
          education: emp.education || [],
          workSchedule: emp.workSchedule || {
            monday: '09:00 - 18:00',
            tuesday: '09:00 - 18:00',
            wednesday: '09:00 - 18:00',
            thursday: '09:00 - 18:00',
            friday: '09:00 - 17:00',
          },
          payslips: emp.payslips || [],
        })) as Employee[];
      
      setEmployees(processedEmployees);
    } else {
      setEmployees([]);
    }
  }, [rawEmployees]);

  // Extract companies from employees if available
  useEffect(() => {
    if (employees && Array.isArray(employees) && employees.length > 0) {
      // Create a map to ensure unique companies
      const companiesMap = new Map<string, Company>();
      
      employees.forEach(emp => {
        if (emp && emp.company) {
          const companyId = typeof emp.company === 'string' ? emp.company : (emp.company?.id || '');
          
          if (companyId && !companiesMap.has(companyId)) {
            if (typeof emp.company === 'string') {
              // Only has the id, create a basic company object
              companiesMap.set(companyId, {
                id: companyId,
                name: 'Neotech Consulting',  // Default company name
                address: {
                  street: '',
                  city: '',
                  postalCode: '',
                  country: ''
                },
                siret: '',
                logo: '',
                logoUrl: '',
                phone: '',
                email: '',
                website: '',
                industry: '',
                size: '',
                status: 'active',
                employeesCount: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            } else if (emp.company && typeof emp.company === 'object') {
              // Has the full company object
              const company = emp.company as Company;
              
              // Add missing properties if needed
              companiesMap.set(companyId, {
                ...company,
                id: companyId,
                name: company.name || 'Neotech Consulting',  // Default company name
                address: company.address || {
                  street: '',
                  city: '',
                  postalCode: '',
                  country: ''
                },
                logo: company.logo || '',
                logoUrl: company.logoUrl || '',
                phone: company.phone || '',
                email: company.email || '',
                website: company.website || '',
                industry: company.industry || '',
                size: company.size || '',
                status: company.status || 'active',
                employeesCount: company.employeesCount || 0,
                createdAt: company.createdAt || new Date().toISOString(),
                updatedAt: company.updatedAt || new Date().toISOString()
              });
            }
          }
        }
      });
      
      // Convert map to array
      setCompanies(Array.from(companiesMap.values()));
    } else {
      // If no employees with companies, create at least one default company
      setCompanies([{
        id: 'default-company',
        name: 'Neotech Consulting',
        address: {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        },
        siret: '',
        logo: '',
        logoUrl: '',
        phone: '',
        email: '',
        website: '',
        industry: '',
        size: '',
        status: 'active',
        employeesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
  }, [employees]);

  return {
    employees,
    companies,
    payslips,
    contracts,
    departments,
    leaveRequests: leaveRequests || [],
    attendance: attendance || [],
    absenceRequests: absenceRequests || [],
    hrDocuments: hrDocuments || [],
    timeSheets: timeSheets || [],
    evaluations: evaluations || [],
    trainings: trainings || [],
    hrReports: hrReports || [],
    hrAlerts: hrAlerts || [],
    isLoading,
    error
  };
};
