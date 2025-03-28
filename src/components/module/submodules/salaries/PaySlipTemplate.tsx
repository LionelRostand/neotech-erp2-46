
import React from 'react';
import { PaySlip } from '@/types/payslip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PaySlipTemplateProps {
  payslip: PaySlip;
}

const PaySlipTemplate: React.FC<PaySlipTemplateProps> = ({ payslip }) => {
  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(18);
    doc.text("Bulletin de Paie", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Période: ${payslip.period}`, 105, 22, { align: "center" });
    
    // Add employer info
    doc.setFontSize(11);
    doc.text("Employeur:", 14, 35);
    doc.text(payslip.employerName, 14, 40);
    doc.text(payslip.employerAddress, 14, 45);
    doc.text(`SIRET: ${payslip.employerSiret}`, 14, 50);
    
    // Add employee info
    doc.text("Salarié:", 140, 35);
    doc.text(`${payslip.employee.firstName} ${payslip.employee.lastName}`, 140, 40);
    doc.text(`N° SS: ${payslip.employee.socialSecurityNumber}`, 140, 45);
    doc.text(`Emploi: ${payslip.employee.role}`, 140, 50);
    doc.text(`Date d'embauche: ${payslip.employee.startDate}`, 140, 55);
    
    // Add salary details table
    const earningsRows = payslip.details
      .filter(detail => detail.type === "earning")
      .map(detail => [detail.label, detail.base, detail.rate || "", detail.amount.toFixed(2) + " €"]);
    
    const deductionsRows = payslip.details
      .filter(detail => detail.type === "deduction")
      .map(detail => [detail.label, detail.base, detail.rate || "", detail.amount.toFixed(2) + " €"]);
    
    // Add earnings table
    doc.setFontSize(12);
    doc.text("Rémunérations", 105, 65, { align: "center" });
    (doc as any).autoTable({
      startY: 70,
      head: [["Libellé", "Base", "Taux", "Montant"]],
      body: earningsRows,
      theme: 'striped',
      headStyles: { fillColor: [66, 135, 245] }
    });
    
    // Add deductions table
    doc.text("Cotisations et contributions sociales", 105, (doc as any).lastAutoTable.finalY + 10, { align: "center" });
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [["Libellé", "Base", "Taux", "Montant"]],
      body: deductionsRows,
      theme: 'striped',
      headStyles: { fillColor: [66, 135, 245] }
    });
    
    // Add summary
    const summaryY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("Salaire brut: ", 120, summaryY);
    doc.text(`${payslip.grossSalary.toFixed(2)} €`, 170, summaryY, { align: "right" });
    
    doc.text("Total des cotisations: ", 120, summaryY + 5);
    doc.text(`${payslip.totalDeductions.toFixed(2)} €`, 170, summaryY + 5, { align: "right" });
    
    doc.setFont("helvetica", "bold");
    doc.text("Net à payer: ", 120, summaryY + 15);
    doc.text(`${payslip.netSalary.toFixed(2)} €`, 170, summaryY + 15, { align: "right" });
    doc.setFont("helvetica", "normal");
    
    doc.text("Payé le: " + payslip.paymentDate, 14, summaryY + 25);
    doc.text("Heures travaillées: " + payslip.hoursWorked, 14, summaryY + 30);
    
    // Add footer
    doc.setFontSize(8);
    doc.text("Ce bulletin de paie est conforme aux dispositions de l'article R. 3243-1 du Code du travail.", 105, 280, { align: "center" });
    
    // Save the PDF
    doc.save(`bulletin-de-paie-${payslip.employee.lastName.toLowerCase()}-${payslip.period.replace(' ', '-').toLowerCase()}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="max-w-4xl mx-auto mb-8 print:shadow-none print:border-none">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-xl font-bold">Bulletin de Paie</CardTitle>
        <div className="flex items-center space-x-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center">
            <Printer className="mr-1 h-4 w-4" /> Imprimer
          </Button>
          <Button variant="default" size="sm" onClick={handleDownload} className="flex items-center bg-green-600 hover:bg-green-700">
            <Download className="mr-1 h-4 w-4" /> Télécharger PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-bold text-sm text-gray-500 mb-1">Employeur</h3>
            <p className="font-semibold">{payslip.employerName}</p>
            <p className="text-sm">{payslip.employerAddress}</p>
            <p className="text-sm">SIRET: {payslip.employerSiret}</p>
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-500 mb-1">Salarié</h3>
            <p className="font-semibold">{payslip.employee.firstName} {payslip.employee.lastName}</p>
            <p className="text-sm">N° SS: {payslip.employee.socialSecurityNumber}</p>
            <p className="text-sm">Emploi: {payslip.employee.role}</p>
            <p className="text-sm">Date d'embauche: {payslip.employee.startDate}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-sm text-gray-500 mb-2">Période</h3>
          <p>{payslip.period}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-sm border-b pb-2 mb-2">Rémunérations</h3>
          <div className="grid grid-cols-4 gap-2 text-sm font-medium border-b pb-1 mb-2">
            <div>Libellé</div>
            <div>Base</div>
            <div>Taux</div>
            <div className="text-right">Montant</div>
          </div>
          {payslip.details.filter(detail => detail.type === "earning").map((item, index) => (
            <div key={`earning-${index}`} className="grid grid-cols-4 gap-2 text-sm py-1">
              <div>{item.label}</div>
              <div>{item.base}</div>
              <div>{item.rate || '-'}</div>
              <div className="text-right">{item.amount.toFixed(2)} €</div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-sm border-b pb-2 mb-2">Cotisations et Contributions Sociales</h3>
          <div className="grid grid-cols-4 gap-2 text-sm font-medium border-b pb-1 mb-2">
            <div>Libellé</div>
            <div>Base</div>
            <div>Taux</div>
            <div className="text-right">Montant</div>
          </div>
          {payslip.details.filter(detail => detail.type === "deduction").map((item, index) => (
            <div key={`deduction-${index}`} className="grid grid-cols-4 gap-2 text-sm py-1">
              <div>{item.label}</div>
              <div>{item.base}</div>
              <div>{item.rate || '-'}</div>
              <div className="text-right">{item.amount.toFixed(2)} €</div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm"><span className="font-medium">Date de paiement:</span> {payslip.paymentDate}</p>
              <p className="text-sm"><span className="font-medium">Heures travaillées:</span> {payslip.hoursWorked}</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Salaire brut:</span>
                <span>{payslip.grossSalary.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Total des cotisations:</span>
                <span>{payslip.totalDeductions.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Net à payer:</span>
                <span>{payslip.netSalary.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>Ce bulletin de paie est conforme aux dispositions de l'article R. 3243-1 du Code du travail.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaySlipTemplate;
