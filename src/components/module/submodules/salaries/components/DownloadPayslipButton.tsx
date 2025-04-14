
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { PaySlip } from '@/types/payslip';
import { generatePayslipPDF } from '../utils/payslipPdfUtils';

interface DownloadPayslipButtonProps {
  payslip: PaySlip;
}

const DownloadPayslipButton: React.FC<DownloadPayslipButtonProps> = ({ payslip }) => {
  const handleDownload = () => {
    const doc = generatePayslipPDF(payslip);
    doc.save(`bulletin_de_paie_${payslip.employee.lastName.toLowerCase()}_${payslip.month?.toLowerCase()}_${payslip.year}.pdf`);
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <FileDown className="h-4 w-4 mr-2" />
      Télécharger PDF
    </Button>
  );
};

export default DownloadPayslipButton;
