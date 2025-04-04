
import React from 'react';
import { PaySlipDetail } from '@/types/payslip';

interface SalaryCompositionCardProps {
  details: PaySlipDetail[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
}

const SalaryCompositionCard: React.FC<SalaryCompositionCardProps> = ({
  details,
  grossSalary,
  totalDeductions,
  netSalary
}) => {
  const earnings = details.filter(detail => detail.type === 'earning');
  const deductions = details.filter(detail => detail.type === 'deduction');

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Rubriques</th>
            <th className="px-4 py-2 text-right font-medium">Base</th>
            <th className="px-4 py-2 text-right font-medium">Taux</th>
            <th className="px-4 py-2 text-right font-medium">Montant</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {/* Earnings section */}
          {earnings.map((earning, index) => (
            <tr key={`earning-${index}`} className="bg-white">
              <td className="px-4 py-2 text-left">{earning.label}</td>
              <td className="px-4 py-2 text-right">{earning.base || '-'}</td>
              <td className="px-4 py-2 text-right">{earning.rate || '-'}</td>
              <td className="px-4 py-2 text-right font-medium">{earning.amount.toFixed(2)} €</td>
            </tr>
          ))}
          
          <tr className="bg-gray-50 font-medium">
            <td className="px-4 py-2 text-left" colSpan={3}>Total brut</td>
            <td className="px-4 py-2 text-right">{grossSalary.toFixed(2)} €</td>
          </tr>
          
          {/* Deductions section */}
          <tr className="bg-gray-100">
            <td className="px-4 py-2 text-left font-medium" colSpan={4}>Cotisations et contributions sociales</td>
          </tr>
          
          {deductions.map((deduction, index) => (
            <tr key={`deduction-${index}`} className="bg-white">
              <td className="px-4 py-2 text-left">{deduction.label}</td>
              <td className="px-4 py-2 text-right">{deduction.base || '-'}</td>
              <td className="px-4 py-2 text-right">{deduction.rate || '-'}</td>
              <td className="px-4 py-2 text-right text-gray-600">-{deduction.amount.toFixed(2)} €</td>
            </tr>
          ))}
          
          <tr className="bg-gray-50 font-medium">
            <td className="px-4 py-2 text-left" colSpan={3}>Total des cotisations</td>
            <td className="px-4 py-2 text-right text-gray-600">-{totalDeductions.toFixed(2)} €</td>
          </tr>
          
          <tr className="bg-blue-50 font-bold">
            <td className="px-4 py-3 text-left" colSpan={3}>Net à payer</td>
            <td className="px-4 py-3 text-right">{netSalary.toFixed(2)} €</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SalaryCompositionCard;
