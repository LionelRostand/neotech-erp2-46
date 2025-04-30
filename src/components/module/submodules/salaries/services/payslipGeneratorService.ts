
import { PaySlip } from '@/types/payslip';
import { generatePayslipPdf } from '../utils/payslipPdfUtils';
import { addEmployeeDocument } from '../../employees/services/documentService';
import { savePaySlip } from './payslipService';
import { toast } from 'sonner';
import { addPayslipToEmployee } from './employeeSalaryService';

export const generateAndSavePayslip = async (payslipData: PaySlip): Promise<boolean> => {
  try {
    // Ensure employee data is properly formatted before saving
    const sanitizedPayslipData = {
      ...payslipData,
      // Make sure the employee object is valid
      employee: {
        ...(payslipData.employee || {}),
        firstName: payslipData.employee?.firstName || '',
        lastName: payslipData.employee?.lastName || '',
        employeeId: payslipData.employee?.employeeId || payslipData.employeeId || '',
        role: payslipData.employee?.role || 'Employé', // Provide default value
        socialSecurityNumber: payslipData.employee?.socialSecurityNumber || '',
        startDate: payslipData.employee?.startDate || '',
      },
      status: 'Généré'
    };

    // 1. Sauvegarder la fiche de paie dans Firestore
    const savedPayslip = await savePaySlip(sanitizedPayslipData);

    if (!savedPayslip) {
      throw new Error('Erreur lors de la sauvegarde de la fiche de paie');
    }

    // 2. Générer le PDF
    const doc = generatePayslipPdf({
      ...sanitizedPayslipData,
      employerName: sanitizedPayslipData.employerName || 'Entreprise',
      employerAddress: sanitizedPayslipData.employerAddress || 'N/A',
      employerSiret: sanitizedPayslipData.employerSiret || 'N/A'
    });
    
    const pdfBase64 = doc.output('datauristring');

    // 3. Construire le nom du fichier
    const formattedMonth = sanitizedPayslipData.month?.toLowerCase() || 'periode';
    const year = sanitizedPayslipData.year || new Date().getFullYear();
    const employeeName = sanitizedPayslipData.employee?.lastName?.toLowerCase() || 'employe';
    const fileName = `bulletin_de_paie_${employeeName}_${formattedMonth}_${year}.pdf`;

    // 4. Sauvegarder dans les documents de l'employé
    if (sanitizedPayslipData.employeeId) {
      const documentData = {
        id: `payslip_${savedPayslip.id}`,
        name: `Bulletin de paie - ${sanitizedPayslipData.period}`,
        type: 'Fiche de paie',
        date: new Date().toISOString(),
        fileType: 'application/pdf',
        fileData: pdfBase64,
        employeeId: sanitizedPayslipData.employeeId,
        status: 'Généré'
      };

      // Ajouter le document à l'employé
      await addEmployeeDocument(sanitizedPayslipData.employeeId, documentData);
      
      // 5. Ajouter l'ID de la fiche de paie à l'employé
      if (savedPayslip.id) {
        await addPayslipToEmployee(sanitizedPayslipData.employeeId, savedPayslip.id);
      }
    }

    // 6. Sauvegarder le PDF localement
    doc.save(fileName);

    toast.success('Fiche de paie générée et enregistrée avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération de la fiche de paie:', error);
    toast.error('Erreur lors de la génération de la fiche de paie');
    return false;
  }
};
