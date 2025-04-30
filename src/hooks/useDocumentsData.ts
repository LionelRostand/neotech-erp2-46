
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
  // Contract specific fields
  status?: string;
  startDate?: string;
  endDate?: string;
  position?: string;
  salary?: number;
  contractId?: string;
  contractType?: string;
}

/**
 * Hook pour accéder aux documents RH directement depuis Firebase
 */
export const useDocumentsData = () => {
  const { hrDocuments, employees, contracts, isLoading, error } = useHrModuleData();
  
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
      
      // Formatter la date avec sécurité (gérer les objets Timestamp de Firestore)
      let formattedUploadDate = '';
      
      try {
        // Vérifier si uploadDate est un objet Timestamp (avec seconds et nanoseconds)
        if (document.uploadDate && typeof document.uploadDate === 'object' && 'seconds' in document.uploadDate) {
          // Convertir le Timestamp Firestore en chaîne de date
          const timestamp = document.uploadDate;
          const date = new Date(timestamp.seconds * 1000);
          formattedUploadDate = formatDate(date);
        } else if (document.createdAt && typeof document.createdAt === 'object' && 'seconds' in document.createdAt) {
          // Même traitement pour createdAt si c'est un Timestamp
          const timestamp = document.createdAt;
          const date = new Date(timestamp.seconds * 1000);
          formattedUploadDate = formatDate(date);
        } else if (document.date && typeof document.date === 'object' && 'seconds' in document.date) {
          // Même traitement pour date si c'est un Timestamp
          const timestamp = document.date;
          const date = new Date(timestamp.seconds * 1000);
          formattedUploadDate = formatDate(date);
        } else {
          // Utiliser la première date valide disponible en string
          const dateStr = document.uploadDate || document.createdAt || document.date || '';
          if (dateStr && typeof dateStr === 'string') {
            formattedUploadDate = formatDate(dateStr);
            if (!formattedUploadDate) {
              formattedUploadDate = dateStr; // Use original string if formatting fails
            }
          }
        }
      } catch (e) {
        console.warn('Erreur lors du formatage de date:', e);
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
        // Store original dates as strings for other components
        createdAt: typeof document.createdAt === 'string' ? document.createdAt : 
                 (document.createdAt && typeof document.createdAt === 'object' && 'seconds' in document.createdAt) ?
                 new Date(document.createdAt.seconds * 1000).toISOString() : undefined,
        date: typeof document.date === 'string' ? document.date :
             (document.date && typeof document.date === 'object' && 'seconds' in document.date) ?
             new Date(document.date.seconds * 1000).toISOString() : undefined
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
      
      // Add contract type if not exists
      if (contracts && contracts.length > 0 && !typeCount['Contrat']) {
        typeCount['Contrat'] = contracts.length;
      } else if (contracts && contracts.length > 0) {
        typeCount['Contrat'] += contracts.length;
      }
      
      return {
        total: formattedDocuments.length + (contracts?.length || 0),
        byType: typeCount
      };
    } catch (error) {
      console.error('Error calculating document stats:', error);
      return {
        total: formattedDocuments.length,
        byType: {}
      };
    }
  }, [formattedDocuments, contracts]);
  
  return {
    documents: formattedDocuments,
    stats: documentStats,
    isLoading,
    error
  };
};
