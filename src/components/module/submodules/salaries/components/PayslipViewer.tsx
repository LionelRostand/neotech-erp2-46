
import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download, FileBarChart } from 'lucide-react';
import { PaySlip } from '@/types/payslip';
import CompanyInfoSection from './CompanyInfoSection';
import EmployeeInfoSection from './EmployeeInfoSection';
import SalaryCompositionCard from './SalaryCompositionCard';
import LeaveBalanceCard from './LeaveBalanceCard';
import CumulativeInfoCard from './CumulativeInfoCard';
import VerificationFooter from './VerificationFooter';
import { toast } from 'sonner';
import { generatePayslipPDF } from '../utils/payslipPdfUtils';

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
    try {
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
      
      // Génération du PDF selon le format français
      const doc = generatePayslipPDF(payslip);
      
      // Construction du nom de fichier français
      const formattedMonth = payslip.month?.toLowerCase() || 'periode';
      const year = payslip.year || new Date().getFullYear();
      const employeeName = payslip.employee?.lastName?.toLowerCase() || 'employe';
      const fileName = `bulletin_de_paie_${employeeName}_${formattedMonth}_${year}.pdf`;
      
      // Enregistrement du fichier PDF
      doc.save(fileName);
      
      toast.success("Bulletin de paie téléchargé avec succès!");
    } catch (error) {
      console.error('Erreur lors du téléchargement du bulletin:', error);
      toast.error("Erreur lors du téléchargement du bulletin de paie");
    }
  };

  // Calculer le montant avant impôt
  const netBeforeTax = payslip.grossSalary - (payslip.totalDeductions || 0);
  
  // Date de paiement formatée
  const paymentDate = payslip.paymentDate 
    ? new Date(payslip.paymentDate).toLocaleDateString('fr-FR')
    : new Date().toLocaleDateString('fr-FR');

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
          {/* En-tête du bulletin */}
          <div className="text-center border-b pb-4">
            <h1 className="text-xl font-bold">BULLETIN DE PAIE</h1>
            <p className="text-sm">EN EUROS - {payslip.month} {payslip.year}</p>
          </div>
          
          {/* Informations entreprise et employé */}
          <div className="flex justify-between">
            <CompanyInfoSection 
              name={payslip.employerName}
              address={payslip.employerAddress}
              siret={payslip.employerSiret}
            />
            <EmployeeInfoSection 
              firstName={payslip.employee?.firstName}
              lastName={payslip.employee?.lastName}
              role={payslip.employee?.role}
              socialSecurityNumber={payslip.employee?.socialSecurityNumber}
              period={`${payslip.month} ${payslip.year}`}
              startDate={payslip.employee?.startDate}
              hoursWorked={payslip.hoursWorked}
            />
          </div>
          
          {/* Section résumé */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">
              Bonjour {payslip.employee?.firstName || 'collaborateur'}
            </h2>
            <p className="text-sm mb-4">
              Voici votre bulletin de paie de {payslip.month} {payslip.year}
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between">
                <span className="font-bold">Votre salaire avant impôt</span>
                <span className="font-bold">{netBeforeTax.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Prélèvement à la source (3,60 %)</span>
                <span>{(payslip.totalDeductions || 0).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Votre salaire après impôt</span>
                <span>{payslip.netSalary.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ce montant vous sera transféré le {paymentDate}</span>
              </div>
              
              <div className="flex justify-between font-bold mt-2">
                <span>Votre montant net social</span>
                <span>{(payslip.netSalary * 1.05).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ce montant sert au calcul de vos aides sociales</span>
              </div>
            </div>
          </div>
          
          {/* Section calcul du salaire */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-4">
              <FileBarChart className="h-5 w-5 mr-2 text-blue-500" />
              <h2 className="text-lg font-bold">Calcul du salaire net</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="font-bold">Rémunération brute</span>
                <span>{payslip.grossSalary.toFixed(2)} €</span>
              </div>
              
              {/* Détail des cotisations */}
              <div className="flex justify-between">
                <span className="font-bold">Cotisations et contributions salariales</span>
                <span>- {(payslip.totalDeductions || 0).toFixed(2)} €</span>
              </div>
              
              {/* Autres éléments selon besoin */}
              <div className="flex justify-between">
                <span className="font-bold">Indemnités non soumises</span>
                <span>+ 0,00 €</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-bold">Prélèvement à la source</span>
                <span>- {((payslip.grossSalary || 0) * 0.036).toFixed(2)} €</span>
              </div>
              
              <div className="border-t border-gray-300 my-2"></div>
              
              <div className="flex justify-between font-bold">
                <span>Net à payer</span>
                <span>{payslip.netSalary.toFixed(2)} €</span>
              </div>
            </div>
          </div>
          
          {/* Section cumuls */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-3">Cumuls DEPUIS JANV. {payslip.year}</h2>
            
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between">
                <span className="font-bold">Salaire net imposable</span>
                <span>{(payslip.annualCumulative?.netSalary || payslip.netSalary * 2).toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-bold">Salaire brut</span>
                <span>{(payslip.annualCumulative?.grossSalary || payslip.grossSalary * 2).toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-bold">Prélèvement à la source</span>
                <span>{(payslip.annualCumulative?.taxableIncome || (payslip.grossSalary || 0) * 0.072).toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-bold">Montant net des heures supplémentaires exonérées</span>
                <span>0,00 €</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-bold">Temps travaillé</span>
                <span>{payslip.hoursWorked || 151.67} h</span>
              </div>
            </div>
          </div>
          
          {/* Section des congés */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3">Congés disponibles</h2>
            
            <div className="grid grid-cols-1 gap-5">
              {/* CP N-2 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold">CP N-2</span>
                  <span>0,00 jours</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span>+ Acquis</span>
                  <span className="text-right">0,00 j</span>
                  <span>- Pris</span>
                  <span className="text-right">0,00 j</span>
                </div>
              </div>
              
              {/* CP N-1 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold">CP N-1</span>
                  <span>0,00 jours</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span>+ Acquis</span>
                  <span className="text-right">25,00 j</span>
                  <span>- Pris</span>
                  <span className="text-right">25,00 j</span>
                </div>
              </div>
              
              {/* CP N */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold">CP N</span>
                  <span>{(payslip.conges?.balance || 0).toFixed(2)} jours</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span>+ Acquis</span>
                  <span className="text-right">{(payslip.conges?.acquired || 0).toFixed(2)} j</span>
                  <span>- Pris</span>
                  <span className="text-right">{(payslip.conges?.taken || 0).toFixed(2)} j</span>
                </div>
              </div>
              
              {/* RTT */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-bold">RTT</span>
                  <span>{(payslip.rtt?.balance || 0).toFixed(2)} jours</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span>+ Acquis</span>
                  <span className="text-right">{(payslip.rtt?.acquired || 0).toFixed(2)} j</span>
                  <span>- Pris</span>
                  <span className="text-right">{(payslip.rtt?.taken || 0).toFixed(2)} j</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Pied de page de vérification */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-t pt-4 mt-6">
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 w-24 h-24 flex items-center justify-center rounded-lg">
                QR
              </div>
              <p className="text-xs mt-2 text-center">Vérifiez l'intégrité<br />du bulletin</p>
              <p className="text-xs font-bold">CODE: {Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
            </div>
            
            <div className="text-center max-w-md">
              <p className="text-sm mb-2">Retrouvez tous les détails de votre fichier en deuxième page de votre bulletin de paie</p>
              <p className="text-xs text-gray-500">Dans votre intérêt, et pour vous aider à faire valoir vos droits, conservez ce document sans limitation de durée</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PayslipViewer;
