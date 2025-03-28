
import { Employee } from '@/types/employee';
import { getAllDocuments, getDocumentById } from '@/hooks/firestore/read-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

// Clé de stockage local pour les employés
const LOCAL_STORAGE_KEY = 'employees_data';

export const getEmployeesData = async (): Promise<Employee[]> => {
  try {
    // Tenter de récupérer depuis Firestore
    console.log('Tentative de récupération des employés depuis Firestore');
    const data = await getAllDocuments(COLLECTIONS.EMPLOYEES);
    
    if (data && data.length > 0) {
      console.log(`${data.length} employés récupérés depuis Firestore`);
      // Sauvegarder dans localStorage comme sauvegarde
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      return data as Employee[];
    }
    
    // Si aucune donnée Firestore, essayer le stockage local
    console.log('Aucune donnée Firestore, recherche dans le stockage local');
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      const parsedData = JSON.parse(localData);
      console.log(`${parsedData.length} employés récupérés depuis le stockage local`);
      return parsedData as Employee[];
    }
    
    // Si toujours aucune donnée, utiliser les données simulées du fichier employees.ts
    console.log('Utilisation des données simulées');
    const { employees } = await import('@/data/employees');
    return employees;
  } catch (error) {
    console.error("Erreur lors de la récupération des employés:", error);
    toast.error("Erreur lors du chargement des employés");
    
    // En cas d'erreur, essayer le stockage local
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      return JSON.parse(localData) as Employee[];
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
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      const employees = JSON.parse(localData) as Employee[];
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

