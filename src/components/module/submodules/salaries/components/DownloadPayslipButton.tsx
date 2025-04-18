
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { PaySlip } from '@/types/payslip';
import { generatePayslipPdf } from '../utils/payslipPdfUtils';
import { toast } from 'sonner';
import { addEmployeeDocument } from '../../employees/services/documentService';

interface DownloadPayslipButtonProps {
  payslip: PaySlip;
}

const DownloadPayslipButton: React.FC<DownloadPayslipButtonProps> = ({ payslip }) => {
  const handleDownload = async () => {
    try {
      console.log('Données de la fiche de paie pour PDF:', payslip);
      
      // Enrichissement des données de congés si manquantes
      if (!payslip.conges) {
        payslip.conges = {
          acquired: 2.5, // 2.5 jours par mois en France
          taken: 0,
          balance: 2.5
        };
      }
      
      if (!payslip.rtt) {
        payslip.rtt = {
          acquired: 1, // 1 jour par mois en moyenne
          taken: 0,
          balance: 1
        };
      }
      
      // Vérifier la présence des données essentielles
      if (!payslip.employeeName) {
        throw new Error('Les informations de l\'employé sont manquantes');
      }
      
      // Construction du nom de fichier français
      const formattedPeriod = payslip.period?.toLowerCase() || 'periode';
      const employeeName = payslip.employeeName.replace(' ', '_').toLowerCase();
      const fileName = `bulletin_de_paie_${employeeName}_${formattedPeriod}.pdf`;
      
      // Génération du PDF selon le format français
      const doc = generatePayslipPdf(payslip);
      
      // Obtenir le PDF en Base64 pour le stockage
      const pdfBase64 = doc.output('datauristring');
      
      // Enregistrement du fichier PDF
      doc.save(fileName);
      
      // Ajout du document au profil de l'employé si l'ID de l'employé existe
      if (payslip.employeeId) {
        const documentData = {
          name: `Bulletin de paie - ${payslip.period}`,
          type: 'Fiche de paie',
          date: payslip.date || new Date().toISOString(),
          fileType: 'application/pdf',
          fileData: pdfBase64,
          employeeId: payslip.employeeId
        };

        await addEmployeeDocument(payslip.employeeId, documentData);
        toast.success('Bulletin de paie téléchargé et ajouté aux documents de l\'employé');
      } else {
        toast.success('Bulletin de paie téléchargé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de la fiche de paie:', error);
      let errorMessage = 'Erreur lors du téléchargement de la fiche de paie';
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      
      toast.error(errorMessage);
    }
  };

  return (
    <Button onClick={handleDownload} variant="ghost" size="icon">
      <FileDown className="h-4 w-4" />
      <span className="sr-only">Télécharger PDF</span>
    </Button>
  );
};

export default DownloadPayslipButton;
