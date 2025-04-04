
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PaySlip } from '@/types/payslip';
import PayslipHeader from './PayslipHeader';
import EmployeeInfoSection from './EmployeeInfoSection';
import CompanyInfoSection from './CompanyInfoSection';
import SalaryCompositionCard from './SalaryCompositionCard';
import LeaveBalanceCard from './LeaveBalanceCard';
import CumulativeInfoCard from './CumulativeInfoCard';
import VerificationFooter from './VerificationFooter';
import { toast } from 'sonner';
import 'jspdf-autotable';

interface PayslipViewerProps {
  payslip: PaySlip;
  onClose?: () => void;
}

const PayslipViewer: React.FC<PayslipViewerProps> = ({ payslip, onClose }) => {
  const payslipRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (payslipRef.current) {
      window.print();
    }
  };

  const handleDownload = () => {
    if (payslipRef.current) {
      const doc = new jsPDF();
      
      // Add company header
      doc.setFontSize(12);
      doc.text("BULLETIN DE PAIE", 105, 15, { align: 'center' });
      doc.text(payslip.employerName, 15, 25);
      doc.text(payslip.employerAddress, 15, 30);
      doc.text(`SIRET: ${payslip.employerSiret}`, 15, 35);
      
      // Add employee info
      doc.text(`Employé: ${payslip.employee.firstName} ${payslip.employee.lastName}`, 15, 45);
      doc.text(`Numéro SS: ${payslip.employee.socialSecurityNumber}`, 15, 50);
      doc.text(`Poste: ${payslip.employee.role}`, 15, 55);
      doc.text(`Période: ${payslip.period}`, 15, 60);
      
      // Add salary details
      doc.text(`Salaire brut: ${payslip.grossSalary.toFixed(2)} €`, 15, 70);
      
      // Add salary details table
      const earningsRows = payslip.details
        .filter(detail => detail.type === 'earning')
        .map(detail => [
          detail.label,
          detail.base || '',
          detail.rate || '',
          `${detail.amount.toFixed(2)} €`
        ]);
      
      const deductionsRows = payslip.details
        .filter(detail => detail.type === 'deduction')
        .map(detail => [
          detail.label,
          detail.base || '',
          detail.rate || '',
          `${detail.amount.toFixed(2)} €`
        ]);
      
      // Earnings table
      doc.text("Rubriques de paie", 15, 80);
      doc.autoTable({
        startY: 85,
        head: [['Libellé', 'Base', 'Taux', 'Montant']],
        body: earningsRows,
        theme: 'plain',
        headStyles: { fillColor: [240, 240, 240] }
      });
      
      // Deductions table
      doc.text("Cotisations et contributions sociales", 15, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Libellé', 'Base', 'Taux', 'Montant']],
        body: deductionsRows,
        theme: 'plain',
        headStyles: { fillColor: [240, 240, 240] }
      });
      
      // Summary
      doc.text(`Total des cotisations: ${payslip.totalDeductions.toFixed(2)} €`, 15, doc.lastAutoTable.finalY + 10);
      doc.text(`Net à payer: ${payslip.netSalary.toFixed(2)} €`, 15, doc.lastAutoTable.finalY + 15);
      
      // Leave balances
      if (payslip.conges) {
        doc.text("Congés et RTT", 15, doc.lastAutoTable.finalY + 25);
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 30,
          head: [['Type', 'Acquis', 'Pris', 'Solde']],
          body: [
            ['Congés payés', payslip.conges.acquired, payslip.conges.taken, payslip.conges.balance],
            ['RTT', payslip.rtt?.acquired || 0, payslip.rtt?.taken || 0, payslip.rtt?.balance || 0]
          ],
          theme: 'plain',
          headStyles: { fillColor: [240, 240, 240] }
        });
      }
      
      // Annual cumulative info
      if (payslip.annualCumulative) {
        doc.text("Cumul annuel", 15, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
          startY: doc.lastAutoTable.finalY + 15,
          body: [
            ['Brut imposable', `${payslip.annualCumulative.grossSalary.toFixed(2)} €`],
            ['Net imposable', `${payslip.annualCumulative.taxableIncome.toFixed(2)} €`],
            ['Net payé', `${payslip.annualCumulative.netSalary.toFixed(2)} €`]
          ],
          theme: 'plain'
        });
      }
      
      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.text("Document à conserver sans limitation de durée", 105, pageHeight - 10, { align: 'center' });
      
      // Save the PDF
      doc.save(`Bulletin_de_paie_${payslip.period.replace(/\s/g, '_')}.pdf`);
      
      toast.success("Bulletin de paie téléchargé avec succès!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="print:hidden mb-4 flex justify-between">
        <h2 className="text-2xl font-bold">Bulletin de Paie</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          )}
        </div>
      </div>

      <Card className="p-6" ref={payslipRef}>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex justify-between">
            <CompanyInfoSection 
              name={payslip.employerName}
              address={payslip.employerAddress}
              siret={payslip.employerSiret}
            />
            <EmployeeInfoSection 
              firstName={payslip.employee.firstName}
              lastName={payslip.employee.lastName}
              role={payslip.employee.role}
              socialSecurityNumber={payslip.employee.socialSecurityNumber}
              period={payslip.period}
              startDate={payslip.employee.startDate}
              hoursWorked={payslip.hoursWorked}
            />
          </div>
          
          <SalaryCompositionCard 
            details={payslip.details}
            grossSalary={payslip.grossSalary}
            totalDeductions={payslip.totalDeductions}
            netSalary={payslip.netSalary}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payslip.conges && (
              <LeaveBalanceCard 
                conges={payslip.conges}
                rtt={payslip.rtt}
              />
            )}
            
            {payslip.annualCumulative && (
              <CumulativeInfoCard 
                annualCumulative={payslip.annualCumulative}
              />
            )}
          </div>
          
          <VerificationFooter />
        </div>
      </Card>
    </div>
  );
};

export default PayslipViewer;
