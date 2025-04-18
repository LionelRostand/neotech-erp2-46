
import { PaySlip } from '@/types/payslip';
import { generatePayslipPdf } from '../utils/payslipPdfUtils';
import { addEmployeeDocument } from '../../employees/services/documentService';
import { savePaySlip } from './payslipService';
import { toast } from 'sonner';

export const generateAndSavePayslip = async (payslipData: PaySlip): Promise<boolean> => {
  try {
    // 1. Sauvegarder la fiche de paie dans Firestore
    const savedPayslip = await savePaySlip({
      ...payslipData,
      status: 'Généré',
      date: new Date().toISOString()
    });

    if (!savedPayslip) {
      throw new Error('Erreur lors de la sauvegarde de la fiche de paie');
    }

    // 2. Générer le PDF
    const doc = generatePayslipPdf(payslipData);
    const pdfBase64 = doc.output('datauristring');

    // 3. Construire le nom du fichier
    const formattedMonth = payslipData.month?.toLowerCase() || 'periode';
    const year = payslipData.year || new Date().getFullYear();
    const employeeName = payslipData.employee.lastName.toLowerCase();
    const fileName = `bulletin_de_paie_${employeeName}_${formattedMonth}_${year}.pdf`;

    // 4. Sauvegarder dans les documents de l'employé
    if (payslipData.employeeId) {
      const documentData = {
        id: `payslip_${savedPayslip.id}`,
        name: `Bulletin de paie - ${payslipData.period}`,
        type: 'Fiche de paie',
        date: new Date().toISOString(),
        fileType: 'application/pdf',
        fileData: pdfBase64,
        employeeId: payslipData.employeeId
      };

      await addEmployeeDocument(payslipData.employeeId, documentData);
    }

    // 5. Sauvegarder le PDF localement
    doc.save(fileName);

    toast.success('Fiche de paie générée et enregistrée avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération de la fiche de paie:', error);
    toast.error('Erreur lors de la génération de la fiche de paie');
    return false;
  }
};
