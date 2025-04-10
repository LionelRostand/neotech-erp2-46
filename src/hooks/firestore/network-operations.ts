
import { checkFirestoreConnection } from '@/lib/firebase';
import { toast } from 'sonner';

/**
 * File avec les opérations réseau pour Firestore
 */

// Queue pour stocker les opérations à exécuter lorsque la connexion est rétablie
type QueuedOperation = {
  operation: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  retryCount: number;
  maxRetries: number;
};

let operationsQueue: QueuedOperation[] = [];
let isOnline = true;
let isProcessingQueue = false;

/**
 * Restaure la connectivité à Firestore et tente de rétablir la connexion
 * @returns Promesse résolue avec true si la connexion est rétablie, false sinon
 */
export const restoreFirestoreConnectivity = async (): Promise<boolean> => {
  console.log('Tentative de restauration de la connectivité Firestore...');
  try {
    const isConnected = await checkFirestoreConnection();
    console.log('Connectivité Firestore:', isConnected ? 'Rétablie' : 'Toujours déconnecté');
    
    if (isConnected && !isOnline) {
      isOnline = true;
      toast.success('Connexion réseau rétablie');
      
      // Traiter les opérations en attente
      processOperationsQueue();
    }
    
    return isConnected;
  } catch (error) {
    console.error('Erreur lors de la tentative de reconnexion:', error);
    return false;
  }
};

/**
 * Ajoute une opération à la file d'attente
 * @param operation Fonction à exécuter
 * @param maxRetries Nombre maximum de tentatives
 * @returns Promesse résolue avec le résultat de l'opération
 */
export const queueNetworkOperation = <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  return new Promise((resolve, reject) => {
    operationsQueue.push({
      operation,
      resolve,
      reject,
      retryCount: 0,
      maxRetries,
    });
    
    // Si nous sommes en ligne, tenter d'exécuter immédiatement
    if (isOnline && !isProcessingQueue) {
      processOperationsQueue();
    }
  });
};

/**
 * Traite les opérations en attente dans la file
 */
const processOperationsQueue = async () => {
  if (isProcessingQueue || operationsQueue.length === 0) return;
  
  isProcessingQueue = true;
  console.log(`Traitement de ${operationsQueue.length} opérations en attente...`);
  
  while (operationsQueue.length > 0) {
    const operation = operationsQueue.shift();
    if (!operation) continue;
    
    try {
      const result = await operation.operation();
      operation.resolve(result);
    } catch (error: any) {
      console.error('Erreur lors de l\'exécution d\'une opération en file d\'attente:', error);
      
      const isNetworkError = error.code === 'unavailable' || 
        error.code === 'deadline-exceeded' ||
        error.message?.includes('network') ||
        error.message?.includes('timeout') ||
        error.name === 'AbortError';
      
      // Si c'est une erreur réseau et que nous n'avons pas dépassé le nombre maximum de tentatives
      if (isNetworkError) {
        if (operation.retryCount < operation.maxRetries) {
          console.log(`Remise en file d'attente de l'opération (tentative ${operation.retryCount + 1}/${operation.maxRetries})`);
          operationsQueue.push({
            ...operation,
            retryCount: operation.retryCount + 1,
          });
          
          // Marquer comme hors ligne et arrêter le traitement
          isOnline = false;
          break;
        }
      }
      
      // Si ce n'est pas une erreur réseau ou que nous avons dépassé le nombre maximum de tentatives
      operation.reject(error);
    }
  }
  
  isProcessingQueue = false;
  console.log('Traitement de la file d\'attente terminé');
};

/**
 * Configure les gestionnaires pour les événements online/offline
 */
export const handleOfflineOperations = () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('online', async () => {
      console.log('Navigateur en ligne, tentative de reconnexion à Firestore...');
      const connected = await restoreFirestoreConnectivity();
      if (connected) {
        processOperationsQueue();
      }
    });
    
    window.addEventListener('offline', () => {
      console.log('Navigateur hors ligne, passage en mode hors ligne');
      isOnline = false;
      toast.error('Connexion réseau perdue. Passage en mode hors ligne.');
    });
  }
};
