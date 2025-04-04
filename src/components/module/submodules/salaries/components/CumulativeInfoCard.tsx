
import React from 'react';

interface CumulativeInfoCardProps {
  annualCumulative: {
    grossSalary: number;
    netSalary: number;
    taxableIncome: number;
  };
}

const CumulativeInfoCard: React.FC<CumulativeInfoCardProps> = ({ annualCumulative }) => {
  return (
    <div className="bg-amber-50 rounded-lg p-5">
      <div className="flex items-center mb-4">
        <div className="bg-amber-100 rounded-full p-2 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
        <h3 className="font-bold text-lg">Cumuls DEPUIS JANV. 2025</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <p>Salaire net imposable</p>
          <p className="font-medium">{annualCumulative.taxableIncome.toFixed(2)} €</p>
        </div>
        <div className="flex justify-between">
          <p>Salaire brut</p>
          <p className="font-medium">{annualCumulative.grossSalary.toFixed(2)} €</p>
        </div>
        <div className="flex justify-between">
          <p>Prélèvement à la source</p>
          <p className="font-medium">{(annualCumulative.netSalary * 0.075).toFixed(2)} €</p>
        </div>
        <div className="flex justify-between">
          <p>Montant net des heures supplémentaires exonérées</p>
          <p className="font-medium">{(annualCumulative.netSalary * 0.28).toFixed(2)} €</p>
        </div>
      </div>
    </div>
  );
};

export default CumulativeInfoCard;
