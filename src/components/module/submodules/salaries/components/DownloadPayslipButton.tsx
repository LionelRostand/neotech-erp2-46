
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { PaySlip } from '@/types/payslip';
import { generatePayslipPDF } from '../utils/payslipPdfUtils';
import { toast } from 'sonner';
import { addEmployeeDocument } from '../../employees/services/documentService';

interface DownloadPayslipButtonProps {
  payslip: PaySlip;
}

const DownloadPayslipButton: React.FC<DownloadPayslipButtonProps> = ({ payslip }) => {
  const handleDownload = async () => {
    try {
      // Generate PDF document
      const doc = generatePayslipPDF(payslip);
      
      // Get PDF as base64 string for storage
      const pdfBase64 = doc.output('datauristring');
      
      // Save PDF file
      doc.save(`bulletin_de_paie_${payslip.employee.lastName.toLowerCase()}_${payslip.month?.toLowerCase()}_${payslip.year}.pdf`);
      
      // Add document to employee's profile if employeeId exists
      if (payslip.employeeId) {
        const documentData = {
          id: `payslip_${payslip.id || new Date().getTime()}`,
          name: `Bulletin de paie - ${payslip.month} ${payslip.year}`,
          type: 'Fiche de paie',
          date: new Date().toISOString(),
          fileType: 'application/pdf',
          fileData: pdfBase64,
          employeeId: payslip.employeeId
        };

        await addEmployeeDocument(payslip.employeeId, documentData);
        toast.success('Fiche de paie téléchargée et ajoutée aux documents de l\'employé');
      } else {
        toast.success('Fiche de paie téléchargée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de la fiche de paie:', error);
      toast.error('Erreur lors du téléchargement de la fiche de paie');
    }
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <FileDown className="h-4 w-4 mr-2" />
      Télécharger PDF
    </Button>
  );
};

export default DownloadPayslipButton;
