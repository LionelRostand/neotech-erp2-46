
import { Employee } from '@/types/employee';
import { EmployeePhotoMeta } from '@/types/employee';

/**
 * Récupère l'URL de la photo d'un employé
 * Tente de récupérer l'URL à partir de différentes sources disponibles
 */
export const getPhotoUrl = (photoMeta?: EmployeePhotoMeta | null): string => {
  if (!photoMeta) return '';
  
  // Si on a des données directement dans photoMeta.data
  if (photoMeta.data) {
    return photoMeta.data;
  }
  
  return '';
};

/**
 * Analyse et crée un objet EmployeePhotoMeta à partir d'une URL de photo
 */
export const parsePhotoMetaFromUrl = (photoUrl: string): EmployeePhotoMeta | undefined => {
  if (!photoUrl) return undefined;
  
  return {
    data: photoUrl,
    fileName: 'profile-photo.jpg',
    fileType: 'image/jpeg',
    fileSize: 0,
    updatedAt: new Date().toISOString()
  };
};
