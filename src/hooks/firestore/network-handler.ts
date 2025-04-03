
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Délai maximal pour les opérations réseau (20 secondes)
const MAX_TIMEOUT = 20000;

// Nombre maximal de tentatives
const MAX_RETRIES = 3;

/**
 * Vérifie si une erreur est liée à un problème de réseau
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  // Vérification des types d'erreurs Firebase courants liés au réseau
  const errorCode = error.code || '';
  const errorMessage = error.message || '';
  
  return (
    errorCode.includes('unavailable') ||
    errorCode.includes('network-request-failed') ||
    errorCode.includes('deadline-exceeded') ||
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('unavailable') ||
    errorMessage.includes('failed to fetch') ||
    error.name === 'NetworkError' ||
    error.name === 'AbortError'
  );
};

/**
 * Active la connexion réseau Firestore
 * @returns Promise<boolean> - true si réussi
 */
export const enableFirestoreNetwork = async (): Promise<boolean> => {
  try {
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'activation du réseau Firestore:', error);
    return false;
  }
};

/**
 * Désactive la connexion réseau Firestore (utilisation hors ligne)
 * @returns Promise<boolean> - true si réussi
 */
export const disableFirestoreNetwork = async (): Promise<boolean> => {
  try {
    await disableNetwork(db);
    return true;
  } catch (error) {
    console.error('Erreur lors de la désactivation du réseau Firestore:', error);
    return false;
  }
};

/**
 * Tente de reconnecter à Firestore avec une stratégie de backoff exponentiel
 * @returns Promise<boolean> - true si réussi
 */
export const reconnectToFirestore = async (): Promise<boolean> => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Délai exponentiel: 1s, 2s, 4s, etc.
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Tentative de reconnexion à Firestore (${attempt + 1}/${MAX_RETRIES}) après ${delay}ms...`);
      
      // Attendre avant la tentative
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Tenter d'activer le réseau
      await enableNetwork(db);
      
      console.log('Reconnexion à Firestore réussie');
      return true;
    } catch (error) {
      console.error(`Échec de la tentative de reconnexion ${attempt + 1}/${MAX_RETRIES}:`, error);
    }
  }
  
  console.error(`Échec après ${MAX_RETRIES} tentatives de reconnexion à Firestore`);
  return false;
};

/**
 * Exécute une fonction avec gestion automatique des erreurs réseau et retries
 * @param operation La fonction à exécuter
 * @param maxRetries Nombre maximum de tentatives (par défaut: 3)
 * @returns Le résultat de l'opération
 */
export const executeWithNetworkRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Utiliser un timeout pour éviter les opérations bloquées
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Operation timed out')), MAX_TIMEOUT);
        })
      ]) as T;
      
      return result;
    } catch (error) {
      lastError = error;
      console.error(`Erreur lors de la tentative ${attempt + 1}/${maxRetries}:`, error);
      
      // Si c'est une erreur réseau, tenter de reconnecter
      if (isNetworkError(error)) {
        console.log('Erreur réseau détectée, tentative de reconnexion...');
        await reconnectToFirestore();
        
        // Pause avant la prochaine tentative
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Si ce n'est pas une erreur réseau, ne pas réessayer
        throw error;
      }
    }
  }
  
  // Si on arrive ici, toutes les tentatives ont échoué
  console.error(`L'opération a échoué après ${maxRetries} tentatives`);
  throw lastError;
};
