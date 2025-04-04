
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
    <div className="space-y-1 text-right">
      <h3 className="font-bold text-lg">{firstName} {lastName}</h3>
      <p className="text-sm">{role}</p>
      <p className="text-sm">N° SS: {socialSecurityNumber}</p>
      <p className="text-sm">Date d'entrée: {startDate}</p>
      <p className="text-sm">Période: {period}</p>
      <p className="text-sm">Heures travaillées: {hoursWorked.toFixed(2)}h</p>
    </div>
  );
};

export default EmployeeInfoSection;
