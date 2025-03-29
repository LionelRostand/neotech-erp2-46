
import { 
  addDocument,
  getDocumentById,
  getAllDocuments,
  updateDocument,
  setDocument
} from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';

export interface PaySlipData {
  id?: string;
  employeeId: string;
  employeeName: string;
  period: string;
  grossSalary: number;
  netSalary: number;
  deductions: any[];
  earnings: any[];
  overtimeHours?: number;
  overtimeRate?: number;
  companyName?: string;
  companyAddress?: string;
  createdAt?: any;
  updatedAt?: any;
  documentType: 'payslip';
}

// Sauvegarder une nouvelle fiche de paie
export const savePaySlip = async (payslipData: Omit<PaySlipData, 'id' | 'documentType'>): Promise<PaySlipData | null> => {
  try {
    console.log('Sauvegarde de la fiche de paie dans Firestore...');
    
    // Ajouter le type de document pour faciliter les requêtes ultérieures
    const dataToSave = {
      ...payslipData,
      documentType: 'payslip'
    };
    
    const savedPayslip = await executeWithNetworkRetry(async () => {
      return await addDocument(COLLECTIONS.DOCUMENTS, dataToSave);
    });
    
    console.log('Fiche de paie sauvegardée avec succès:', savedPayslip);
    toast.success("Fiche de paie sauvegardée avec succès");
    return savedPayslip as PaySlipData;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la fiche de paie:", error);
    toast.error("Erreur lors de la sauvegarde de la fiche de paie");
    return null;
  }
};

// Récupérer toutes les fiches de paie d'un employé
export const getEmployeePaySlips = async (employeeId: string): Promise<PaySlipData[]> => {
  try {
    console.log(`Récupération des fiches de paie pour l'employé ${employeeId}...`);
    
    // Utiliser getAllDocuments avec filtre
    const payslips = await executeWithNetworkRetry(async () => {
      const allDocs = await getAllDocuments(COLLECTIONS.DOCUMENTS);
      return allDocs.filter(doc => 
        (doc as any).documentType === 'payslip' && 
        (doc as any).employeeId === employeeId
      );
    });
    
    console.log(`${payslips.length} fiches de paie récupérées pour l'employé ${employeeId}`);
    return payslips as PaySlipData[];
  } catch (error) {
    console.error("Erreur lors de la récupération des fiches de paie:", error);
    toast.error("Erreur lors du chargement des fiches de paie");
    return [];
  }
};

// Récupérer toutes les fiches de paie
export const getAllPaySlips = async (): Promise<PaySlipData[]> => {
  try {
    console.log('Récupération de toutes les fiches de paie...');
    
    // Filtrer tous les documents pour ne récupérer que les fiches de paie
    const payslips = await executeWithNetworkRetry(async () => {
      const allDocs = await getAllDocuments(COLLECTIONS.DOCUMENTS);
      return allDocs.filter(doc => (doc as any).documentType === 'payslip');
    });
    
    console.log(`${payslips.length} fiches de paie récupérées au total`);
    return payslips as PaySlipData[];
  } catch (error) {
    console.error("Erreur lors de la récupération des fiches de paie:", error);
    toast.error("Erreur lors du chargement des fiches de paie");
    return [];
  }
};

// Récupérer une fiche de paie spécifique
export const getPaySlipById = async (payslipId: string): Promise<PaySlipData | null> => {
  try {
    console.log(`Récupération de la fiche de paie ${payslipId}...`);
    
    const payslip = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.DOCUMENTS, payslipId);
    });
    
    // Vérifier que c'est bien une fiche de paie
    if (payslip && (payslip as any).documentType === 'payslip') {
      console.log(`Fiche de paie ${payslipId} récupérée avec succès`);
      return payslip as PaySlipData;
    }
    
    console.log(`Le document ${payslipId} n'est pas une fiche de paie valide`);
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la fiche de paie ${payslipId}:`, error);
    toast.error("Erreur lors du chargement de la fiche de paie");
    return null;
  }
};

// Mettre à jour une fiche de paie existante
export const updatePaySlip = async (payslipId: string, payslipData: Partial<PaySlipData>): Promise<PaySlipData | null> => {
  try {
    console.log(`Mise à jour de la fiche de paie ${payslipId}...`);
    
    const updatedPayslip = await executeWithNetworkRetry(async () => {
      return await updateDocument(COLLECTIONS.DOCUMENTS, payslipId, payslipData);
    });
    
    console.log('Fiche de paie mise à jour avec succès:', updatedPayslip);
    toast.success("Fiche de paie mise à jour avec succès");
    return updatedPayslip as PaySlipData;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la fiche de paie:", error);
    toast.error("Erreur lors de la mise à jour de la fiche de paie");
    return null;
  }
};

// Créer ou mettre à jour une fiche de paie avec un ID spécifique
export const setPaySlip = async (payslipId: string, payslipData: Omit<PaySlipData, 'id'>): Promise<PaySlipData | null> => {
  try {
    console.log(`Création/Mise à jour de la fiche de paie ${payslipId}...`);
    
    const savedPayslip = await executeWithNetworkRetry(async () => {
      return await setDocument(COLLECTIONS.DOCUMENTS, payslipId, payslipData);
    });
    
    console.log('Fiche de paie enregistrée avec succès:', savedPayslip);
    toast.success("Fiche de paie enregistrée avec succès");
    return savedPayslip as PaySlipData;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la fiche de paie:", error);
    toast.error("Erreur lors de l'enregistrement de la fiche de paie");
    return null;
  }
};
