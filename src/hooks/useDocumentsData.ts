
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';

/**
 * Hook pour accéder aux documents RH
 */
export const useDocumentsData = () => {
  const { hrDocuments, employees, isLoading, error } = useHrModuleData();
  
  // Enrichir les documents avec les noms des employés concernés
  const formattedDocuments = useMemo(() => {
    if (!hrDocuments || hrDocuments.length === 0) return [];
    
    return hrDocuments.map(document => {
      let employeeName = '';
      let employeePhoto = '';
      
      // Si le document est lié à un employé spécifique
      if (document.employeeId && employees) {
        const employee = employees.find(emp => emp.id === document.employeeId);
        if (employee) {
          employeeName = `${employee.firstName} ${employee.lastName}`;
          employeePhoto = employee.photoURL || employee.photo || '';
        }
      }
      
      return {
        ...document,
        employeeName,
        employeePhoto,
        // Formater la date pour l'affichage
        formattedDate: formatDate(document.uploadDate || document.date),
      };
    });
  }, [hrDocuments, employees]);
  
  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  return {
    documents: formattedDocuments,
    isLoading,
    error
  };
};
