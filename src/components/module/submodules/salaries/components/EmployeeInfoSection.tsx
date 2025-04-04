
import React from 'react';

export interface EmployeeInfoSectionProps {
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
    <div className="space-y-2">
      <h3 className="font-bold text-lg">{firstName} {lastName}</h3>
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Poste:</span> {role}</p>
        <p><span className="font-medium">N° de sécurité sociale:</span> {socialSecurityNumber}</p>
        <p><span className="font-medium">Date d'embauche:</span> {new Date(startDate).toLocaleDateString('fr-FR')}</p>
        <p><span className="font-medium">Période:</span> {period}</p>
        <p><span className="font-medium">Heures travaillées:</span> {hoursWorked}h</p>
      </div>
    </div>
  );
};

export default EmployeeInfoSection;
