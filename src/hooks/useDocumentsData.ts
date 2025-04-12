
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { formatDate as formatDateUtil } from '@/lib/formatters';

export interface HrDocument {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  fileSize?: string;
  fileType?: string;
  url?: string;
  employeeId?: string;
  employeeName?: string;
  employeePhoto?: string;
  department?: string;
  description?: string;
  filename?: string; // Added to support alternative title
  name?: string;     // Added to support alternative title
  createdAt?: string; // Added to support alternative date
  date?: string;      // Added to support alternative date
}

/**
 * Hook pour accéder aux documents RH directement depuis Firebase
 */
export const useDocumentsData = () => {
  const { hrDocuments, employees, isLoading, error } = useHrModuleData();
  
  // Fonction pour formater la date de manière sécurisée
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    
    try {
      // Validate date string before formatting
      const timestamp = Date.parse(dateString);
      if (isNaN(timestamp)) {
        console.warn('Invalid document date:', dateString);
        return '';
      }
      
      return formatDateUtil(dateString);
    } catch (error) {
      console.error('Error formatting document date:', error);
      return '';
    }
  };
  
  // Enrichir les documents avec les noms des employés si nécessaire
  const formattedDocuments = useMemo(() => {
    if (!hrDocuments || hrDocuments.length === 0) return [];
    
    return hrDocuments.map(document => {
      // Si le document est associé à un employé, trouver son nom
      let employeeName = undefined;
      let employeePhoto = undefined;
      let department = undefined;
      
      if (document.employeeId && employees) {
        const employee = employees.find(emp => emp.id === document.employeeId);
        if (employee) {
          employeeName = `${employee.firstName} ${employee.lastName}`;
          employeePhoto = employee.photoURL || employee.photo;
          department = employee.department;
        }
      }
      
      // Determine which date field to use and handle any invalid dates
      let dateToFormat = document.uploadDate || document.createdAt || document.date || '';
      // Try to ensure the date is valid
      if (dateToFormat && isNaN(Date.parse(dateToFormat))) {
        console.warn(`Invalid date detected: ${dateToFormat}, using current date instead`);
        dateToFormat = new Date().toISOString();
      }
      
      const formattedDate = formatDate(dateToFormat);
      
      return {
        id: document.id,
        title: document.title || document.filename || document.name || 'Document sans titre',
        type: document.type || 'Autre',
        uploadDate: formattedDate,
        fileSize: document.fileSize,
        fileType: document.fileType,
        url: document.url,
        employeeId: document.employeeId,
        employeeName,
        employeePhoto,
        department,
        description: document.description,
        filename: document.filename,
        name: document.name,
        createdAt: document.createdAt,
        date: document.date
      } as HrDocument;
    });
  }, [hrDocuments, employees]);

  // Obtenir des statistiques sur les documents
  const documentStats = useMemo(() => {
    // Grouper par type de document
    const typeCount = formattedDocuments.reduce((acc, doc) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: formattedDocuments.length,
      byType: typeCount
    };
  }, [formattedDocuments]);
  
  return {
    documents: formattedDocuments,
    stats: documentStats,
    isLoading,
    error
  };
};
