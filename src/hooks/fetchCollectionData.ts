
import { collection, getDocs, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

// Mécanisme de cache pour éviter les requêtes redondantes
const requestCache = new Map<string, {
  data: any;
  timestamp: number;
  expiresIn: number;
}>();

/**
 * Fonction utilitaire pour récupérer des données de n'importe quelle collection Firestore
 * @param collectionPath Chemin vers la collection
 * @param constraints Contraintes de requête
 * @param cacheTime Temps en ms pour mettre en cache la réponse (10 secondes par défaut)
 * @returns Promise avec les données de la collection
 */
export async function fetchCollectionData<T>(
  collectionPath: string, 
  constraints: QueryConstraint[] = [],
  cacheTime: number = 10000 // 10 secondes de cache par défaut
): Promise<T[]> {
  try {
    // Générer une clé de cache unique basée sur le chemin de la collection et les contraintes
    const cacheKey = `${collectionPath}-${JSON.stringify(constraints)}`;
    
    // Vérifier si nous avons une réponse en cache valide
    const cachedResponse = requestCache.get(cacheKey);
    const now = Date.now();
    
    if (cachedResponse && now - cachedResponse.timestamp < cachedResponse.expiresIn) {
      console.log(`Using cached data for ${collectionPath}`);
      return cachedResponse.data;
    }
    
    const collectionRef = collection(db, collectionPath);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
    
    try {
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as T[];
      
      // Mettre en cache la réponse réussie
      requestCache.set(cacheKey, {
        data,
        timestamp: now,
        expiresIn: cacheTime
      });
      
      return data;
    } catch (err: any) {
      console.error(`Error in getDocs for ${collectionPath}:`, err);
      
      // Si nous avons des données en cache, les renvoyer même si expirées comme solution de repli
      if (cachedResponse) {
        console.log(`Using expired cached data for ${collectionPath} due to error`);
        return cachedResponse.data;
      }
      
      throw err;
    }
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionPath}:`, err);
    
    // Afficher un toast uniquement pour les erreurs réseau, pas pour les données manquantes ou les problèmes d'index Firestore
    if (err.code !== 'failed-precondition') {
      toast.error(`Erreur lors du chargement des données: ${err.message}`);
    }
    
    // Renvoyer un tableau vide en cas d'erreur
    return [] as T[];
  }
}
