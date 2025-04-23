
import { collection, getDocs, query, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/usePermissions';

/**
 * Utility function to fetch data from any Firestore collection
 * @param collectionPath Path to the collection
 * @param constraints Query constraints
 * @returns Promise with the collection data
 */
export async function fetchCollectionData<T>(
  collectionPath: string, 
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    // Check for empty or invalid collection path
    if (!collectionPath || collectionPath.trim() === '') {
      const errorMessage = 'Empty collection path provided';
      console.error(errorMessage);
      toast.error(`Erreur: ${errorMessage}`);
      return [];
    }
    
    console.log(`Fetching from collection path: ${collectionPath}`);
    
    const collectionRef = collection(db, collectionPath);
    const q = constraints.length > 0 ? query(collectionRef, ...constraints) : query(collectionRef);
    const querySnapshot = await getDocs(q);
    
    const result = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as T[];
    
    console.log(`Fetched ${result.length} documents from ${collectionPath}`);
    return result;
  } catch (err: any) {
    console.error(`Error fetching data from ${collectionPath}:`, err);
    toast.error(`Erreur lors du chargement des données: ${err.message}`);
    return [];
  }
}

/**
 * Hook to check if user has permission to access a specific module and action
 * @param moduleId Module ID to check
 * @param action Action to check (view, create, edit, delete)
 * @returns Boolean indicating if user has permission
 */
export function useHasPermission(moduleId: string, action: 'view' | 'create' | 'edit' | 'delete'): boolean {
  const { checkPermission, isAdmin, hasPermission } = usePermissions(moduleId);
  
  // Si l'utilisateur est admin, il a toutes les permissions
  if (isAdmin) return true;
  
  // Vérifier la permission spécifique
  const permissionKey = `${moduleId}.${action}`;
  return !!hasPermission[permissionKey];
}

/**
 * Helper to append module prefix if needed
 * @param moduleId Module ID
 * @returns Properly formatted module ID
 */
export function formatModuleId(moduleId: string): string {
  if (moduleId.includes('-')) return moduleId;
  return `garage-${moduleId}`;
}
