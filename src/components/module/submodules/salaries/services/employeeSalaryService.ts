import { updateDocument } from '@/hooks/firestore/update-operations';
import { getDocumentById, getAllDocuments } from '@/hooks/firestore/read-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';
import { Employee } from '@/types/employee';
import { toast } from 'sonner';

// Fonction pour associer une fiche de paie à un employé
export const addPayslipToEmployee = async (employeeId: string, payslipId: string): Promise<boolean> => {
  try {
    console.log(`Association de la fiche de paie ${payslipId} à l'employé ${employeeId}...`);
    
    // Récupérer d'abord l'employé pour obtenir ses fiches de paie existantes
    const employeeData = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.HR.EMPLOYEES, employeeId);
    }) as Employee | null;
    
    if (!employeeData) {
      console.error(`Employé ${employeeId} non trouvé`);
      toast.error(`Employé non trouvé dans la base de données`);
      return false;
    }
    
    // Créer ou mettre à jour le tableau des fiches de paie
    const payslips = employeeData.payslips || [];
    
    // Vérifier si la fiche de paie est déjà associée
    if (!payslips.includes(payslipId)) {
      payslips.push(payslipId);
    }
    
    // Mettre à jour l'employé
    await executeWithNetworkRetry(async () => {
      return await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, { payslips });
    });
    
    console.log(`Fiche de paie ${payslipId} associée avec succès à l'employé ${employeeId}`);
    toast.success(`Fiche de paie associée avec succès`);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'association de la fiche de paie:", error);
    toast.error("Erreur lors de la mise à jour des données de l'employé");
    return false;
  }
};

// Fonction pour mettre à jour le salaire de base d'un employé
export const updateEmployeeBaseSalary = async (employeeId: string, baseSalary: number): Promise<boolean> => {
  try {
    console.log(`Mise à jour du salaire de base de l'employé ${employeeId} à ${baseSalary}€...`);
    
    await executeWithNetworkRetry(async () => {
      return await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, { baseSalary });
    });
    
    console.log(`Salaire de base de l'employé ${employeeId} mis à jour avec succès`);
    toast.success(`Salaire de base mis à jour avec succès`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du salaire de base:", error);
    toast.error("Erreur lors de la mise à jour du salaire de base");
    return false;
  }
};

// Fonction pour récupérer l'historique des salaires d'un employé
export const getEmployeeSalaryHistory = async (employeeId: string): Promise<any[]> => {
  try {
    console.log(`Récupération de l'historique des salaires de l'employé ${employeeId}...`);
    
    // D'abord récupérer l'employé pour obtenir ses références de fiches de paie
    const employeeData = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.HR.EMPLOYEES, employeeId);
    }) as Employee | null;
    
    if (!employeeData || !employeeData.payslips || employeeData.payslips.length === 0) {
      console.log(`Aucune fiche de paie trouvée pour l'employé ${employeeId}`);
      return [];
    }
    
    // Récupérer chaque fiche de paie référencée
    const salaryHistory = [];
    
    for (const payslipId of employeeData.payslips) {
      const payslip = await executeWithNetworkRetry(async () => {
        return await getDocumentById(COLLECTIONS.DOCUMENT_COLLECTIONS.DOCUMENTS, payslipId);
      });
      
      if (payslip && (payslip as any).documentType === 'payslip') {
        salaryHistory.push(payslip);
      }
    }
    
    console.log(`${salaryHistory.length} fiches de paie récupérées pour l'employé ${employeeId}`);
    return salaryHistory;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des salaires:", error);
    toast.error("Erreur lors du chargement de l'historique des salaires");
    return [];
  }
};

// Fonction pour récupérer toutes les fiches de paie par entreprise
export const getPayslipsByCompany = async (companyId: string): Promise<any[]> => {
  try {
    console.log(`Récupération des fiches de paie pour l'entreprise ${companyId}...`);
    
    // Récupérer les employés de cette entreprise
    const companyEmployees = await executeWithNetworkRetry(async () => {
      const allEmployees = await getAllDocuments(COLLECTIONS.HR.EMPLOYEES);
      return allEmployees.filter(emp => (emp as any).company === companyId);
    }) as Employee[];
    
    if (!companyEmployees || companyEmployees.length === 0) {
      console.log(`Aucun employé trouvé pour l'entreprise ${companyId}`);
      return [];
    }
    
    // Collecter les IDs des fiches de paie de tous les employés
    const payslipIds: string[] = [];
    companyEmployees.forEach(employee => {
      if (employee.payslips && employee.payslips.length > 0) {
        payslipIds.push(...employee.payslips);
      }
    });
    
    if (payslipIds.length === 0) {
      return [];
    }
    
    // Récupérer toutes les fiches de paie
    const payslips = await executeWithNetworkRetry(async () => {
      const allPayslips = await getAllDocuments(COLLECTIONS.DOCUMENT_COLLECTIONS.DOCUMENTS);
      return allPayslips.filter(doc => 
        (doc as any).documentType === 'payslip' && 
        payslipIds.includes(doc.id)
      );
    });
    
    console.log(`${payslips.length} fiches de paie récupérées pour l'entreprise ${companyId}`);
    return payslips;
  } catch (error) {
    console.error(`Erreur lors de la récupération des fiches de paie pour l'entreprise ${companyId}:`, error);
    toast.error("Erreur lors du chargement des fiches de paie");
    return [];
  }
};

// Fonction pour vérifier les permissions de l'utilisateur sur la gestion des salaires
export const checkSalaryPermissions = async (userId: string): Promise<boolean> => {
  try {
    // Récupérer les permissions de l'utilisateur depuis la collection USER_PERMISSIONS
    const userPermissions = await executeWithNetworkRetry(async () => {
      return await getDocumentById(COLLECTIONS.USER_PERMISSIONS, userId);
    });
    
    if (!userPermissions) {
      console.log(`Aucune permission trouvée pour l'utilisateur ${userId}`);
      return false;
    }
    
    // Vérifier si l'utilisateur a accès aux données de salaire
    const canAccessSalaries = (userPermissions as any).permissions?.salaries?.view || false;
    const canModifySalaries = (userPermissions as any).permissions?.salaries?.modify || false;
    
    console.log(`Permissions de l'utilisateur ${userId} pour les salaires:`, { 
      canAccessSalaries, 
      canModifySalaries 
    });
    
    return canAccessSalaries;
  } catch (error) {
    console.error(`Erreur lors de la vérification des permissions pour l'utilisateur ${userId}:`, error);
    return false;
  }
};
