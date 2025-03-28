
import React from 'react';

interface PayslipWelcomeCardProps {
  firstName: string;
  period: string;
  grossSalary: number;
  netSalary: number;
  paymentDate: string;
  netSocialAmount: number;
}

const PayslipWelcomeCard: React.FC<PayslipWelcomeCardProps> = ({ 
  firstName, 
  period, 
  grossSalary, 
  netSalary, 
  paymentDate,
  netSocialAmount
}) => {
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-1">Bonjour {firstName}</h2>
      <p className="text-gray-600 mb-6">Voici votre bulletin de paie de {period}</p>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Votre salaire avant impôt</p>
            <p className="text-xs text-gray-500">Prélèvement à la source ({(3.6).toFixed(2)} %)</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{grossSalary.toFixed(2)} €</p>
            <p className="text-xs text-gray-500">{(grossSalary * 0.036).toFixed(2)} €</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Votre salaire après impôt</p>
            <p className="text-xs text-gray-500">Ce montant vous sera transféré le {paymentDate}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{netSalary.toFixed(2)} €</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Votre montant net social</p>
            <p className="text-xs text-gray-500">Ce montant sert au calcul de vos aides sociales</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{netSocialAmount.toFixed(2)} €</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipWelcomeCard;
