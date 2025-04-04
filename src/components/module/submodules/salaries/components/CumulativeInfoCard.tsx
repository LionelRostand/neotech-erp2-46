
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface CumulativeInfoCardProps {
  annualCumulative: {
    grossSalary: number;
    netSalary: number;
    taxableIncome: number;
  };
}

const CumulativeInfoCard: React.FC<CumulativeInfoCardProps> = ({ annualCumulative }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-md mb-3">Cumuls annuels</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Salaire brut:</span>
            <span className="text-sm font-medium">{annualCumulative.grossSalary.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Salaire net:</span>
            <span className="text-sm font-medium">{annualCumulative.netSalary.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Net imposable:</span>
            <span className="text-sm font-medium">{annualCumulative.taxableIncome.toLocaleString('fr-FR')} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CumulativeInfoCard;
