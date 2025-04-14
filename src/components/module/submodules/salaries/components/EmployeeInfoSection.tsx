
import React from 'react';

interface EmployeeInfoSectionProps {
  firstName: string;
  lastName: string;
  role: string;
  socialSecurityNumber: string;
  period: string;
  startDate: string;
  hoursWorked: number;
}

const EmployeeInfoSection: React.FC<EmployeeInfoSectionProps> = ({
  firstName,
  lastName,
  role,
  socialSecurityNumber,
  period,
  startDate,
  hoursWorked
}) => {
  return (
    <div>
      <h3 className="font-bold text-lg mb-2">Employé</h3>
      <div className="space-y-1 text-sm">
        <p className="font-medium">{firstName} {lastName}</p>
        <p>Poste: {role}</p>
        <p>N° SS: {socialSecurityNumber}</p>
        <p>Période: {period}</p>
        <p>Date d'embauche: {new Date(startDate).toLocaleDateString('fr-FR')}</p>
        <p>Heures travaillées: {hoursWorked.toFixed(2)}h</p>
      </div>
    </div>
  );
};

export default EmployeeInfoSection;
