
import { EmployeePhotoMeta } from '@/types/employee';

/**
 * Crée des métadonnées pour une photo d'employé à partir d'une URL de données
 */
export const createPhotoMeta = (photoDataUrl: string): EmployeePhotoMeta => {
  // Extraction du type de fichier de l'URL de données
  const mimeType = photoDataUrl.split(';')[0].split(':')[1] || 'image/jpeg';
  
  // Calcul approximatif de la taille du fichier (length * 0.75)
  // car les URLs data sont encodées en base64, qui augmente la taille d'environ 33%
  const base64Data = photoDataUrl.split(',')[1] || '';
  const fileSize = Math.round(base64Data.length * 0.75);
  
  return {
    fileName: `photo_${Date.now()}.${mimeType.split('/')[1]}`,
    fileType: mimeType,
    fileSize: fileSize,
    updatedAt: new Date().toISOString(),
    data: photoDataUrl
  };
};

/**
 * Récupère l'URL de la photo à partir des métadonnées
 */
export const getPhotoUrl = (photoMeta?: EmployeePhotoMeta): string => {
  if (!photoMeta) return '';
  return photoMeta.data || '';
};
