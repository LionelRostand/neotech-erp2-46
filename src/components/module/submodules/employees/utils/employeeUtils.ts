
import { Employee } from '@/types/employee';

/**
 * Vérifie si l'employé est un manager en fonction de son poste
 */
export const isEmployeeManager = (position?: string): boolean => {
  if (!position) return false;
  
  const managerKeywords = [
    'manager', 'directeur', 'directrice', 'chef', 'responsable', 'superviseur', 
    'leader', 'gérant', 'coordinateur'
  ];
  
  const positionLower = position.toLowerCase();
  return managerKeywords.some(keyword => positionLower.includes(keyword));
};

/**
 * Obtient le nom complet d'un employé
 */
export const getEmployeeFullName = (employee: Employee | null | undefined): string => {
  if (!employee) return '';
  return `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Employé sans nom';
};

/**
 * Filtre les employés par terme de recherche
 */
export const filterEmployeesBySearchTerm = (employees: Employee[], searchTerm: string): Employee[] => {
  if (!searchTerm) return employees;
  
  const searchLower = searchTerm.toLowerCase();
  
  return employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      (employee.email && employee.email.toLowerCase().includes(searchLower)) ||
      (employee.position && employee.position.toLowerCase().includes(searchLower)) ||
      (employee.department && employee.department.toLowerCase().includes(searchLower))
    );
  });
};

/**
 * Trie les employés par un champ spécifique
 */
export const sortEmployees = (employees: Employee[], sortField: keyof Employee, sortDirection: 'asc' | 'desc'): Employee[] => {
  return [...employees].sort((a, b) => {
    const valueA = a[sortField] || '';
    const valueB = b[sortField] || '';
    
    const comparison = String(valueA).localeCompare(String(valueB));
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};
