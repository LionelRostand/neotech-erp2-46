
import React from 'react';

interface SalaryCalculationCardProps {
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
}

const SalaryCalculationCard: React.FC<SalaryCalculationCardProps> = ({ 
  grossSalary, 
  totalDeductions, 
  netSalary 
}) => {
  return (
    <div className="border rounded-lg p-5">
      <div className="flex items-center mb-4">
        <div className="bg-gray-100 rounded-full p-2 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 17a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v0Z"/>
            <path d="M12 12V2"/>
            <path d="m8 5 4-3 4 3"/>
          </svg>
        </div>
        <h3 className="font-bold text-lg">Calcul du salaire net</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <p>Rémunération brute</p>
          <p className="font-medium">{grossSalary.toFixed(2)} €</p>
        </div>
        <p className="text-xs text-gray-500">Dont 0,00 € de primes</p>
        
        <div className="flex justify-between">
          <p>Cotisations et contributions salariales</p>
          <p className="font-medium">- {(totalDeductions * 1.82).toFixed(2)} €</p>
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
          <p className="font-medium">- {(grossSalary * 0.036).toFixed(2)} €</p>
        </div>
        
        <div className="flex justify-between font-bold mt-2 pt-2 border-t">
          <p>Net à payer</p>
          <p>{netSalary.toFixed(2)} €</p>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculationCard;
