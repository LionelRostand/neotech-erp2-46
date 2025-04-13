
import { toast } from 'sonner';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Met à jour le solde de congés d'un employé
 * @param employeeId Identifiant de l'employé
 * @param leaveType Type de congé (RTT, Congés payés, etc.)
 * @param days Nombre de jours à déduire
 * @returns Promise<boolean> Succès ou échec de l'opération
 */
export const updateLeaveBalance = async (
  employeeId: string,
  leaveType: string,
  days: number
): Promise<boolean> => {
  try {
    console.log(`Mise à jour du solde pour l'employé ${employeeId}: ${days} jour(s) de ${leaveType}`);
    
    // Déterminer le type de congé normalisé
    let normalizedType = '';
    
    if (leaveType.toLowerCase().includes('rtt')) {
      normalizedType = 'RTT';
    } else if (
      leaveType.toLowerCase().includes('congé payé') || 
      leaveType.toLowerCase().includes('cp')
    ) {
      normalizedType = 'Congés payés';
    } else if (leaveType.toLowerCase().includes('maladie')) {
      normalizedType = 'Congé maladie';
    } else if (leaveType.toLowerCase().includes('exceptionnel')) {
      normalizedType = 'Congé exceptionnel';
    } else {
      normalizedType = 'Congés payés'; // Par défaut
    }
    
    // Dans une application réelle, vous feriez une requête API pour mettre à jour le solde
    // Simulons une requête asynchrone
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log(`Solde mis à jour: ${days} jour(s) de ${normalizedType} déduit(s)`);
    
    // Dans une vraie application, mettre à jour la base de données ici
    // Exemple: await updateLeaveBalanceInDatabase(employeeId, normalizedType, days);
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du solde de congés:", error);
    toast.error("Erreur lors de la mise à jour du solde de congés");
    return false;
  }
};

/**
 * Vérifie si un employé a suffisamment de jours de congés restants
 * @param employeeId Identifiant de l'employé
 * @param leaveType Type de congé
 * @param requestedDays Nombre de jours demandés
 * @returns Promise<boolean> True si suffisant, false sinon
 */
export const hasEnoughLeaveBalance = async (
  employeeId: string,
  leaveType: string,
  requestedDays: number
): Promise<boolean> => {
  try {
    // Dans une application réelle, vous récupéreriez le solde actuel depuis la base de données
    // Pour l'instant, simulons cette vérification
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulons une vérification (dans une vraie application, cette valeur viendrait de la BDD)
    const hasEnough = true; // À remplacer par une vraie vérification
    
    return hasEnough;
  } catch (error) {
    console.error("Erreur lors de la vérification du solde de congés:", error);
    return false;
  }
};

/**
 * Valide une demande d'absence
 * @param absenceId Identifiant de l'absence à valider
 * @returns Promise<boolean> Succès ou échec de l'opération
 */
export const validateAbsence = async (absenceId: string): Promise<boolean> => {
  try {
    const firestoreClient = new useFirestore(COLLECTIONS.HR.ABSENCE_REQUESTS);
    
    await firestoreClient.update(absenceId, {
      status: 'approved',
      approvedAt: new Date().toISOString()
    });
    
    console.log(`Absence ${absenceId} validée avec succès`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la validation de l'absence:", error);
    return false;
  }
};

/**
 * Rejette une demande d'absence
 * @param absenceId Identifiant de l'absence à rejeter
 * @returns Promise<boolean> Succès ou échec de l'opération
 */
export const rejectAbsence = async (absenceId: string): Promise<boolean> => {
  try {
    const firestoreClient = new useFirestore(COLLECTIONS.HR.ABSENCE_REQUESTS);
    
    await firestoreClient.update(absenceId, {
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    });
    
    console.log(`Absence ${absenceId} rejetée avec succès`);
    return true;
  } catch (error) {
    console.error("Erreur lors du rejet de l'absence:", error);
    return false;
  }
};
