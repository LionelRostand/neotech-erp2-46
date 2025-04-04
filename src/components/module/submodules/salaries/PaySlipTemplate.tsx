
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PaySlip } from '@/types/payslip';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PayslipHeader from './components/PayslipHeader';

interface PaySlipTemplateProps {
  payslip: PaySlip;
  onDownload?: () => void;
}

const PaySlipTemplate: React.FC<PaySlipTemplateProps> = ({ payslip, onDownload }) => {
  const payslipRef = useRef<HTMLDivElement>(null);
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };
  
  const handleDownloadPDF = () => {
    if (!payslipRef.current) return;
    
    const doc = new jsPDF();
    
    // Add company logo placeholder
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 15, 40, 20, 'F');
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('LOGO', 35, 25, { align: 'center' });
    
    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('BULLETIN DE PAIE', 105, 20, { align: 'center' });
    
    // Add subtitle with period
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`EN EUROS - ${payslip.period}`, 105, 25, { align: 'center' });
    
    // Add company info
    doc.setFontSize(10);
    doc.text(payslip.employerName, 140, 35);
    doc.text(payslip.employerAddress, 140, 40);
    doc.text(`SIRET: ${payslip.employerSiret}`, 140, 45);
    
    // Add employee info and header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Bonjour ${payslip.employee.firstName} ${payslip.employee.lastName}`, 20, 45);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Voici votre bulletin de paie de ${payslip.period}`, 20, 52);
    
    // Add employee details
    doc.text(`Employé: ${payslip.employee.firstName} ${payslip.employee.lastName}`, 20, 60);
    doc.text(`Poste: ${payslip.employee.role}`, 20, 65);
    doc.text(`N° SS: ${payslip.employee.socialSecurityNumber}`, 20, 70);
    doc.text(`Date d'embauche: ${payslip.employee.startDate}`, 20, 75);
    
    // Add salary summary
    doc.setFillColor(240, 248, 255);
    doc.rect(15, 85, 180, 50, 'F');
    
    doc.setFontSize(11);
    doc.text("Votre salaire avant impôt", 20, 95);
    doc.text(formatCurrency(payslip.grossSalary), 170, 95, { align: 'right' });
    doc.setFontSize(9);
    doc.text(`Prélèvement à la source (3,60 %)`, 20, 100);
    const taxAmount = payslip.grossSalary * 0.036;
    doc.text(formatCurrency(taxAmount), 170, 100, { align: 'right' });
    
    doc.setFontSize(11);
    doc.text("Votre salaire après impôt", 20, 110);
    doc.text(formatCurrency(payslip.netSalary), 170, 110, { align: 'right' });
    doc.setFontSize(9);
    doc.text(`Ce montant vous sera transféré le ${payslip.paymentDate}`, 20, 115);
    
    doc.setFontSize(11);
    doc.text("Votre montant net social", 20, 125);
    doc.text(formatCurrency(payslip.grossSalary - payslip.totalDeductions), 170, 125, { align: 'right' });
    doc.setFontSize(9);
    doc.text("Ce montant sert au calcul de vos aides sociales", 20, 130);
    
    // Add salary details table
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Calcul du salaire net", 20, 150);
    
    const salaryData: any[] = [];
    
    // Add earnings
    const earnings = payslip.details.filter(d => d.type === 'earning');
    earnings.forEach(item => {
      salaryData.push([
        item.label,
        item.base || '',
        item.rate || '',
        formatCurrency(item.amount)
      ]);
    });
    
    // Add total gross
    salaryData.push([
      'Rémunération brute',
      '',
      '',
      formatCurrency(payslip.grossSalary)
    ]);
    
    // Add deductions
    const deductions = payslip.details.filter(d => d.type === 'deduction');
    deductions.forEach(item => {
      salaryData.push([
        item.label,
        item.base || '',
        item.rate || '',
        `- ${formatCurrency(item.amount)}`
      ]);
    });
    
    // Add tax line
    salaryData.push([
      'Prélèvement à la source',
      '',
      '',
      `- ${formatCurrency(taxAmount)}`
    ]);
    
    // Add net to pay
    salaryData.push([
      'Net à payer',
      '',
      '',
      formatCurrency(payslip.netSalary)
    ]);
    
    doc.autoTable({
      startY: 155,
      head: [['Désignation', 'Base', 'Taux', 'Montant']],
      body: salaryData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [220, 230, 240], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    
    // Add leave balances
    const leaveY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Soldes de congés", 20, leaveY);
    
    const leaveData = [
      ['CP N-2', '5,00', '5,00', '0,00'],
      ['CP N-1', '25,00', '25,00', '0,00'],
      ['CP N', '18,75', '1,50', '17,25']
    ];
    
    doc.autoTable({
      startY: leaveY + 5,
      head: [['Type', 'Acquis', 'Pris', 'Solde']],
      body: leaveData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [220, 230, 240], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    
    // Add yearly totals
    const yearlyY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Cumuls DEPUIS JANV. 2023", 20, yearlyY);
    
    const yearlyData = [
      ['Salaire net imposable', formatCurrency(payslip.grossSalary * 11)],
      ['Salaire brut', formatCurrency(payslip.grossSalary * 12)],
      ['Prélèvement à la source', formatCurrency(taxAmount * 12)],
      ['Heures supplémentaires exonérées', formatCurrency(1079)],
      ['Temps travaillé', '333 h'],
    ];
    
    doc.autoTable({
      startY: yearlyY + 5,
      body: yearlyData,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    
    // Add QR Code placeholder
    const qrY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, qrY, 30, 30, 'F');
    doc.setFontSize(8);
    doc.text("Vérifiez l'intégrité du bulletin", 35, qrY + 10);
    doc.text("CODE DE VÉRIFICATION: " + Math.random().toString(36).substring(2, 8).toUpperCase(), 20, qrY + 35);
    
    // Add footer
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Dans votre intérêt et pour vous aider à faire valoir vos droits, conservez ce document sans limitation de durée.", 105, 280, { align: 'center' });
    
    // Save the PDF
    doc.save(`bulletin_de_paie_${payslip.period.replace(' ', '_')}.pdf`);
    
    if (onDownload) {
      onDownload();
    }
  };
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Bulletin de Paie</h2>
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleDownloadPDF}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Download className="mr-2 h-4 w-4" /> Télécharger PDF
        </Button>
      </div>
      
      <Card className="print:shadow-none" ref={payslipRef}>
        <CardContent className="p-8">
          <PayslipHeader onPrint={handleDownloadPDF} />
          
          {/* French Payslip Header */}
          <div className="flex justify-between items-start mb-10 pt-6 border-t">
            <div>
              <h2 className="text-2xl font-bold">BULLETIN DE PAIE</h2>
              <p className="text-gray-600">EN EUROS - {payslip.period}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{payslip.employerName}</p>
              <p className="text-sm text-gray-600">{payslip.employerAddress}</p>
              <p className="text-sm text-gray-600">SIRET: {payslip.employerSiret}</p>
            </div>
          </div>
          
          {/* Employee greeting */}
          <div className="bg-blue-50 p-6 rounded-lg mb-10">
            <h2 className="text-xl font-bold">Bonjour {payslip.employee.firstName} {payslip.employee.lastName}</h2>
            <p className="text-gray-600">Voici votre bulletin de paie de {payslip.period}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <h3 className="font-semibold">Votre salaire avant impôt</h3>
                <p className="text-xl font-bold">{formatCurrency(payslip.grossSalary)}</p>
                <p className="text-xs text-gray-500">Prélèvement à la source (3,60 %): {formatCurrency(payslip.grossSalary * 0.036)}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Votre salaire après impôt</h3>
                <p className="text-xl font-bold">{formatCurrency(payslip.netSalary)}</p>
                <p className="text-xs text-gray-500">Ce montant vous sera transféré le {payslip.paymentDate}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Votre montant net social</h3>
                <p className="text-xl font-bold">{formatCurrency(payslip.grossSalary - payslip.totalDeductions)}</p>
                <p className="text-xs text-gray-500">Ce montant sert au calcul de vos aides sociales</p>
              </div>
            </div>
          </div>
          
          {/* Salary details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold">Calcul du salaire net</h3>
              </div>
              
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td colSpan={2} className="py-2 font-medium">Rémunération brute</td>
                    <td className="py-2 text-right font-bold">{formatCurrency(payslip.grossSalary)}</td>
                  </tr>
                  
                  {payslip.details.filter(d => d.type === 'earning' && d.label !== 'Salaire de base').map((detail, index) => (
                    <tr key={`earning-${index}`} className="text-sm text-gray-600">
                      <td colSpan={2} className="py-1 pl-4">{detail.label}</td>
                      <td className="py-1 text-right">{formatCurrency(detail.amount)}</td>
                    </tr>
                  ))}
                  
                  <tr className="border-t border-b">
                    <td colSpan={2} className="py-2 font-medium">Cotisations et contributions salariales</td>
                    <td className="py-2 text-right text-red-600 font-medium">- {formatCurrency(payslip.totalDeductions)}</td>
                  </tr>
                  
                  {payslip.details.filter(d => d.type === 'deduction').map((detail, index) => (
                    <tr key={`deduction-${index}`} className="text-sm text-gray-600">
                      <td className="py-1 pl-4">{detail.label}</td>
                      <td className="py-1 text-gray-500 text-right pr-4">{detail.rate}</td>
                      <td className="py-1 text-right text-red-600">- {formatCurrency(detail.amount)}</td>
                    </tr>
                  ))}
                  
                  <tr className="border-t">
                    <td colSpan={2} className="py-2 font-medium">Prélèvement à la source</td>
                    <td className="py-2 text-right text-red-600 font-medium">- {formatCurrency(payslip.grossSalary * 0.036)}</td>
                  </tr>
                  
                  <tr className="border-t">
                    <td colSpan={2} className="py-3 font-bold">Net à payer</td>
                    <td className="py-3 text-right font-bold text-lg">{formatCurrency(payslip.netSalary)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              {/* Leave balances */}
              <div className="border rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-bold">Congés disponibles</h3>
                </div>
                
                <table className="w-full">
                  <thead>
                    <tr className="text-sm font-medium text-gray-700 border-b">
                      <th className="text-left py-2">Type</th>
                      <th className="text-center py-2">Acquis</th>
                      <th className="text-center py-2">Pris</th>
                      <th className="text-right py-2">Solde</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">CP N-2</td>
                      <td className="py-2 text-center">5,00</td>
                      <td className="py-2 text-center">5,00</td>
                      <td className="py-2 text-right font-bold">0,00</td>
                    </tr>
                    <tr>
                      <td className="py-2">CP N-1</td>
                      <td className="py-2 text-center">25,00</td>
                      <td className="py-2 text-center">25,00</td>
                      <td className="py-2 text-right font-bold">0,00</td>
                    </tr>
                    <tr>
                      <td className="py-2">CP N</td>
                      <td className="py-2 text-center">18,75</td>
                      <td className="py-2 text-center">1,50</td>
                      <td className="py-2 text-right font-bold">17,25</td>
                    </tr>
                    <tr className="border-t">
                      <td colSpan={3} className="py-2 font-medium">Total congés disponibles</td>
                      <td className="py-2 text-right font-bold">17,25</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Yearly totals */}
              <div className="border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-bold">Cumuls DEPUIS JANV. 2023</h3>
                </div>
                
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="py-2">Salaire net imposable</td>
                      <td className="py-2 text-right font-bold">{formatCurrency(payslip.grossSalary * 11)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Salaire brut</td>
                      <td className="py-2 text-right">{formatCurrency(payslip.grossSalary * 12)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Prélèvement à la source</td>
                      <td className="py-2 text-right">{formatCurrency(payslip.grossSalary * 0.036 * 12)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Heures supplémentaires exonérées</td>
                      <td className="py-2 text-right">{formatCurrency(1079)}</td>
                    </tr>
                    <tr>
                      <td className="py-2">Temps travaillé</td>
                      <td className="py-2 text-right">333 h</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Footer / QR Code */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t">
            <div className="flex items-start">
              <div className="bg-gray-200 w-24 h-24 flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">Vérifiez l'intégrité du bulletin</p>
                <p className="text-xs font-mono mt-2">CODE DE VÉRIFICATION: {Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">Dans votre intérêt et pour vous aider à faire valoir vos droits,</p>
              <p className="text-xs text-gray-500">conservez ce document sans limitation de durée</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaySlipTemplate;
