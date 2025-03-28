
import { Employee } from '@/types/employee';
import { getAllDocuments, getDocumentById } from '@/hooks/firestore/read-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';

// Clé de stockage local pour les employés
const LOCAL_STORAGE_KEY = 'employees_data';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes en millisecondes

export const getEmployeesData = async (): Promise<Employee[]> => {
  try {
    console.log('Récupération des données employés depuis Firestore...');
    
    // Utilisation de executeWithNetworkRetry pour gérer automatiquement les erreurs réseau
    const firestoreData = await executeWithNetworkRetry(async () => {
      // Utilisation de la collection définie dans COLLECTIONS pour garantir la cohérence
      return await getAllDocuments(COLLECTIONS.EMPLOYEES);
    });
    
    // Vérifier si les données sont valides et non vides
    if (firestoreData && Array.isArray(firestoreData) && firestoreData.length > 0) {
      console.log(`${firestoreData.length} employés récupérés depuis Firestore`);
      
      // Sauvegarder dans localStorage avec timestamp pour le cache
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        timestamp: new Date().getTime(),
        data: firestoreData
      }));
      
      return firestoreData as Employee[];
    }
    
    // Si aucune donnée Firestore, vérifier le cache local
    console.log('Aucune donnée Firestore, vérification du cache local');
    const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      const now = new Date().getTime();
      const cacheAge = now - timestamp;
      
      // Vérifier si le cache n'est pas expiré
      if (cacheAge < CACHE_DURATION) {
        console.log(`Données en cache trouvées (${data.length} employés), âge: ${Math.round(cacheAge / 60000)} minutes`);
        return data as Employee[];
      } else {
        console.log('Données en cache expirées');
      }
    }
    
    // En dernier recours, utiliser les données simulées
    console.log('Aucune donnée disponible, utilisation des données simulées');
    const { employees } = await import('@/data/employees');
    return employees;
  } catch (error) {
    console.error("Erreur lors de la récupération des employés:", error);
    toast.error("Erreur lors du chargement des employés");
    
    // En cas d'erreur, essayer le stockage local
    const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedData) {
      const { data } = JSON.parse(cachedData);
      console.log("Utilisation des données en cache suite à une erreur");
      return data as Employee[];
    }
    
    // En dernier recours, utiliser les données simulées
    const { employees } = await import('@/data/employees');
    return employees;
  }
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    // Tenter de récupérer directement depuis Firestore
    console.log(`Récupération de l'employé ${id} depuis Firestore`);
    const employeeData = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.EMPLOYEES, id);
    });
    
    if (employeeData) {
      console.log(`Employé ${id} récupéré depuis Firestore`);
      return employeeData as Employee;
    }
    
    // Si pas trouvé, chercher dans le stockage local
    console.log(`Employé ${id} non trouvé dans Firestore, recherche en cache local`);
    const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedData) {
      const { data } = JSON.parse(cachedData);
      const employees = data as Employee[];
      const employee = employees.find(emp => emp.id === id);
      if (employee) {
        console.log(`Employé ${id} trouvé en cache local`);
        return employee;
      }
    }
    
    // En dernier recours, chercher dans les données simulées
    console.log(`Employé ${id} non trouvé, recherche dans les données simulées`);
    const { employees } = await import('@/data/employees');
    return employees.find(emp => emp.id === id) || null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'employé ${id}:`, error);
    toast.error(`Erreur lors du chargement des données de l'employé`);
    return null;
  }
};

// Fonction pour actualiser les données (forcer le rechargement depuis Firebase)
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  try {
    console.log("Actualisation des données employés depuis Firestore...");
    // Supprimer le cache local
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    
    // Récupérer directement depuis Firestore avec executeWithNetworkRetry
    const firestoreData = await executeWithNetworkRetry(async () => {
      return await getAllDocuments(COLLECTIONS.EMPLOYEES);
    });
    
    if (firestoreData && Array.isArray(firestoreData) && firestoreData.length > 0) {
      console.log(`${firestoreData.length} employés récupérés depuis Firestore`);
      // Sauvegarder dans localStorage avec timestamp
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        timestamp: new Date().getTime(),
        data: firestoreData
      }));
      toast.success("Données employés actualisées avec succès");
      return firestoreData as Employee[];
    } else {
      toast.warning("Aucune donnée trouvée sur Firestore");
      const { employees } = await import('@/data/employees');
      return employees;
    }
  } catch (error) {
    console.error("Erreur lors de l'actualisation des employés:", error);
    toast.error("Échec de l'actualisation des données employés");
    const { employees } = await import('@/data/employees');
    return employees;
  }
};
