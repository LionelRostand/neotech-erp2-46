
import React from 'react';
import { PaySlip } from '@/types/payslip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
// Import the autoTable plugin correctly
import autoTable from 'jspdf-autotable';

interface PaySlipTemplateProps {
  payslip: PaySlip;
}

const PaySlipTemplate: React.FC<PaySlipTemplateProps> = ({ payslip }) => {
  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(16);
      doc.text("BULLETIN DE PAIE", 14, 20);
      doc.setFontSize(12);
      doc.text(`EN EUROS - ${payslip.period}`, 14, 28);
      
      doc.line(14, 32, 196, 32); // horizontal line
      
      // Left section - Welcome and salary info
      doc.setFillColor(240, 247, 255);
      doc.rect(14, 40, 85, 100, 'F');
      
      doc.setFontSize(18);
      doc.text(`Bonjour ${payslip.employee.firstName}`, 20, 55);
      doc.setFontSize(11);
      doc.text(`Voici votre bulletin de paie de ${payslip.period}`, 20, 65);
      
      doc.setFontSize(12);
      doc.text("Votre salaire avant impôt", 20, 80);
      doc.text(`${payslip.grossSalary.toFixed(2)} €`, 85, 80, { align: 'right' });
      
      doc.setFontSize(10);
      doc.text(`Prélèvement à la source (${(payslip.totalDeductions / payslip.grossSalary * 100).toFixed(2)} %)`, 20, 87);
      doc.text(`${(payslip.grossSalary * 0.036).toFixed(2)} €`, 85, 87, { align: 'right' });
      
      doc.setFontSize(12);
      doc.text("Votre salaire après impôt", 20, 97);
      doc.text(`${payslip.netSalary.toFixed(2)} €`, 85, 97, { align: 'right' });
      doc.setFontSize(10);
      doc.text(`Ce montant vous sera transféré le ${payslip.paymentDate}`, 20, 104);
      
      doc.setFontSize(12);
      doc.text("Votre montant net social", 20, 115);
      doc.text(`${(payslip.netSalary + payslip.grossSalary * 0.07).toFixed(2)} €`, 85, 115, { align: 'right' });
      doc.setFontSize(10);
      doc.text("Ce montant sert au calcul de vos aides sociales", 20, 122);
      
      // Net salary calculation section
      doc.setFillColor(255, 255, 255);
      doc.rect(14, 150, 85, 120, 'F');
      doc.setFontSize(14);
      doc.text("Calcul du salaire net", 30, 165);
      
      doc.setFontSize(12);
      doc.text("Rémunération brute", 20, 180);
      doc.text(`${payslip.grossSalary.toFixed(2)} €`, 85, 180, { align: 'right' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Dont 0,00 € de primes", 20, 187);
      doc.setTextColor(0, 0, 0);
      
      doc.setFontSize(12);
      doc.text("Cotisations et contributions salariales", 20, 198);
      doc.text(`- ${(payslip.totalDeductions * 1.82).toFixed(2)} €`, 85, 198, { align: 'right' });
      
      doc.text("Indemnités non soumises", 20, 208);
      doc.text(`+ 0,00 €`, 85, 208, { align: 'right' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Dont notes de frais ( 0,00 €)", 20, 215);
      doc.setTextColor(0, 0, 0);
      
      doc.setFontSize(12);
      doc.text("Autres retenues", 20, 226);
      doc.text(`- 105,00 €`, 85, 226, { align: 'right' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Dont titres restaurant ( 105,00 €)", 20, 233);
      doc.setTextColor(0, 0, 0);
      
      doc.setFontSize(12);
      doc.text("Prélèvement à la source", 20, 243);
      doc.text(`- ${(payslip.grossSalary * 0.036).toFixed(2)} €`, 85, 243, { align: 'right' });
      
      doc.text("Net à payer", 20, 255);
      doc.text(`${payslip.netSalary.toFixed(2)} €`, 85, 255, { align: 'right' });
      
      // Cumuls section
      doc.setFillColor(255, 250, 230);
      doc.rect(14, 280, 85, 90, 'F');
      
      doc.setFontSize(14);
      doc.text("Cumuls DEPUIS JANV. 2025", 20, 295);
      
      doc.setFontSize(12);
      doc.text("Salaire net imposable", 20, 310);
      doc.text(`${(payslip.grossSalary * 2.07).toFixed(2)} €`, 85, 310, { align: 'right' });
      
      doc.text("Salaire brut", 20, 322);
      doc.text(`${(payslip.grossSalary * 2.85).toFixed(2)} €`, 85, 322, { align: 'right' });
      
      doc.text("Prélèvement à la source", 20, 334);
      doc.text(`${(payslip.grossSalary * 0.075).toFixed(2)} €`, 85, 334, { align: 'right' });
      
      doc.text("Montant net des heures supplémentaires exonérées", 20, 346);
      doc.text(`${(payslip.grossSalary * 0.28).toFixed(2)} €`, 85, 346, { align: 'right' });
      
      doc.text("Temps travaillé", 20, 358);
      doc.text(`${payslip.hoursWorked.toFixed(0)} h`, 85, 358, { align: 'right' });
      
      // Right section - Leave balances
      doc.setFillColor(255, 255, 255);
      doc.rect(110, 40, 85, 100, 'F');
      
      doc.setFontSize(12);
      doc.text("Congés disponibles", 130, 55);
      doc.setFontSize(10);
      doc.text(`Jours posés en ${payslip.period}`, 120, 63);
      
      doc.setFontSize(14);
      doc.text("17,25 jours", 180, 55, { align: 'right' });
      doc.setFontSize(10);
      doc.text("0,00 jours", 180, 63, { align: 'right' });
      
      // CP sections
      doc.setFontSize(12);
      doc.text("CP N-2", 120, 80);
      doc.text("0,00 jours", 180, 80, { align: 'right' });
      
      doc.text("+ Acquis", 120, 90);
      doc.text("5,00 j", 180, 90, { align: 'right' });
      
      doc.text("- Pris", 120, 100);
      doc.text("5,00 j", 180, 100, { align: 'right' });
      
      doc.text("CP N-1", 120, 115);
      doc.text("0,00 jours", 180, 115, { align: 'right' });
      
      doc.text("+ Acquis", 120, 125);
      doc.text("25,00 j", 180, 125, { align: 'right' });
      
      doc.text("- Pris", 120, 135);
      doc.text("25,00 j", 180, 135, { align: 'right' });
      
      // Salary composition chart
      doc.setFillColor(255, 255, 255);
      doc.rect(110, 150, 85, 120, 'F');
      
      doc.setFontSize(14);
      doc.text("Composition du salaire brut", 120, 165);
      
      // Second page - Detailed payslip
      doc.addPage();
      doc.setFontSize(16);
      doc.text("BULLETIN DE PAIE - EN EUROS", 105, 20, { align: 'center' });
      
      // Company and Employee info
      doc.setFontSize(11);
      doc.text(`${payslip.employerName}`, 20, 35);
      doc.text(`${payslip.employerAddress}`, 20, 42);
      
      doc.text(`${payslip.employee.firstName} ${payslip.employee.lastName}`, 140, 35);
      doc.text(`Détail du salarié`, 180, 35, { align: 'right' });
      
      doc.text(`N° SIRET: ${payslip.employerSiret}`, 20, 55);
      
      // Add detailed tables for earnings and deductions
      const earningsData = payslip.details
        .filter(detail => detail.type === "earning")
        .map(item => [
          item.label, 
          item.base, 
          item.rate || "-", 
          item.amount.toFixed(2)
        ]);
        
      const deductionsData = payslip.details
        .filter(detail => detail.type === "deduction")
        .map(item => [
          item.label, 
          item.base, 
          item.rate || "-", 
          item.amount.toFixed(2)
        ]);
      
      // Detailed salary table - using autoTable correctly
      autoTable(doc, {
        startY: 70,
        head: [["DÉSIGNATION", "BASE", "TAUX OU %", "MONTANT", "PART EMPLOYEUR"]],
        body: [
          ...earningsData,
          ["Rémunération brute", "", "", payslip.grossSalary.toFixed(2), ""],
          ...deductionsData,
          ["TOTAL COTISATIONS & CONTRIBUTIONS SALARIALES", "", "", payslip.totalDeductions.toFixed(2), ""],
          ["Montant net social", "", "", (payslip.netSalary + payslip.grossSalary * 0.07).toFixed(2), ""],
          ["Net à payer avant impôt sur le revenu", "", "", payslip.grossSalary.toFixed(2), ""],
          ["Net payé en euros (Virement)", "", "", payslip.netSalary.toFixed(2), ""],
        ],
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
      });
      
      // Add footer with verification information
      doc.setFontSize(8);
      doc.text("Pour la définition des termes employés, se reporter au site internet www.service-public.fr rubrique cotisations sociales", 15, 280);
      
      // Save the PDF with a proper name
      const fileName = `bulletin-de-paie-${payslip.employee.lastName.toLowerCase()}-${payslip.period.replace(' ', '-').toLowerCase()}.pdf`;
      doc.save(fileName);
      toast.success("Bulletin de paie téléchargé avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      toast.error("Erreur lors du téléchargement du bulletin de paie");
    }
  };

  const handlePrint = () => {
    try {
      window.print();
      console.log("Impression initiée");
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      toast.error("Erreur lors de l'impression");
    }
  };

  return (
    <Card className="max-w-4xl mx-auto mb-8 print:shadow-none print:border-none">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-xl font-bold">Bulletin de Paie</CardTitle>
        <div className="flex items-center space-x-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center">
            <Printer className="mr-1 h-4 w-4" /> Imprimer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Modern PaySlip design based on the provided images */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-1">Bonjour {payslip.employee.firstName}</h2>
          <p className="text-gray-600 mb-6">Voici votre bulletin de paie de {payslip.period}</p>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Votre salaire avant impôt</p>
                <p className="text-xs text-gray-500">Prélèvement à la source ({(3.6).toFixed(2)} %)</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{payslip.grossSalary.toFixed(2)} €</p>
                <p className="text-xs text-gray-500">{(payslip.grossSalary * 0.036).toFixed(2)} €</p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Votre salaire après impôt</p>
                <p className="text-xs text-gray-500">Ce montant vous sera transféré le {payslip.paymentDate}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{payslip.netSalary.toFixed(2)} €</p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Votre montant net social</p>
                <p className="text-xs text-gray-500">Ce montant sert au calcul de vos aides sociales</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{(payslip.netSalary + payslip.grossSalary * 0.07).toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Net Salary Calculation */}
          <div className="border rounded-lg p-5">
            <div className="flex items-center mb-4">
              <div className="bg-gray-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 17a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v0Z"/><path d="M12 12V2"/><path d="m8 5 4-3 4 3"/></svg>
              </div>
              <h3 className="font-bold text-lg">Calcul du salaire net</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <p>Rémunération brute</p>
                <p className="font-medium">{payslip.grossSalary.toFixed(2)} €</p>
              </div>
              <p className="text-xs text-gray-500">Dont 0,00 € de primes</p>
              
              <div className="flex justify-between">
                <p>Cotisations et contributions salariales</p>
                <p className="font-medium">- {(payslip.totalDeductions * 1.82).toFixed(2)} €</p>
              </div>
              
              <div className="flex justify-between">
                <p>Indemnités non soumises</p>
                <p className="font-medium">+ 0,00 €</p>
              </div>
              <p className="text-xs text-gray-500">Dont notes de frais (0,00 €)</p>
              
              <div className="flex justify-between">
                <p>Autres retenues</p>
                <p className="font-medium">- 105,00 €</p>
              </div>
              <p className="text-xs text-gray-500">Dont titres restaurant (105,00 €)</p>
              
              <div className="flex justify-between">
                <p>Prélèvement à la source</p>
                <p className="font-medium">- {(payslip.grossSalary * 0.036).toFixed(2)} €</p>
              </div>
              
              <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <p>Net à payer</p>
                <p>{payslip.netSalary.toFixed(2)} €</p>
              </div>
            </div>
          </div>
          
          {/* Leave Balances */}
          <div className="border rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                </div>
                <h3 className="font-bold text-lg">Congés disponibles</h3>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">17,25 jours</p>
                <p className="text-xs text-gray-500">0,00 jours posés en {payslip.period}</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-medium">CP N-2</p>
                  <p className="font-medium">0,00 jours</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>+ Acquis</p>
                  <p>5,00 j</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>- Pris</p>
                  <p>5,00 j</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-medium">CP N-1</p>
                  <p className="font-medium">0,00 jours</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>+ Acquis</p>
                  <p>25,00 j</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>- Pris</p>
                  <p>25,00 j</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-medium">CP N</p>
                  <p className="font-medium">17,25 jours</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>+ Acquis</p>
                  <p>18,75 j</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>- Pris</p>
                  <p>1,50 j</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cumuls */}
        <div className="bg-amber-50 rounded-lg p-5 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-amber-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <h3 className="font-bold text-lg">Cumuls DEPUIS JANV. 2025</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <p>Salaire net imposable</p>
              <p className="font-medium">{(payslip.grossSalary * 2.07).toFixed(2)} €</p>
            </div>
            <div className="flex justify-between">
              <p>Salaire brut</p>
              <p className="font-medium">{(payslip.grossSalary * 2.85).toFixed(2)} €</p>
            </div>
            <div className="flex justify-between">
              <p>Prélèvement à la source</p>
              <p className="font-medium">{(payslip.grossSalary * 0.075).toFixed(2)} €</p>
            </div>
            <div className="flex justify-between">
              <p>Montant net des heures supplémentaires exonérées</p>
              <p className="font-medium">{(payslip.grossSalary * 0.28).toFixed(2)} €</p>
            </div>
            <div className="flex justify-between">
              <p>Temps travaillé</p>
              <p className="font-medium">{payslip.hoursWorked.toFixed(0)} h</p>
            </div>
          </div>
        </div>
        
        {/* Salary composition chart could go here */}
        <div className="border rounded-lg p-5 mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-rose-50 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 6v12M12 6v12M5 12h14"/></svg>
            </div>
            <h3 className="font-bold text-lg">Composition du salaire brut</h3>
          </div>
          
          <div className="flex justify-center">
            <div className="w-40 h-40 relative">
              {/* Simple circular representation */}
              <div className="w-full h-full rounded-full border-[20px] border-blue-900"></div>
              <div className="absolute top-0 right-0 w-full h-full rounded-full border-[20px] border-blue-400 border-t-transparent border-r-transparent border-b-transparent" style={{transform: 'rotate(45deg)'}}></div>
              <div className="absolute top-0 right-0 w-full h-full rounded-full border-[20px] border-blue-200 border-t-transparent border-r-transparent border-l-transparent" style={{transform: 'rotate(260deg)'}}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-900 rounded-full mr-2"></div>
              <div>
                <p className="text-sm">Salaire net après impôt</p>
                <p className="text-xs text-gray-500">75,02 %</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              <div>
                <p className="text-sm">Prélèvement à la source</p>
                <p className="text-xs text-gray-500">2,62 %</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-200 rounded-full mr-2"></div>
              <div>
                <p className="text-sm">Santé</p>
                <p className="text-xs text-gray-500">1,08 %</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <div>
                <p className="text-sm">Autres cotisations</p>
                <p className="text-xs text-gray-500">21,28 %</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Verification QR Code section */}
        <div className="flex justify-between items-center mt-10">
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 bg-gray-200"></div>
            <div className="text-xs">
              <p className="font-medium">Vérifiez</p>
              <p>l'intégrité</p>
              <p>du bulletin</p>
              <p className="mt-3">CODE DE VÉRIFICATION: 518241</p>
            </div>
          </div>
          <div className="text-right max-w-xs">
            <p className="text-base font-medium text-blue-800">Retrouvez tous les détails de votre fichier en deuxième page de votre bulletin de paie</p>
            <div className="mt-2 text-right">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-blue-800"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>Ce bulletin de paie est conforme aux dispositions de l'article R. 3243-1 du Code du travail.</p>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleDownload} 
            className="flex items-center bg-green-600 hover:bg-green-700"
          >
            <Download className="mr-1 h-4 w-4" /> Télécharger bulletin de paie
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaySlipTemplate;
