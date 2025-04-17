
import React from 'react';

interface EmployeeInfoProps {
  firstName: string;
  lastName: string;
  role: string;
  socialSecurityNumber: string;
  period: string;
  startDate: string;
  hoursWorked: number;
}

const EmployeeInfoSection: React.FC<EmployeeInfoProps> = ({
  firstName,
  lastName,
  role,
  socialSecurityNumber,
  period,
  startDate,
  hoursWorked
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-2">Employé</h3>
      <div className="space-y-1 text-sm">
        <p className="font-medium text-base">{firstName} {lastName}</p>
        <p>Poste: {role}</p>
        <p>N° Sécurité Sociale: {socialSecurityNumber}</p>
        <p>Date d'embauche: {formatDate(startDate)}</p>
        <p>Période: {period}</p>
        <p>Heures travaillées: {hoursWorked.toFixed(2)}h</p>
      </div>
    </div>
  );
};

export default EmployeeInfoSection;
