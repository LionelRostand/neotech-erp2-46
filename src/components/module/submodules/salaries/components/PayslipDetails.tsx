
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PaySlip } from '../types/payslip';
import { ChevronLeft, Download, Printer } from 'lucide-react';
import { usePayslipGenerator } from '../hooks/usePayslipGenerator';
import { formatCurrency } from '@/lib/utils';

interface PayslipDetailsProps {
  payslip: PaySlip;
  onBack?: () => void;
}

const PayslipDetails: React.FC<PayslipDetailsProps> = ({ payslip, onBack }) => {
  const { setShowPreview } = usePayslipGenerator();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setShowPreview(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 md:p-8 rounded-lg shadow-md print:shadow-none">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      <div className="print:block">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Bulletin de paie</h1>
            <p className="text-gray-600">Période : {payslip.period}</p>
            <p className="text-gray-600">Date de paiement : {payslip.paymentDate}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <h2 className="font-bold">{payslip.employerName}</h2>
            <p className="text-sm text-gray-600">{payslip.employerAddress}</p>
            <p className="text-sm text-gray-600">SIRET : {payslip.employerSiret}</p>
          </div>
        </div>

        {/* Informations de l'employé */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Informations Employé</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Nom :</span> {payslip.employee.lastName}</p>
                <p><span className="font-medium">Prénom :</span> {payslip.employee.firstName}</p>
                <p><span className="font-medium">Poste :</span> {payslip.employee.role}</p>
              </div>
              <div>
                <p><span className="font-medium">N° Sécurité Sociale :</span> {payslip.employee.socialSecurityNumber}</p>
                <p><span className="font-medium">Date d'embauche :</span> {payslip.employee.startDate}</p>
                <p><span className="font-medium">Mode de paiement :</span> {payslip.paymentMethod || "Virement bancaire"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails de rémunération */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Détail de la rémunération</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Libellé</th>
                    <th className="text-right py-2">Base</th>
                    <th className="text-right py-2">Taux</th>
                    <th className="text-right py-2">Montant (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {payslip.details.filter(detail => detail.type === "earning").map((detail, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2">{detail.label}</td>
                      <td className="text-right py-2">{detail.base || "-"}</td>
                      <td className="text-right py-2">{detail.rate || "-"}</td>
                      <td className="text-right py-2">{formatCurrency(detail.amount)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={3} className="py-3 text-right">Salaire brut</td>
                    <td className="py-3 text-right">{formatCurrency(payslip.grossSalary)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Cotisations sociales */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Cotisations sociales</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Libellé</th>
                    <th className="text-right py-2">Base</th>
                    <th className="text-right py-2">Taux salarial</th>
                    <th className="text-right py-2">Montant (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {payslip.details.filter(detail => detail.type === "deduction").map((detail, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2">{detail.label}</td>
                      <td className="text-right py-2">{formatCurrency(payslip.grossSalary)}</td>
                      <td className="text-right py-2">{detail.rate || "-"}</td>
                      <td className="text-right py-2">-{formatCurrency(detail.amount)}</td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td colSpan={3} className="py-3 text-right">Total des cotisations</td>
                    <td className="py-3 text-right">-{formatCurrency(payslip.totalDeductions)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Résumé */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Résumé</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Salaire brut</td>
                      <td className="text-right py-2">{formatCurrency(payslip.grossSalary)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Total des cotisations</td>
                      <td className="text-right py-2">-{formatCurrency(payslip.totalDeductions)}</td>
                    </tr>
                    <tr className="font-bold text-lg">
                      <td className="py-3">Net à payer</td>
                      <td className="text-right py-3">{formatCurrency(payslip.netSalary)}</td>
                    </tr>
                    <tr>
                      <td className="pt-4 text-sm text-gray-600" colSpan={2}>
                        Net imposable: {formatCurrency(payslip.netSalary * 0.975)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Cumuls annuels</h4>
                <div className="space-y-2 text-sm">
                  <p>Brut cumulé : {formatCurrency(payslip.annualCumulative?.grossSalary || 0)}</p>
                  <p>Net imposable cumulé : {formatCurrency(payslip.annualCumulative?.taxableIncome || 0)}</p>
                </div>

                <h4 className="font-medium mt-4 mb-2">Congés</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Acquis</p>
                    <p className="font-medium">{payslip.conges?.acquired || 0} j</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pris</p>
                    <p className="font-medium">{payslip.conges?.taken || 0} j</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Solde</p>
                    <p className="font-medium">{payslip.conges?.balance || 0} j</p>
                  </div>
                </div>

                <h4 className="font-medium mt-4 mb-2">RTT</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Acquis</p>
                    <p className="font-medium">{payslip.rtt?.acquired || 0} j</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pris</p>
                    <p className="font-medium">{payslip.rtt?.taken || 0} j</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Solde</p>
                    <p className="font-medium">{payslip.rtt?.balance || 0} j</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-xs text-gray-500 mt-8">
          <p>
            En application de l'article R. 3243-4 du Code du travail, vous êtes tenu de conserver ce bulletin de paie sans limitation de durée.
          </p>
          <p className="mt-1">
            Net à payer avant impôt sur le revenu : {formatCurrency(payslip.netSalary)} | Impôt sur le revenu prélevé à la source : 0.00 €
          </p>
          <p className="mt-1">
            Bulletin conforme à la législation française du Code du travail
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayslipDetails;
