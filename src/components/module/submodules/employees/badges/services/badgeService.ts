
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { doc, getDoc, setDoc, collection, query, getDocs, deleteDoc } from 'firebase/firestore';
import { BadgeData } from '../BadgeTypes';
import { Employee } from '@/types/employee';

// Existing functions
export const getBadge = async (badgeId: string): Promise<BadgeData | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.BADGES, badgeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as BadgeData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching badge:", error);
    return null;
  }
};

export const createBadge = async (badgeData: BadgeData): Promise<BadgeData | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.BADGES, badgeData.id);
    await setDoc(docRef, badgeData);
    
    // Fetch the document to return the created badge data
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const docData = docSnap.data();
      return { id: docRef.id, ...docData } as unknown as BadgeData;
    } else {
      console.log("No such document after creation!");
      return null;
    }
  } catch (error) {
    console.error("Error creating badge:", error);
    return null;
  }
};

export const updateBadge = async (badgeId: string, badgeData: Partial<BadgeData>): Promise<BadgeData | null> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.BADGES, badgeId);
    await setDoc(docRef, badgeData, { merge: true });
    
    // Fetch the document to return the updated badge data
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const docData = docSnap.data();
      return { id: docRef.id, ...docData } as unknown as BadgeData;
    } else {
      console.log("No such document after update!");
      return null;
    }
  } catch (error) {
    console.error("Error updating badge:", error);
    return null;
  }
};

export const deleteBadge = async (badgeId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.BADGES, badgeId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting badge:", error);
    return false;
  }
};

export const getAllBadges = async (): Promise<BadgeData[]> => {
  try {
    const badgesCollection = collection(db, COLLECTIONS.HR.BADGES);
    const badgesQuery = query(badgesCollection);
    const querySnapshot = await getDocs(badgesQuery);
    
    const badges: BadgeData[] = [];
    querySnapshot.forEach(doc => {
      badges.push({
        id: doc.id,
        ...doc.data()
      } as BadgeData);
    });
    
    return badges;
  } catch (error) {
    console.error("Error fetching all badges:", error);
    return [];
  }
};

// Nouvelle fonction pour vérifier si un employé a un badge correspondant
export const findEmployeeByBadge = (employees: Employee[] | undefined, badgeId: string): Employee | undefined => {
  if (!badgeId || !employees?.length) return undefined;
  
  // Normaliser l'ID du badge (supprimer "B-" ou "B" au début)
  const normalizedBadgeId = badgeId.replace(/^b-?/i, '');
  
  // Rechercher parmi les documents des employés
  for (const employee of employees) {
    // 1. Vérifier dans les documents de l'employé
    if (employee.documents && Array.isArray(employee.documents)) {
      const hasBadge = employee.documents.some(doc => 
        (doc.type === 'badge' || doc.name?.toLowerCase().includes('badge')) && 
        (doc.id === badgeId || doc.id?.includes(normalizedBadgeId) || doc.name?.includes(normalizedBadgeId))
      );
      
      if (hasBadge) {
        console.log(`Badge trouvé dans les documents de ${employee.firstName} ${employee.lastName}`);
        return employee;
      }
    }
    
    // 2. Vérifier si l'ID de l'employé contient l'ID du badge
    if (employee.id.includes(normalizedBadgeId)) {
      console.log(`ID d'employé correspondant au badge: ${employee.id}`);
      return employee;
    }
    
    // 3. Vérifier le format spécial B-AAMMJJ-XXXX où XXXX pourrait être lié à l'ID employé
    if (badgeId.match(/^B-\d{6}-(\d+)$/i)) {
      const empIdPart = badgeId.split('-')[2];
      if (employee.id.includes(empIdPart)) {
        console.log(`Badge au format spécial trouvé pour ${employee.firstName} ${employee.lastName}`);
        return employee;
      }
    }
  }
  
  return undefined;
};

// Aliases pour la compatibilité avec EmployeesBadges component
export const getBadges = getAllBadges;
export const addBadge = createBadge;

// Fonction utilitaire pour formater un numéro de badge
export const formatBadgeNumber = (employeeId: string, hireDate?: string): string => {
  // Format: B-YYMMDD-XXXX où XXXX sont les 4 derniers chiffres de l'ID
  const date = hireDate ? new Date(hireDate) : new Date();
  const year = date.getFullYear().toString().substring(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Extraire les 4 derniers caractères de l'ID employé ou générer un nombre aléatoire
  const idSuffix = employeeId ? 
    (employeeId.replace(/\D/g, '').slice(-4) || String(Math.floor(1000 + Math.random() * 9000))) : 
    String(Math.floor(1000 + Math.random() * 9000));
  
  return `B-${year}${month}${day}-${idSuffix}`;
};

// Function to delete a document (used in EmployeesBadges.tsx)
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    // Use the proper collection path from COLLECTIONS
    const docRef = doc(db, COLLECTIONS.HR.BADGES, documentId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${COLLECTIONS.HR.BADGES}:`, error);
    return false;
  }
};
