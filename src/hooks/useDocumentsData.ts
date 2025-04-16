
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { formatDate } from '@/lib/formatters';

export interface HrDocument {
  id: string;
  title: string;
  type: string;
  uploadDate: string;
  fileSize?: string | number;
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
      
      // Safely parse and format the date
      let formattedUploadDate = '';
      
      try {
        // Determine which date to use (prioritize uploadDate)
        let dateToUse = document.uploadDate || document.createdAt || document.date;
        
        // Convert Firestore Timestamp objects
        if (dateToUse && typeof dateToUse === 'object' && 'seconds' in dateToUse) {
          const seconds = dateToUse.seconds;
          if (typeof seconds === 'number') {
            const date = new Date(seconds * 1000);
            if (!isNaN(date.getTime())) {
              formattedUploadDate = formatDate(date.toISOString());
            }
          }
        } else if (dateToUse && typeof dateToUse === 'string') {
          formattedUploadDate = formatDate(dateToUse) || dateToUse;
        }
        
        // Fallback if we couldn't format the date
        if (!formattedUploadDate) {
          formattedUploadDate = 'Date non disponible';
        }
      } catch (e) {
        console.warn('Erreur lors du formatage de date:', e);
        formattedUploadDate = 'Date non disponible';
      }
      
      // Safely convert fileSize to string if it's a number
      let fileSizeStr = document.fileSize;
      if (typeof document.fileSize === 'number') {
        fileSizeStr = document.fileSize.toString();
      }
      
      return {
        id: document.id,
        title: document.title || document.filename || document.name || 'Document sans titre',
        type: document.type || 'Autre',
        uploadDate: formattedUploadDate,
        fileSize: fileSizeStr,
        fileType: document.fileType,
        url: document.url,
        employeeId: document.employeeId,
        employeeName,
        employeePhoto,
        department,
        description: document.description,
        filename: document.filename,
        name: document.name,
        // Store original dates as strings for other components
        createdAt: typeof document.createdAt === 'string' ? document.createdAt : undefined,
        date: typeof document.date === 'string' ? document.date : undefined
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
