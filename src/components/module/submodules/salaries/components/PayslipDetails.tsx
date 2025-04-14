
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { FileDown, Printer } from 'lucide-react';
import { PaySlip } from '@/types/payslip';
import EmployeeInfoSection from './EmployeeInfoSection';
import LeaveBalanceCard from './LeaveBalanceCard';

interface PayslipDetailsProps {
  payslip: PaySlip;
}

const PayslipDetails: React.FC<PayslipDetailsProps> = ({ payslip }) => {
  // Préparer les données pour l'affichage
  const employee = {
    firstName: payslip.employeeName.split(' ')[0] || '',
    lastName: payslip.employeeName.split(' ').slice(1).join(' ') || '',
    role: payslip.employee?.role || 'Employé',
    socialSecurityNumber: payslip.employee?.socialSecurityNumber || '',
    period: payslip.period || `${new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`,
    startDate: payslip.employee?.startDate || new Date().toISOString(),
    hoursWorked: payslip.hoursWorked || 151.67
  };

  const conges = payslip.conges || { acquired: 2.08, taken: 0, balance: 0 };
  const rtt = payslip.rtt || { acquired: 1, taken: 0, balance: 0 };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Logique pour générer et télécharger le PDF
    alert('Téléchargement du PDF en cours...');
  };

  return (
    <div className="space-y-6 print:m-8">
      <div className="flex justify-between items-start print:hidden">
        <h2 className="text-2xl font-bold">Bulletin de paie</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handleDownloadPdf}>
            <FileDown className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations employeur */}
            <div>
              <h3 className="font-bold text-lg mb-2">Employeur</h3>
              <div className="space-y-1 text-sm">
                <p>{payslip.employerName}</p>
                <p>{payslip.employerAddress}</p>
                <p>SIRET: {payslip.employerSiret}</p>
              </div>
            </div>

            {/* Informations employé */}
            <EmployeeInfoSection {...employee} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Détails du salaire */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Détails de la rémunération</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 font-medium text-sm">
                <span>Élément</span>
                <span className="text-right">Base</span>
                <span className="text-right">Montant</span>
              </div>
              <Separator />
              {/* Revenus */}
              {payslip.details.filter(d => d.type === 'earning').map((detail, index) => (
                <div key={`earning-${index}`} className="grid grid-cols-3 gap-2 text-sm">
                  <span>{detail.label}</span>
                  <span className="text-right">{detail.base || ''}</span>
                  <span className="text-right">{detail.amount.toFixed(2)} €</span>
                </div>
              ))}
              <Separator />
              {/* Déductions */}
              {payslip.details.filter(d => d.type === 'deduction').map((detail, index) => (
                <div key={`deduction-${index}`} className="grid grid-cols-3 gap-2 text-sm">
                  <span>{detail.label}</span>
                  <span className="text-right">{detail.base || ''}</span>
                  <span className="text-right">-{detail.amount.toFixed(2)} €</span>
                </div>
              ))}
              <Separator />
              {/* Totaux */}
              <div className="grid grid-cols-3 gap-2 font-medium">
                <span>Salaire brut</span>
                <span></span>
                <span className="text-right">{payslip.grossSalary.toFixed(2)} €</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-medium">
                <span>Total déductions</span>
                <span></span>
                <span className="text-right">-{payslip.totalDeductions.toFixed(2)} €</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-bold">
                <span>Salaire net</span>
                <span></span>
                <span className="text-right">{payslip.netSalary.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solde des congés */}
        <div>
          <LeaveBalanceCard conges={conges} rtt={rtt} />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-2">Informations complémentaires</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Méthode de paiement:</span> {payslip.paymentMethod || 'Virement bancaire'}</p>
            <p><span className="font-medium">Date de paiement:</span> {new Date(payslip.paymentDate || payslip.date).toLocaleDateString('fr-FR')}</p>
            {payslip.notes && (
              <div>
                <p className="font-medium">Notes:</p>
                <p className="whitespace-pre-line">{payslip.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayslipDetails;
