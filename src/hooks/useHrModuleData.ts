import { useEffect, useState, useCallback } from 'react';
import { useHrData } from './modules/useHrData';
import { Company } from '@/components/module/submodules/companies/types';
import { Employee } from '@/types/employee';

/**
 * Hook to fetch and process HR module data
 */
export const useHrModuleData = () => {
  const { 
    employees: rawEmployees, 
    payslips, 
    contracts, 
    departments, 
    leaveRequests, 
    attendance,
    absenceRequests,
    hrDocuments,
    timeSheets,
    evaluations,
    trainings,
    hrReports,
    hrAlerts,
    isLoading, 
    error,
    refetchEmployees: refetchRawEmployees 
  } = useHrData();
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  // Process employees data
  useEffect(() => {
    if (rawEmployees) {
      // Log the raw data for debugging
      console.log(`Raw employees data length: ${rawEmployees.length}`);
      
      // Make a copy of raw data to avoid modifying original
      const employeesData = [...rawEmployees];
      
      // Ensure we don't have empty entries
      const filteredEmployees = employeesData.filter(emp => emp && emp.id);
      
      // Log filtered data for debugging
      console.log(`After filtering empty entries: ${filteredEmployees.length}`);
      
      // Process each employee to ensure required fields exist
      const processedEmployees = filteredEmployees.map(emp => {
        return {
          id: emp.id,
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
          isManager: emp.isManager || determineIfManager(emp.position || emp.role),
          workSchedule: emp.workSchedule || {
            monday: '09:00 - 18:00',
            tuesday: '09:00 - 18:00',
            wednesday: '09:00 - 18:00',
            thursday: '09:00 - 18:00',
            friday: '09:00 - 17:00',
          },
          payslips: emp.payslips || [],
          // Add photoMeta with required properties if it exists
          photoMeta: emp.photoMeta ? {
            fileName: emp.photoMeta.fileName || `photo_${Date.now()}.jpg`,
            fileType: emp.photoMeta.fileType || 'image/jpeg',
            fileSize: emp.photoMeta.fileSize || 100000,
            updatedAt: emp.photoMeta.updatedAt || new Date().toISOString()
          } : undefined
        } as Employee;
      });
      
      // Check for Lionel in the processed data
      const lionelPresent = processedEmployees.some(emp => 
        emp.firstName?.toLowerCase().includes('lionel') && 
        emp.lastName?.toLowerCase().includes('djossa')
      );
      
      console.log(`useHrModuleData: ${processedEmployees.length} employés uniques (avant: ${rawEmployees.length})`);
      console.log(`useHrModuleData: LIONEL DJOSSA présent dans les données après traitement? ${lionelPresent}`);
      
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
            } else {
              // Has the full company object
              const company = emp.company as Company;
              
              // Add missing properties if needed
              if (!company.address) {
                company.address = {
                  street: '',
                  city: '',
                  postalCode: '',
                  country: ''
                };
              }
              
              companiesMap.set(companyId, {
                ...company,
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
    }
  }, [employees]);

  // Fonction pour déterminer si un employé est un manager d'après son poste
  const determineIfManager = (position: string | undefined): boolean => {
    if (!position) return false;
    
    const lowerPosition = position.toLowerCase();
    return lowerPosition.includes('manager') || 
           lowerPosition.includes('responsable') || 
           lowerPosition.includes('directeur') || 
           lowerPosition.includes('pdg') ||
           lowerPosition.includes('ceo') || 
           lowerPosition.includes('chief');
  };
  
  // Add refetchEmployees function that will call the refetchRawEmployees from useHrData
  const refetchEmployees = useCallback(async () => {
    if (refetchRawEmployees && typeof refetchRawEmployees === 'function') {
      await refetchRawEmployees();
    }
  }, [refetchRawEmployees]);

  return {
    employees,
    payslips,
    contracts,
    departments,
    companies,
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
    error,
    refetchEmployees
  };
};
