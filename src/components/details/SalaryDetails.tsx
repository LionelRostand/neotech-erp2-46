
import React from 'react';
import { EmployeeSalary } from '@/hooks/useEmployeeSalaries';
import { Separator } from '@/components/ui/separator';

interface SalaryDetailsProps {
  salary: EmployeeSalary;
}

const SalaryDetails: React.FC<SalaryDetailsProps> = ({ salary }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Employé</h3>
          <p className="text-base font-medium">{salary.employeeName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">ID Employé</h3>
          <p className="text-base font-medium">{salary.employeeId}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Montant</h3>
          <p className="text-base font-medium">{salary.amount} {salary.currency}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Statut</h3>
          <span className={`px-2 py-1 rounded-full text-xs ${
            salary.status === 'Payé' ? 'bg-green-100 text-green-800' :
            salary.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {salary.status}
          </span>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Date effective</h3>
          <p className="text-base font-medium">{formatDate(salary.effectiveDate)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Date de paiement</h3>
          <p className="text-base font-medium">{formatDate(salary.paymentDate)}</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Méthode de paiement</h3>
          <p className="text-base font-medium">{salary.paymentMethod || 'Non spécifié'}</p>
        </div>
      </div>

      {salary.description && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="text-base">{salary.description}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default SalaryDetails;
