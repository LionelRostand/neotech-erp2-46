
import { 
  getDocumentById, 
  getAllDocuments 
} from '@/hooks/firestore/read-operations';
import { 
  addDocument 
} from '@/hooks/firestore/create-operations';
import { 
  updateDocument 
} from '@/hooks/firestore/update-operations';
import { 
  deleteDocument 
} from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';
import { TimeReport } from '@/types/timesheet';

// Collection path pour les feuilles de temps
const TIME_SHEETS_COLLECTION = COLLECTIONS.HR.TIME_SHEETS;

// Récupérer toutes les feuilles de temps
export const getAllTimeSheets = async (): Promise<TimeReport[]> => {
  try {
    console.log('Récupération des feuilles de temps depuis Firestore...');
    
    const timesheets = await executeWithNetworkRetry(async () => {
      return await getAllDocuments(TIME_SHEETS_COLLECTION);
    });
    
    console.log(`${timesheets.length} feuilles de temps récupérées depuis Firestore`);
    return timesheets as TimeReport[];
  } catch (error) {
    console.error("Erreur lors de la récupération des feuilles de temps:", error);
    toast.error("Erreur lors du chargement des feuilles de temps");
    return [];
  }
};

// Récupérer une feuille de temps par ID
export const getTimeSheetById = async (id: string): Promise<TimeReport | null> => {
  try {
    console.log(`Récupération de la feuille de temps ${id} depuis Firestore`);
    
    const timesheet = await executeWithNetworkRetry(async () => {
      return await getDocumentById(TIME_SHEETS_COLLECTION, id);
    });
    
    if (timesheet) {
      console.log(`Feuille de temps ${id} récupérée`);
      return timesheet as TimeReport;
    } else {
      console.log(`Feuille de temps ${id} non trouvée`);
      return null;
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération de la feuille de temps ${id}:`, error);
    toast.error("Erreur lors du chargement de la feuille de temps");
    return null;
  }
};

// Ajouter une nouvelle feuille de temps
export const addTimeSheet = async (data: Omit<TimeReport, 'id'>): Promise<TimeReport | null> => {
  try {
    console.log('Ajout d\'une nouvelle feuille de temps...');
    
    const newTimeSheet = await executeWithNetworkRetry(async () => {
      // Ajouter une date de création
      const dataWithTimestamp = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return await addDocument(TIME_SHEETS_COLLECTION, dataWithTimestamp);
    });
    
    console.log('Feuille de temps ajoutée avec succès:', newTimeSheet);
    toast.success('Feuille de temps créée avec succès');
    return newTimeSheet as TimeReport;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la feuille de temps:", error);
    toast.error("Erreur lors de la création de la feuille de temps");
    return null;
  }
};

// Mettre à jour une feuille de temps
export const updateTimeSheet = async (id: string, data: Partial<TimeReport>): Promise<TimeReport | null> => {
  try {
    console.log(`Mise à jour de la feuille de temps ${id}...`);
    
    const updatedTimeSheet = await executeWithNetworkRetry(async () => {
      // Ajouter une date de mise à jour
      const dataWithTimestamp = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return await updateDocument(TIME_SHEETS_COLLECTION, id, dataWithTimestamp);
    });
    
    console.log('Feuille de temps mise à jour avec succès:', updatedTimeSheet);
    toast.success('Feuille de temps mise à jour avec succès');
    return updatedTimeSheet as TimeReport;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la feuille de temps ${id}:`, error);
    toast.error("Erreur lors de la mise à jour de la feuille de temps");
    return null;
  }
};

// Supprimer une feuille de temps
export const deleteTimeSheet = async (id: string): Promise<boolean> => {
  try {
    console.log(`Suppression de la feuille de temps ${id}...`);
    
    await executeWithNetworkRetry(async () => {
      return await deleteDocument(TIME_SHEETS_COLLECTION, id);
    });
    
    console.log(`Feuille de temps ${id} supprimée avec succès`);
    toast.success('Feuille de temps supprimée avec succès');
    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la feuille de temps ${id}:`, error);
    toast.error("Erreur lors de la suppression de la feuille de temps");
    return false;
  }
};

// Approuver une feuille de temps
export const approveTimeSheet = async (id: string): Promise<TimeReport | null> => {
  try {
    console.log(`Approbation de la feuille de temps ${id}...`);
    
    const updatedTimeSheet = await executeWithNetworkRetry(async () => {
      return await updateDocument(TIME_SHEETS_COLLECTION, id, {
        status: 'Validé',
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    
    console.log(`Feuille de temps ${id} approuvée avec succès`);
    toast.success('Feuille de temps approuvée avec succès');
    return updatedTimeSheet as TimeReport;
  } catch (error) {
    console.error(`Erreur lors de l'approbation de la feuille de temps ${id}:`, error);
    toast.error("Erreur lors de l'approbation de la feuille de temps");
    return null;
  }
};

// Rejeter une feuille de temps
export const rejectTimeSheet = async (id: string, reason?: string): Promise<TimeReport | null> => {
  try {
    console.log(`Rejet de la feuille de temps ${id}...`);
    
    const updatedTimeSheet = await executeWithNetworkRetry(async () => {
      return await updateDocument(TIME_SHEETS_COLLECTION, id, {
        status: 'Rejeté',
        rejectionReason: reason || '',
        rejectedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    
    console.log(`Feuille de temps ${id} rejetée avec succès`);
    toast.success('Feuille de temps rejetée avec succès');
    return updatedTimeSheet as TimeReport;
  } catch (error) {
    console.error(`Erreur lors du rejet de la feuille de temps ${id}:`, error);
    toast.error("Erreur lors du rejet de la feuille de temps");
    return null;
  }
};

// Soumettre une feuille de temps (passer du statut "En cours" à "Soumis")
export const submitTimeSheet = async (id: string): Promise<TimeReport | null> => {
  try {
    console.log(`Soumission de la feuille de temps ${id}...`);
    
    const updatedTimeSheet = await executeWithNetworkRetry(async () => {
      return await updateDocument(TIME_SHEETS_COLLECTION, id, {
        status: 'Soumis',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    
    console.log(`Feuille de temps ${id} soumise avec succès`);
    toast.success('Feuille de temps soumise avec succès');
    return updatedTimeSheet as TimeReport;
  } catch (error) {
    console.error(`Erreur lors de la soumission de la feuille de temps ${id}:`, error);
    toast.error("Erreur lors de la soumission de la feuille de temps");
    return null;
  }
};
