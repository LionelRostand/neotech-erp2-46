
import { EmployeePhotoMeta } from '@/types/employee';

/**
 * Génère une URL pour l'affichage de la photo d'un employé
 * @param photoMeta Métadonnées de la photo
 * @returns URL de la photo ou undefined
 */
export const getPhotoUrl = (photoMeta?: EmployeePhotoMeta): string | undefined => {
  if (!photoMeta) return undefined;
  if (!photoMeta.data) return undefined;
  
  // Si la donnée est une URL, la retourner directement
  if (photoMeta.data.startsWith('http')) return photoMeta.data;
  
  // Sinon, considérer que c'est une donnée Base64
  return photoMeta.data;
};

/**
 * Convertit une photo en métadonnées
 * @param photoData Données de la photo (URL ou Base64)
 * @returns Métadonnées de la photo
 */
export const createPhotoMeta = (photoData?: string): EmployeePhotoMeta | undefined => {
  if (!photoData) return undefined;
  
  return {
    fileName: `photo_${Date.now()}.jpg`,
    fileType: 'image/jpeg',
    fileSize: estimatePhotoSize(photoData),
    updatedAt: new Date().toISOString(),
    data: photoData
  };
};

/**
 * Estime la taille d'une photo en octets
 * @param photoData Données de la photo
 * @returns Taille estimée en octets
 */
const estimatePhotoSize = (photoData: string): number => {
  if (!photoData) return 0;
  
  // Si c'est une URL, retourner une taille par défaut
  if (photoData.startsWith('http')) return 100000; // ~100KB
  
  // Pour une donnée Base64, calculer approximativement
  const base64Length = photoData.length;
  const paddingCount = (photoData.match(/=/g) || []).length;
  const dataSize = Math.floor((base64Length * 3) / 4) - paddingCount;
  
  return dataSize;
};
