
// Add this file if it doesn't exist
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'Date inconnue';
  
  try {
    // If it's already a Date object
    if (date instanceof Date) {
      return isValid(date) ? format(date, 'dd/MM/yyyy', { locale: fr }) : 'Date invalide';
    }
    
    // If it's a string, try to parse it
    const parsedDate = new Date(date);
    return isValid(parsedDate) ? format(parsedDate, 'dd/MM/yyyy', { locale: fr }) : 'Date invalide';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date invalide';
  }
};

export const getFileTypeFromName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const extensionMap: Record<string, string> = {
    pdf: 'PDF',
    doc: 'Document Word',
    docx: 'Document Word',
    xls: 'Feuille Excel',
    xlsx: 'Feuille Excel',
    jpg: 'Image',
    jpeg: 'Image',
    png: 'Image',
    txt: 'Texte',
  };
  
  return extensionMap[extension] || 'Fichier';
};
