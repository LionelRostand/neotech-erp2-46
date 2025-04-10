
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  QueryConstraint,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Function to check if a freight collection exists
 */
export const checkFreightCollectionExists = async (
  collectionName: keyof typeof COLLECTIONS.FREIGHT
): Promise<boolean> => {
  try {
    // Get the collection path from the COLLECTIONS object
    const collectionPath = COLLECTIONS.FREIGHT[collectionName];
    
    // Create a reference to the collection
    const collectionRef = collection(db, collectionPath);
    
    // Execute a limited query to see if the collection has any documents
    const q = query(collectionRef, where('__name__', '!=', ''), ...[]); // non-empty check
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error(`Error checking if ${String(collectionName)} collection exists:`, error);
    return false;
  }
};

/**
 * Function to fetch data from a freight collection with specific constraints
 */
export const fetchFreightCollection = async <T = any>(
  collectionName: keyof typeof COLLECTIONS.FREIGHT, 
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    // Get the collection path from the COLLECTIONS object
    const collectionPath = COLLECTIONS.FREIGHT[collectionName];
    
    // Create a reference to the collection
    const collectionRef = collection(db, collectionPath);
    
    // Create a query with the provided constraints
    const q = query(collectionRef, ...constraints);
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Transform the documents into objects with the ID included
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
    
    console.log(`Fetched ${documents.length} documents from ${String(collectionName)} collection`);
    
    return documents;
  } catch (error) {
    console.error(`Error fetching ${String(collectionName)} collection:`, error);
    throw error;
  }
};

/**
 * Alias for fetchFreightCollection to maintain backward compatibility
 */
export const fetchFreightCollectionData = fetchFreightCollection;

/**
 * Function to fetch shipments with optional filtering
 */
export const fetchShipments = async (
  status?: string,
  customerId?: string,
  dateStart?: Date,
  dateEnd?: Date
) => {
  // Build constraints dynamically
  const constraints: QueryConstraint[] = [];
  
  if (status) {
    constraints.push(where('status', '==', status));
  }
  
  if (customerId) {
    constraints.push(where('customerId', '==', customerId));
  }
  
  if (dateStart) {
    constraints.push(where('departureDate', '>=', dateStart));
  }
  
  if (dateEnd) {
    constraints.push(where('departureDate', '<=', dateEnd));
  }
  
  // Use fetchFreightCollection with the specific collection name
  return fetchFreightCollection(
    'SHIPMENTS',
    constraints
  );
};

/**
 * Other specific fetch functions for other freight collections
 */
export const fetchContainers = async (status?: string) => {
  const constraints: QueryConstraint[] = [];
  
  if (status) {
    constraints.push(where('status', '==', status));
  }
  
  return fetchFreightCollection(
    'CONTAINERS',
    constraints
  );
};

export const fetchFreightCustomers = async () => {
  return fetchFreightCollection('CUSTOMERS');
};

export const fetchCarriers = async () => {
  return fetchFreightCollection('CARRIERS');
};

// And other specific fetch functions as needed...
