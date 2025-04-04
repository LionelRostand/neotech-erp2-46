
import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { PaySlip } from '@/types/payslip';
import { FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import DownloadButton from './components/DownloadButton';
import PayslipHeader from './components/PayslipHeader';

interface PaySlipTemplateProps {
  payslip: PaySlip;
}

const PaySlipTemplate: React.FC<PaySlipTemplateProps> = ({ payslip }) => {
  const payslipRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!payslipRef.current) return;
    
    const doc = new jsPDF();
    
    // Configuration du document
    doc.setFont('helvetica');
    doc.setFontSize(10);
    
    // En-tête - Informations de l'entreprise
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("BULLETIN DE PAIE", 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Logo placeholder (on n'affiche pas le nom de l'entreprise comme demandé)
    doc.rect(14, 20, 30, 15);
    doc.setFontSize(8);
    doc.text("LOGO", 29, 28, { align: 'center' });
    
    // Informations employeur
    doc.setFontSize(9);
    doc.text("Adresse:", 140, 22);
    doc.text(payslip.employerAddress, 140, 26);
    doc.text("SIRET: " + payslip.employerSiret, 140, 30);
    
    // Informations employé
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("INFORMATIONS SALARIÉ", 14, 45);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Nom, Prénom: ${payslip.employee.lastName} ${payslip.employee.firstName}`, 14, 52);
    doc.text(`Emploi: ${payslip.employee.role}`, 14, 57);
    doc.text(`N° SS: ${payslip.employee.socialSecurityNumber}`, 14, 62);
    doc.text(`Date d'entrée: ${payslip.employee.startDate}`, 14, 67);
    
    // Période et date de paiement
    doc.text(`Période: ${payslip.period}`, 120, 52);
    doc.text(`Date de paiement: ${payslip.paymentDate}`, 120, 57);
    doc.text(`Heures travaillées: ${payslip.hoursWorked.toFixed(2)}h`, 120, 62);
    
    // Rubriques de paie
    doc.setFont('helvetica', 'bold');
    doc.text("RUBRIQUES", 14, 80);
    doc.text("BASE", 100, 80);
    doc.text("TAUX", 125, 80);
    doc.text("MONTANT (€)", 170, 80);
    
    // Ligne de séparation
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 83, 195, 83);
    
    // Salaires et cotisations
    let y = 88;
    doc.setFont('helvetica', 'normal');
    
    // Grouper par type (gains puis déductions)
    const earnings = payslip.details.filter(detail => detail.type === 'earning');
    const deductions = payslip.details.filter(detail => detail.type === 'deduction');
    
    // Afficher les gains
    doc.setFont('helvetica', 'bold');
    doc.text("SALAIRE", 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    
    earnings.forEach(item => {
      doc.text(item.label, 14, y);
      doc.text(item.base || '', 100, y);
      doc.text(item.rate || '', 125, y);
      doc.text(item.amount.toFixed(2), 170, y, { align: 'right' });
      y += 5;
    });
    
    y += 2;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("TOTAL BRUT", 14, y);
    doc.text(payslip.grossSalary.toFixed(2), 170, y, { align: 'right' });
    y += 8;
    
    // Afficher les déductions
    doc.setFont('helvetica', 'bold');
    doc.text("COTISATIONS ET CONTRIBUTIONS SOCIALES", 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    
    deductions.forEach(item => {
      doc.text(item.label, 14, y);
      doc.text(item.base || '', 100, y);
      doc.text(item.rate || '', 125, y);
      doc.text(item.amount.toFixed(2), 170, y, { align: 'right' });
      y += 5;
    });
    
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.text("TOTAL COTISATIONS", 14, y);
    doc.text(payslip.totalDeductions.toFixed(2), 170, y, { align: 'right' });
    y += 8;
    
    // Net à payer
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("NET À PAYER", 14, y);
    doc.text(payslip.netSalary.toFixed(2) + " €", 170, y, { align: 'right' });
    y += 8;
    
    // Congés et RTT
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("CONGÉS ET ABSENCES", 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    
    // Droits à congés (exemple de données)
    const congesAcquis = 2.5;
    const congesPris = 0;
    const congesRestants = 25;
    const rttAcquis = 1;
    const rttPris = 0;
    const rttRestants = 9;
    
    doc.text("Congés payés acquis période:", 14, y);
    doc.text(congesAcquis.toFixed(2) + " jours", 100, y, { align: 'right' });
    y += 5;
    doc.text("Congés payés pris période:", 14, y);
    doc.text(congesPris.toFixed(2) + " jours", 100, y, { align: 'right' });
    y += 5;
    doc.text("Solde congés payés:", 14, y);
    doc.text(congesRestants.toFixed(2) + " jours", 100, y, { align: 'right' });
    y += 5;
    
    // RTT
    doc.text("RTT acquis période:", 14, y);
    doc.text(rttAcquis.toFixed(2) + " jours", 100, y, { align: 'right' });
    y += 5;
    doc.text("RTT pris période:", 14, y);
    doc.text(rttPris.toFixed(2) + " jours", 100, y, { align: 'right' });
    y += 5;
    doc.text("Solde RTT:", 14, y);
    doc.text(rttRestants.toFixed(2) + " jours", 100, y, { align: 'right' });
    y += 8;
    
    // Cumuls annuels
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("CUMULS ANNUELS", 14, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    
    // Données de cumul (exemples)
    const cumulBrut = payslip.grossSalary * 9;
    const cumulNet = payslip.netSalary * 9;
    const cumulImposable = payslip.netSalary * 0.93 * 9; // Exemple de calcul
    
    doc.text("Brut annuel:", 14, y);
    doc.text(cumulBrut.toFixed(2) + " €", 100, y, { align: 'right' });
    y += 5;
    doc.text("Net annuel:", 14, y);
    doc.text(cumulNet.toFixed(2) + " €", 100, y, { align: 'right' });
    y += 5;
    doc.text("Net imposable annuel:", 14, y);
    doc.text(cumulImposable.toFixed(2) + " €", 100, y, { align: 'right' });
    
    // Pied de page
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text("* Ce bulletin de paie est un document à conserver sans limitation de durée", 105, pageHeight - 10, { align: 'center' });
    
    // Enregistrer le document PDF
    doc.save(`bulletin-de-paie-${payslip.period.replace(/\s+/g, '-')}.pdf`);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  // Calculer le cumul imposable pour l'affichage
  const imposable = payslip.netSalary * 0.93; // Exemple de calcul simplifié
  
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Actions buttons */}
      <div className="flex justify-end gap-2 print:hidden">
        <DownloadButton onClick={handleDownloadPDF} />
      </div>
      
      {/* Preview Card */}
      <Card className="p-6 print:shadow-none print:border-0" ref={payslipRef}>
        {/* Header */}
        <PayslipHeader onPrint={handlePrint} />
        
        {/* Enterprise Information */}
        <div className="flex justify-between items-start mb-6 mt-4 print:mt-0">
          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 flex items-center justify-center">
            <FileText className="h-12 w-12 text-gray-300" />
            <span className="sr-only">Logo entreprise</span>
          </div>
          <div className="text-right">
            <p className="font-bold">Entreprise</p>
            <p className="text-sm">{payslip.employerAddress}</p>
            <p className="text-sm">SIRET: {payslip.employerSiret}</p>
          </div>
        </div>
        
        {/* Employee and period information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b">
          <div>
            <h3 className="font-bold mb-2 uppercase text-gray-600 text-sm">Informations salarié</h3>
            <p><span className="font-medium">Nom, Prénom:</span> {payslip.employee.lastName} {payslip.employee.firstName}</p>
            <p><span className="font-medium">Emploi:</span> {payslip.employee.role}</p>
            <p><span className="font-medium">N° SS:</span> {payslip.employee.socialSecurityNumber}</p>
            <p><span className="font-medium">Date d'entrée:</span> {payslip.employee.startDate}</p>
          </div>
          <div>
            <h3 className="font-bold mb-2 uppercase text-gray-600 text-sm">Période de paie</h3>
            <p><span className="font-medium">Période:</span> {payslip.period}</p>
            <p><span className="font-medium">Date de paiement:</span> {payslip.paymentDate}</p>
            <p><span className="font-medium">Heures travaillées:</span> {payslip.hoursWorked.toFixed(2)}h</p>
          </div>
        </div>
        
        {/* Payslip details */}
        <div className="mb-6">
          <h3 className="font-bold mb-2 uppercase text-gray-600 text-sm">Détail des rubriques</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Rubrique</th>
                  <th className="text-right px-2 py-2">Base</th>
                  <th className="text-right px-2 py-2">Taux</th>
                  <th className="text-right py-2">Montant (€)</th>
                </tr>
              </thead>
              <tbody>
                {/* Earnings section */}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="py-2 font-bold">RÉMUNÉRATION</td>
                </tr>
                {payslip.details
                  .filter(detail => detail.type === 'earning')
                  .map((detail, index) => (
                    <tr key={`earning-${index}`} className="border-b border-gray-100">
                      <td className="py-1">{detail.label}</td>
                      <td className="text-right px-2">{detail.base}</td>
                      <td className="text-right px-2">{detail.rate}</td>
                      <td className="text-right font-medium">{detail.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                <tr className="border-b border-gray-200 font-semibold">
                  <td colSpan={3} className="py-2">Total Brut</td>
                  <td className="text-right">{payslip.grossSalary.toFixed(2)}</td>
                </tr>
                
                {/* Deductions section */}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="py-2 font-bold">COTISATIONS ET CONTRIBUTIONS SOCIALES</td>
                </tr>
                {payslip.details
                  .filter(detail => detail.type === 'deduction')
                  .map((detail, index) => (
                    <tr key={`deduction-${index}`} className="border-b border-gray-100">
                      <td className="py-1">{detail.label}</td>
                      <td className="text-right px-2">{detail.base}</td>
                      <td className="text-right px-2">{detail.rate}</td>
                      <td className="text-right font-medium">{detail.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                <tr className="border-b border-gray-200 font-semibold">
                  <td colSpan={3} className="py-2">Total Cotisations</td>
                  <td className="text-right">{payslip.totalDeductions.toFixed(2)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="font-bold text-lg">
                  <td colSpan={3} className="pt-4">NET À PAYER</td>
                  <td className="text-right pt-4">{payslip.netSalary.toFixed(2)} €</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Leave balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Congés et RTT */}
          <div>
            <h3 className="font-bold mb-2 uppercase text-gray-600 text-sm">Congés et RTT</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-1">Congés acquis période:</td>
                  <td className="text-right">2,5 jours</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1">Congés pris période:</td>
                  <td className="text-right">0 jour</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1 font-medium">Solde congés:</td>
                  <td className="text-right font-medium">25 jours</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1">RTT acquis période:</td>
                  <td className="text-right">1 jour</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1">RTT pris période:</td>
                  <td className="text-right">0 jour</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1 font-medium">Solde RTT:</td>
                  <td className="text-right font-medium">9 jours</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Cumuls */}
          <div>
            <h3 className="font-bold mb-2 uppercase text-gray-600 text-sm">Cumuls annuels</h3>
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-1">Brut annuel:</td>
                  <td className="text-right">{(payslip.grossSalary * 9).toFixed(2)} €</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1">Net annuel:</td>
                  <td className="text-right">{(payslip.netSalary * 9).toFixed(2)} €</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1 font-medium">Net imposable annuel:</td>
                  <td className="text-right font-medium">{imposable.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Footer notice */}
        <div className="text-center text-xs text-gray-500 mt-6 pt-6 border-t">
          <p>* Ce bulletin de paie est un document à conserver sans limitation de durée</p>
        </div>
      </Card>
    </div>
  );
};

export default PaySlipTemplate;
