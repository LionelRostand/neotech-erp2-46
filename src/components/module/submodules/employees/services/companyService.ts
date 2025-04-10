
import { getAllDocuments, getDocumentById } from '@/hooks/firestore/read-operations';
import { addDocument } from '@/hooks/firestore/create-operations';
import { updateDocument, setDocument } from '@/hooks/firestore/update-operations';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';
import { Company } from '../../companies/types';

// Récupérer toutes les entreprises
export const getAllCompanies = async () => {
  try {
    console.log('Récupération de toutes les entreprises depuis Firestore...');
    
    const companies = await executeWithNetworkRetry(async () => {
      return await getAllDocuments(COLLECTIONS.COMPANIES);
    });
    
    console.log(`${companies.length} entreprises récupérées depuis Firestore`);
    return companies;
  } catch (error) {
    console.error("Erreur lors de la récupération des entreprises:", error);
    toast.error("Erreur lors du chargement des entreprises");
    return [];
  }
};

// Récupérer une entreprise par son ID
export const getCompanyById = async (companyId: string) => {
  try {
    console.log(`Récupération de l'entreprise ${companyId} depuis Firestore...`);
    
    const company = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.COMPANIES, companyId);
    });
    
    if (!company) {
      console.log(`Entreprise ${companyId} non trouvée dans Firestore`);
      return null;
    }
    
    console.log(`Entreprise ${companyId} récupérée avec succès`);
    return company;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'entreprise ${companyId}:`, error);
    toast.error("Erreur lors du chargement des données de l'entreprise");
    return null;
  }
};

// Ajouter une nouvelle entreprise
export const addCompany = async (companyData: any) => {
  try {
    console.log('Ajout d\'une nouvelle entreprise dans Firestore...');
    
    const company = await executeWithNetworkRetry(async () => {
      return await addDocument(COLLECTIONS.COMPANIES, companyData);
    });
    
    console.log('Entreprise ajoutée avec succès:', company);
    toast.success("Entreprise ajoutée avec succès");
    return company;
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'entreprise:", error);
    toast.error("Erreur lors de l'ajout de l'entreprise");
    return null;
  }
};

// Mettre à jour une entreprise
export const updateCompany = async (companyId: string, companyData: any) => {
  try {
    console.log(`Mise à jour de l'entreprise ${companyId} dans Firestore...`);
    
    const company = await executeWithNetworkRetry(async () => {
      return await updateDocument(COLLECTIONS.COMPANIES, companyId, companyData);
    });
    
    console.log('Entreprise mise à jour avec succès:', company);
    toast.success("Entreprise mise à jour avec succès");
    return company;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'entreprise:", error);
    toast.error("Erreur lors de la mise à jour de l'entreprise");
    return null;
  }
};

// Supprimer une entreprise
export const deleteCompany = async (companyId: string) => {
  try {
    console.log(`Suppression de l'entreprise ${companyId} dans Firestore...`);
    
    await executeWithNetworkRetry(async () => {
      return await deleteDocument(COLLECTIONS.COMPANIES, companyId);
    });
    
    console.log('Entreprise supprimée avec succès');
    toast.success("Entreprise supprimée avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'entreprise:", error);
    toast.error("Erreur lors de la suppression de l'entreprise");
    return false;
  }
};

// Récupérer les employés d'une entreprise
export const getEmployeesByCompany = async (companyId: string) => {
  try {
    console.log(`Récupération des employés de l'entreprise ${companyId} depuis Firestore...`);
    
    const employees = await executeWithNetworkRetry(async () => {
      const allEmployees = await getAllDocuments(COLLECTIONS.HR.EMPLOYEES);
      return allEmployees.filter(emp => (emp as any).companyId === companyId);
    });
    
    console.log(`${employees.length} employés récupérés pour l'entreprise ${companyId}`);
    return employees;
  } catch (error) {
    console.error(`Erreur lors de la récupération des employés de l'entreprise ${companyId}:`, error);
    toast.error("Erreur lors du chargement des employés");
    return [];
  }
};
