
import { useMemo } from 'react';
import { useHrModuleData } from './useHrModuleData';
import { formatDate } from '@/lib/formatters';

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
      
      // Utiliser la première date valide disponible
      const dateStr = document.uploadDate || document.createdAt || document.date || '';
      let formattedUploadDate = '';
      
      try {
        if (dateStr) {
          formattedUploadDate = formatDate(dateStr);
          if (!formattedUploadDate) {
            formattedUploadDate = dateStr; // Use original string if formatting fails
          }
        }
      } catch (e) {
        console.warn('Erreur lors du formatage de date:', dateStr);
        formattedUploadDate = 'Date non valide';
      }
      
      return {
        id: document.id,
        title: document.title || document.filename || document.name || 'Document sans titre',
        type: document.type || 'Autre',
        uploadDate: formattedUploadDate,
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
