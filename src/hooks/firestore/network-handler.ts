
import { FirebaseError } from 'firebase/app';
import { checkFirestoreConnection } from '@/lib/firebase';
import { toast } from 'sonner';

// Nombre de tentatives maximum pour les opérations réseau
const MAX_RETRIES = 3;
// Délai entre les tentatives (en ms)
const RETRY_DELAY = 1000;

/**
 * Vérifie si une erreur est liée à la connectivité réseau
 */
export const isNetworkError = (error: any): boolean => {
  if (error instanceof FirebaseError) {
    // Codes d'erreur Firebase liés à la connectivité réseau
    const networkErrorCodes = [
      'unavailable',
      'network-request-failed',
      'deadline-exceeded'
    ];
    return networkErrorCodes.includes(error.code);
  }
  
  // Pour les autres types d'erreurs, vérifier le message
  const errorMessage = String(error.message || error).toLowerCase();
  return errorMessage.includes('network') || 
         errorMessage.includes('connection') || 
         errorMessage.includes('offline') ||
         errorMessage.includes('internet') ||
         errorMessage.includes('timeout');
};

/**
 * Vérifie si une erreur est liée aux permissions
 */
export const isPermissionError = (error: any): boolean => {
  if (error instanceof FirebaseError) {
    return error.code === 'permission-denied';
  }
  
  // Pour les autres types d'erreurs, vérifier le message
  const errorMessage = String(error.message || error).toLowerCase();
  return errorMessage.includes('permission') || 
         errorMessage.includes('not allowed') || 
         errorMessage.includes('insufficient');
};

/**
 * Essaie de reconnecter à Firestore
 * @returns Promesse résolue avec true si la connexion est rétablie, false sinon
 */
export const reconnectToFirestore = async (): Promise<boolean> => {
  console.log('Tentative de reconnexion à Firestore...');
  try {
    const isConnected = await checkFirestoreConnection();
    console.log('Résultat de la tentative de reconnexion:', isConnected ? 'Succès' : 'Échec');
    return isConnected;
  } catch (error) {
    console.error('Erreur lors de la tentative de reconnexion:', error);
    return false;
  }
};

/**
 * Exécute une fonction avec retentatives en cas d'erreur réseau
 * @param operation Fonction à exécuter
 * @param maxRetries Nombre maximum de tentatives
 * @param delayMs Délai entre les tentatives en ms
 * @returns Résultat de l'opération
 */
export const executeWithNetworkRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delayMs: number = RETRY_DELAY
): Promise<T> => {
  let lastError: any;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      retryCount++;
      
      console.error(`Erreur lors de la tentative ${retryCount}/${maxRetries}:`, error);
      
      if (isPermissionError(error)) {
        console.warn('Erreur de permission détectée, abandonnement des tentatives');
        throw error; // Ne pas réessayer pour les erreurs de permission
      }
      
      if (!isNetworkError(error) || retryCount >= maxRetries) {
        console.warn('Erreur non liée au réseau ou nombre maximum de tentatives atteint, abandonnement');
        throw error;
      }
      
      console.log(`Attente de ${delayMs}ms avant la prochaine tentative...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  // On ne devrait jamais arriver ici car soit l'opération réussit soit on throw une erreur
  throw lastError;
};
