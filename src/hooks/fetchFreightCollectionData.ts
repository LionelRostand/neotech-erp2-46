import { 
  collection, 
  query, 
  where, 
  getDocs, 
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Fonction pour récupérer des données d'une collection de fret avec des contraintes spécifiques
 */
export const fetchFreightCollection = async <T = any>(
  collectionName: keyof typeof COLLECTIONS.FREIGHT, 
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    // Obtenir le chemin de la collection depuis l'objet COLLECTIONS
    const collectionPath = COLLECTIONS.FREIGHT[collectionName];
    
    // Créer une référence à la collection
    const collectionRef = collection(db, collectionPath);
    
    // Créer une requête avec les contraintes fournies
    const q = query(collectionRef, ...constraints);
    
    // Exécuter la requête
    const querySnapshot = await getDocs(q);
    
    // Transformer les documents en objets avec l'ID inclus
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
 * Fonction pour récupérer des expéditions avec filtrage optionnel
 */
export const fetchShipments = async (
  status?: string,
  customerId?: string,
  dateStart?: Date,
  dateEnd?: Date
) => {
  // Construire les contraintes dynamiquement
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
  
  // Utiliser fetchFreightCollection avec le nom de collection spécifique
  return fetchFreightCollection(
    'SHIPMENTS',
    constraints
  );
};

/**
 * Autres fonctions de récupération spécifiques pour d'autres collections de fret
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

// Et d'autres fonctions de récupération spécifiques au besoin...
