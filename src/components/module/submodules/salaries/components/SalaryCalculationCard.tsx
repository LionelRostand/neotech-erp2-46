
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PaySlipDetail } from '@/types/payslip';

interface SalaryCalculationCardProps {
  details: PaySlipDetail[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
}

const SalaryCalculationCard: React.FC<SalaryCalculationCardProps> = ({ 
  details, 
  grossSalary, 
  totalDeductions, 
  netSalary 
}) => {
  const earnings = details.filter(detail => detail.type === 'earning');
  const deductions = details.filter(detail => detail.type === 'deduction');

  return (
    <Card className="mt-4">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-md mb-2">Calcul du salaire</h3>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Salaire et primes</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left pb-2">Désignation</th>
                <th className="text-right pb-2">Base</th>
                <th className="text-right pb-2">Taux</th>
                <th className="text-right pb-2">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {earnings.length > 0 ? (
                earnings.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2">{item.label}</td>
                    <td className="text-right py-2">{item.base || '-'}</td>
                    <td className="text-right py-2">{item.rate || '-'}</td>
                    <td className="text-right py-2 font-medium">{item.amount.toLocaleString('fr-FR')} €</td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-100">
                  <td className="py-2">Salaire de base</td>
                  <td className="text-right py-2">151.67 h</td>
                  <td className="text-right py-2">16.48 €/h</td>
                  <td className="text-right py-2 font-medium">{grossSalary.toLocaleString('fr-FR')} €</td>
                </tr>
              )}
              <tr className="font-medium">
                <td colSpan={3} className="py-2 text-right">Total brut:</td>
                <td className="text-right py-2">{grossSalary.toLocaleString('fr-FR')} €</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Cotisations et contributions</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left pb-2">Désignation</th>
                <th className="text-right pb-2">Base</th>
                <th className="text-right pb-2">Taux</th>
                <th className="text-right pb-2">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deductions.length > 0 ? (
                deductions.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2">{item.label}</td>
                    <td className="text-right py-2">{item.base || '-'}</td>
                    <td className="text-right py-2">{item.rate || '-'}</td>
                    <td className="text-right py-2 font-medium">-{item.amount.toLocaleString('fr-FR')} €</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Sécurité sociale</td>
                    <td className="text-right py-2">{grossSalary.toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-2">7.3%</td>
                    <td className="text-right py-2 font-medium">-{(grossSalary * 0.073).toLocaleString('fr-FR')} €</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Retraite complémentaire</td>
                    <td className="text-right py-2">{grossSalary.toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-2">3.15%</td>
                    <td className="text-right py-2 font-medium">-{(grossSalary * 0.0315).toLocaleString('fr-FR')} €</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Assurance chômage</td>
                    <td className="text-right py-2">{grossSalary.toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-2">2.4%</td>
                    <td className="text-right py-2 font-medium">-{(grossSalary * 0.024).toLocaleString('fr-FR')} €</td>
                  </tr>
                </>
              )}
              <tr className="font-medium">
                <td colSpan={3} className="py-2 text-right">Total retenues:</td>
                <td className="text-right py-2">-{totalDeductions.toLocaleString('fr-FR')} €</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between font-bold">
            <span>Net à payer:</span>
            <span>{netSalary.toLocaleString('fr-FR')} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalaryCalculationCard;
