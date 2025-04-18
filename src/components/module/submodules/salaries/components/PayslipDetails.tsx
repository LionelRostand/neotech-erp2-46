
import React from 'react';
import { PaySlip } from '@/types/payslip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileDown, Save, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';
import { savePaySlip, savePaySlipToEmployeeDocuments } from '../services/payslipService';
import { toast } from 'sonner';
import { generatePayslipPdf } from '../utils/payslipPdfUtils';
import DownloadPayslipButton from './DownloadPayslipButton';

interface PayslipDetailsProps {
  payslip: PaySlip;
  onBack?: () => void;
}

const PayslipDetails: React.FC<PayslipDetailsProps> = ({ payslip, onBack }) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = React.useState(false);
  
  const handleSavePayslip = async () => {
    setIsSaving(true);
    try {
      // Save to database
      const savedPayslip = await savePaySlip(payslip);
      
      // Save to employee documents
      await savePaySlipToEmployeeDocuments(savedPayslip);
      
      toast.success('Fiche de paie enregistrée et ajoutée aux documents de l\'employé');
      
      // Navigate to history tab
      navigate('/modules/employees/salaries?tab=history');
    } catch (error) {
      console.error('Error saving payslip:', error);
      toast.error('Erreur lors de l\'enregistrement de la fiche de paie');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDownloadPdf = () => {
    try {
      const doc = generatePayslipPdf(payslip);
      doc.save(`bulletin_${payslip.employeeName.replace(' ', '_')}_${payslip.period.replace(' ', '_')}.pdf`);
      toast.success('Fiche de paie téléchargée');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };
  
  // Group details by type
  const earnings = payslip.details.filter(detail => detail.type === 'earning');
  const deductions = payslip.details.filter(detail => detail.type === 'deduction');

  return (
    <Card className="w-full">
      <CardHeader className="bg-muted/50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Bulletin de paie</CardTitle>
            <CardDescription>
              {payslip.employeeName} - Période : {payslip.period}
            </CardDescription>
          </div>
          {onBack && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* Employee & Company info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Informations employé</h3>
            <p>Nom : {payslip.employeeName}</p>
            <p>Heures travaillées : {payslip.hoursWorked || 0}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Informations employeur</h3>
            <p>Nom : {payslip.employerName}</p>
            {payslip.employerAddress && <p>Adresse : {payslip.employerAddress}</p>}
            {payslip.employerSiret && <p>SIRET : {payslip.employerSiret}</p>}
          </div>
        </div>
        
        {/* Payslip details */}
        <div className="space-y-6">
          {/* Earnings section */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Rémunérations</h3>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rubrique</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {earnings.map((earning, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{earning.label}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{earning.base || ''}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{earning.rate || ''}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(earning.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-medium">
                    <td className="px-4 py-2 whitespace-nowrap text-sm" colSpan={3}>Salaire brut</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(payslip.grossSalary)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Deductions section */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Cotisations et contributions</h3>
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rubrique</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deductions.map((deduction, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{deduction.label}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{deduction.base || ''}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{deduction.rate || ''}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(deduction.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-medium">
                    <td className="px-4 py-2 whitespace-nowrap text-sm" colSpan={3}>Total des cotisations</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{formatCurrency(payslip.totalDeductions)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Net salary */}
          <div className="border rounded-md bg-primary/5 p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Net à payer</h3>
              <span className="font-bold text-xl">{formatCurrency(payslip.netSalary)}</span>
            </div>
          </div>
          
          {/* Leave balances */}
          {(payslip.conges || payslip.rtt) && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Congés et RTT</h3>
              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acquis</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pris</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Solde</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payslip.conges && (
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">Congés payés</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">{payslip.conges.acquired}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">{payslip.conges.taken}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">{payslip.conges.balance}</td>
                      </tr>
                    )}
                    {payslip.rtt && (
                      <tr>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">RTT</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">{payslip.rtt.acquired}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">{payslip.rtt.taken}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-center">{payslip.rtt.balance}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        <div className="pt-4 text-xs text-muted-foreground">
          <p>En application de l'article L.144-2 du Code du travail, vous pouvez avoir accès aux éléments de calcul de votre rémunération.</p>
          <p>Ce bulletin de paie doit être conservé sans limitation de durée.</p>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-6 flex flex-wrap gap-3 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadPdf}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Télécharger PDF
        </Button>
        
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleSavePayslip}
          disabled={isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Sauvegarde en cours...' : 'Sauvegarder et archiver'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PayslipDetails;
