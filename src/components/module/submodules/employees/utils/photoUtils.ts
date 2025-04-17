
import { EmployeePhotoMeta } from '@/types/employee';

/**
 * Extrait l'URL de la photo à partir des métadonnées
 * @param photoMeta Métadonnées de la photo
 * @returns URL de la photo ou chaîne vide
 */
export const getPhotoUrl = (photoMeta?: EmployeePhotoMeta | string | null): string => {
  if (!photoMeta) return '';
  
  // Si photoMeta est un objet avec une propriété 'data'
  if (typeof photoMeta === 'object' && photoMeta !== null && 'data' in photoMeta) {
    return photoMeta.data || '';
  }
  
  // Si photoMeta est directement une chaîne
  if (typeof photoMeta === 'string') {
    return photoMeta;
  }
  
  return '';
};

/**
 * Crée un objet de métadonnées de photo à partir d'un fichier
 * @param file Fichier image
 * @param base64Data Données de l'image en base64
 * @returns Objet de métadonnées de photo
 */
export const createPhotoMetadata = async (
  file: File, 
  base64Data: string
): Promise<EmployeePhotoMeta> => {
  return {
    data: base64Data,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Détermine si une chaîne est une URL d'image valide
 * @param url URL potentielle
 * @returns Vrai si l'URL semble être celle d'une image
 */
export const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Vérifier s'il s'agit d'une URL base64 d'image
  if (url.startsWith('data:image/')) {
    return true;
  }
  
  // Vérifier s'il s'agit d'une URL HTTP(S) se terminant par une extension d'image courante
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const lowercaseUrl = url.toLowerCase();
  
  return (
    (lowercaseUrl.startsWith('http://') || lowercaseUrl.startsWith('https://')) &&
    imageExtensions.some(ext => lowercaseUrl.endsWith(ext))
  );
};
