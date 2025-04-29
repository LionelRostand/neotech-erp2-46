
import { collection, getDocs, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

// Cache mechanism to avoid redundant requests
const requestCache = new Map<string, {
  data: any;
  timestamp: number;
  expiresIn: number;
}>();

/**
 * Utility function to fetch data from any Firestore collection
 * @param collectionPath Path to the collection
 * @param constraints Query constraints
 * @param cacheTime Time in ms to cache the response (default 10 seconds)
 * @returns Promise with the collection data
 */
export async function fetchCollectionData<T>(
  collectionPath: string, 
  constraints: QueryConstraint[] = [],
  cacheTime: number = 10000 // 10 seconds default cache
): Promise<T[]> {
  try {
    // Generate a unique cache key based on collection path and constraints
    const cacheKey = `${collectionPath}-${JSON.stringify(constraints)}`;
    
    // Check if we have a valid cached response
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
      
      // Cache the successful response
      requestCache.set(cacheKey, {
        data,
        timestamp: now,
        expiresIn: cacheTime
      });
      
      return data;
    } catch (err: any) {
      console.error(`Error in getDocs for ${collectionPath}:`, err);
      
      // If we have cached data, return it even if expired as a fallback
      if (cachedResponse) {
        console.log(`Using expired cached data for ${collectionPath} due to error`);
        return cachedResponse.data;
      }
      
      throw err;
    }
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionPath}:`, err);
    
    // Only show toast for network errors, not for missing data or firestore index issues
    if (err.code !== 'failed-precondition') {
      toast.error(`Erreur lors du chargement des données: ${err.message}`);
    }
    
    // Return empty array on error
    return [] as T[];
  }
}
