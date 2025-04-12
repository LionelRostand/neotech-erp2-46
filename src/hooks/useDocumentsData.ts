
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
  
  // Fonction pour valider que la date existe et est valide
  const isValidDate = (dateString?: string): boolean => {
    if (!dateString) return false;
    
    // Handle problematic string values
    if (dateString === 'Invalid Date' || dateString === 'NaN' || dateString === 'undefined') {
      return false;
    }
    
    try {
      // Special case for timestamps stored as numbers
      if (typeof dateString === 'number' || /^\d+$/.test(dateString)) {
        const timestamp = typeof dateString === 'number' ? dateString : parseInt(dateString, 10);
        const date = new Date(timestamp);
        return !isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= 2100;
      }
      
      // Regular date string validation
      const timestamp = Date.parse(dateString);
      if (isNaN(timestamp)) return false;
      
      const date = new Date(timestamp);
      return !isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= 2100;
    } catch (e) {
      console.warn('Date validation error:', e, 'for date:', dateString);
      return false;
    }
  };
  
  // Fonction pour formater la date de manière sécurisée avec fallback
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    
    try {
      // Validate date string before formatting
      if (!isValidDate(dateString)) {
        console.warn('Invalid document date:', dateString);
        return 'Date non valide';
      }
      
      const formattedDate = formatDateUtil(dateString);
      return formattedDate || 'Date non valide';
    } catch (error) {
      console.error('Error formatting document date:', error);
      return 'Date non valide';
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
      
      // Use current date as fallback if invalid
      if (!isValidDate(dateToFormat)) {
        console.warn(`Invalid date detected: ${dateToFormat}, using current date instead`);
        dateToFormat = new Date().toISOString();
      }
      
      // Format the date (now using a valid date string)
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
    try {
      // Grouper par type de document
      const typeCount = formattedDocuments.reduce((acc, doc) => {
        const type = doc.type || 'Autre';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        total: formattedDocuments.length,
        byType: typeCount
      };
    } catch (error) {
      console.error('Error calculating document stats:', error);
      return {
        total: formattedDocuments.length,
        byType: {}
      };
    }
  }, [formattedDocuments]);
  
  return {
    documents: formattedDocuments,
    stats: documentStats,
    isLoading,
    error
  };
};
