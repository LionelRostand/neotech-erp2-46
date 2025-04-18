
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaySlip } from '@/types/payslip';
import { CalendarDays, FileText, Printer, User, Building, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { generatePayslipPdf } from '../utils/payslipPdfUtils';

interface PayslipDetailsProps {
  payslip: PaySlip;
}

const PayslipDetails: React.FC<PayslipDetailsProps> = ({ payslip }) => {
  const handlePrint = () => {
    const doc = generatePayslipPdf(payslip);
    
    // Get the employee name from the payslip
    const employeeName = payslip.employee?.lastName?.toLowerCase() || 'employe';
    const formattedMonth = payslip.month?.toLowerCase() || 'periode';
    const year = payslip.year || new Date().getFullYear();
    
    // Generate filename 
    const fileName = `bulletin_de_paie_${employeeName}_${formattedMonth}_${year}.pdf`;
    
    // Save the PDF
    doc.save(fileName);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex justify-between items-center">
          <span>Fiche de paie - {payslip.period}</span>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Informations Employeur
            </h3>
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium">{payslip.employerName}</p>
              <p className="text-sm text-muted-foreground">{payslip.employerAddress}</p>
              <p className="text-sm text-muted-foreground">SIRET: {payslip.employerSiret}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations Salarié
            </h3>
            <div className="bg-muted p-4 rounded-md">
              <p className="font-medium">{payslip.employee?.firstName} {payslip.employee?.lastName}</p>
              <p className="text-sm text-muted-foreground">
                {payslip.employee?.role || 'Employé'}
              </p>
              <p className="text-sm text-muted-foreground">
                N° SS: {payslip.employee?.socialSecurityNumber || 'Non spécifié'}
              </p>
              <p className="text-sm text-muted-foreground">
                Date d'embauche: {formatDate(payslip.employee?.startDate)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <CalendarDays className="h-5 w-5 mr-2" />
            Période et Paiement
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground">Période</p>
              <p className="font-medium">{payslip.period}</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground">Date de paiement</p>
              <p className="font-medium">{formatDate(payslip.paymentDate)}</p>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground">Heures travaillées</p>
              <p className="font-medium">{payslip.hoursWorked} h</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Détails de la Rémunération
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Rubrique</th>
                  <th className="p-2 text-left">Base</th>
                  <th className="p-2 text-left">Taux</th>
                  <th className="p-2 text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {payslip.details
                  .filter(detail => detail.type === 'earning')
                  .map((detail, index) => (
                    <tr key={`earning-${index}`} className="border-b border-gray-200">
                      <td className="p-2">{detail.label}</td>
                      <td className="p-2">{detail.base || '-'}</td>
                      <td className="p-2">{detail.rate || '-'}</td>
                      <td className="p-2 text-right">{formatCurrency(detail.amount)}</td>
                    </tr>
                  ))}
                <tr className="font-medium bg-gray-50">
                  <td className="p-2" colSpan={3}>Salaire Brut</td>
                  <td className="p-2 text-right">{formatCurrency(payslip.grossSalary)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Cotisations et Contributions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-left">Rubrique</th>
                  <th className="p-2 text-left">Base</th>
                  <th className="p-2 text-left">Taux</th>
                  <th className="p-2 text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {payslip.details
                  .filter(detail => detail.type === 'deduction')
                  .map((detail, index) => (
                    <tr key={`deduction-${index}`} className="border-b border-gray-200">
                      <td className="p-2">{detail.label}</td>
                      <td className="p-2">{detail.base || '-'}</td>
                      <td className="p-2">{detail.rate || '-'}</td>
                      <td className="p-2 text-right">{formatCurrency(detail.amount)}</td>
                    </tr>
                  ))}
                <tr className="font-medium bg-gray-50">
                  <td className="p-2" colSpan={3}>Total des Cotisations</td>
                  <td className="p-2 text-right">{formatCurrency(payslip.totalDeductions)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="rounded-md bg-primary/5 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h3 className="text-xl font-bold">Net à payer</h3>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(payslip.netSalary)}
            </span>
          </div>
        </div>
        
        <div className="pt-4 text-center text-xs text-muted-foreground">
          Document à conserver sans limitation de durée
        </div>
      </CardContent>
    </Card>
  );
};

export default PayslipDetails;
