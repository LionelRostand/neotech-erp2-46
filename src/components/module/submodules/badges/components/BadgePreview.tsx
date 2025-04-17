
import React from 'react';
import { BadgeData } from '../BadgeTypes';
import { Employee } from '@/types/employee';

interface BadgePreviewProps {
  badge: BadgeData;
  companyName: string;
  employee: Employee | null;
}

const BadgePreview: React.FC<BadgePreviewProps> = ({ 
  badge, 
  companyName, 
  employee 
}) => {
  return (
    <div className="bg-gray-100 rounded-md p-6 mb-4">
      <div className={`h-2 w-full mb-3 rounded-t ${
        badge.status === 'success' ? 'bg-green-500' : 
        badge.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
      }`}></div>
      
      <div className="text-center mb-3">
        <p className="text-sm text-gray-500">ID: {badge.id}</p>
        <h3 className="text-lg font-bold">{badge.employeeName}</h3>
        <p className="text-sm text-gray-600">Entreprise: {companyName}</p>
      </div>
      
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Département:</span> {badge.department || 'N/A'}</p>
        <p><span className="font-medium">Niveau d'accès:</span> {badge.accessLevel || 'Standard'}</p>
        <p>
          <span className="font-medium">Statut:</span> 
          <span className={`ml-1 ${
            badge.status === 'success' ? 'text-green-600' : 
            badge.status === 'warning' ? 'text-amber-600' : 'text-red-600'
          }`}>
            {badge.statusText}
          </span>
        </p>
        <p><span className="font-medium">Date d'émission:</span> {badge.date}</p>
      </div>
      
      {employee && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Informations supplémentaires</p>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Email professionnel:</span> {employee.professionalEmail || 'Non spécifié'}</p>
            <p><span className="font-medium">Poste:</span> {employee.position}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgePreview;
