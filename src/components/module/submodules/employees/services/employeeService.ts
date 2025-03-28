
import { Employee } from '@/types/employee';
import { getAllDocuments, getDocumentById } from '@/hooks/firestore/read-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

// Clé de stockage local pour les employés
const LOCAL_STORAGE_KEY = 'employees_data';
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes en millisecondes

export const getEmployeesData = async (): Promise<Employee[]> => {
  try {
    // Vérifier si des données mises en cache récemment existent
    const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      const now = new Date().getTime();
      
      // Si les données ont moins de 30 minutes, les utiliser
      if (now - timestamp < CACHE_DURATION && data.length > 0) {
        console.log(`Utilisation des données en cache (${data.length} employés)`);
        return data as Employee[];
      }
    }
    
    // Sinon, tenter de récupérer depuis Firestore
    console.log('Tentative de récupération des employés depuis Firestore');
    const data = await getAllDocuments(COLLECTIONS.EMPLOYEES);
    
    if (data && data.length > 0) {
      console.log(`${data.length} employés récupérés depuis Firestore`);
      // Sauvegarder dans localStorage avec timestamp
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        timestamp: new Date().getTime(),
        data: data
      }));
      return data as Employee[];
    }
    
    // Si aucune donnée Firestore, essayer le stockage local (même si expiré)
    console.log('Aucune donnée Firestore, recherche dans le stockage local');
    if (cachedData) {
      const { data } = JSON.parse(cachedData);
      console.log(`${data.length} employés récupérés depuis le stockage local (expiré)`);
      return data as Employee[];
    }
    
    // En dernier recours, utiliser les données simulées du fichier employees.ts
    console.log('Utilisation des données simulées');
    const { employees } = await import('@/data/employees');
    return employees;
  } catch (error) {
    console.error("Erreur lors de la récupération des employés:", error);
    toast.error("Erreur lors du chargement des employés");
    
    // En cas d'erreur, essayer le stockage local
    const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedData) {
      const { data } = JSON.parse(cachedData);
      return data as Employee[];
    }
    
    // En dernier recours, utiliser les données simulées
    const { employees } = await import('@/data/employees');
    return employees;
  }
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    // Tenter de récupérer depuis Firestore
    const data = await getDocumentById(COLLECTIONS.EMPLOYEES, id);
    if (data) {
      return data as Employee;
    }
    
    // Si pas trouvé, chercher dans le stockage local
    const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cachedData) {
      const { data } = JSON.parse(cachedData);
      const employees = data as Employee[];
      const employee = employees.find(emp => emp.id === id);
      if (employee) return employee;
    }
    
    // En dernier recours, chercher dans les données simulées
    const { employees } = await import('@/data/employees');
    return employees.find(emp => emp.id === id) || null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'employé ${id}:`, error);
    toast.error(`Erreur lors du chargement des données de l'employé`);
    return null;
  }
};

// Nouvelle fonction pour actualiser les données
export const refreshEmployeesData = async (): Promise<Employee[]> => {
  // Supprimer le cache local
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  // Récupérer à nouveau depuis Firestore
  return getEmployeesData();
};
