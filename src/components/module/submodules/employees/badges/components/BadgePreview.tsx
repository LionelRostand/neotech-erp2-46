import React from 'react';
import { BadgeData } from '../BadgeTypes';
import { Employee } from '@/types/employee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  // Safe function to get employee initials
  const getInitials = (name: string | undefined): string => {
    if (!name) return 'ID';
    
    // Split by space and get first two parts
    const parts = name.split(' ');
    
    if (parts.length === 1) {
      // If only one name, use first two letters
      return (parts[0].substring(0, 2) || '').toUpperCase();
    } 
    
    // Otherwise use first letter of first and last name
    return (parts[0].charAt(0) + (parts[1]?.charAt(0) || '')).toUpperCase();
  };

  const getAvatarContent = () => {
    if (employee?.photoURL) {
      return (
        <Avatar className="h-16 w-16 mx-auto mb-3">
          <AvatarImage src={employee.photoURL} alt={badge.employeeName || 'Employee'} />
          <AvatarFallback>{getInitials(badge.employeeName)}</AvatarFallback>
        </Avatar>
      );
    }
    
    return (
      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
        <span className="text-lg font-semibold">{getInitials(badge.employeeName)}</span>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 rounded-md p-6 mb-4">
      <div className={`h-2 w-full mb-3 rounded-t ${
        badge.status === 'success' ? 'bg-green-500' : 
        badge.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
      }`}></div>
      
      {getAvatarContent()}
      
      <div className="text-center mb-3">
        <p className="text-sm text-gray-500">ID: {badge.id}</p>
        <h3 className="text-lg font-bold">{badge.employeeName || 'Employee'}</h3>
        <p className="text-sm text-gray-600">Entreprise: {companyName || 'Non spécifiée'}</p>
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
            {badge.statusText || 'N/A'}
          </span>
        </p>
        <p><span className="font-medium">Date d'émission:</span> {badge.date || 'N/A'}</p>
      </div>
      
      {employee && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Informations supplémentaires</p>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Email professionnel:</span> {employee.professionalEmail || 'Non spécifié'}</p>
            <p><span className="font-medium">Poste:</span> {employee.position || 'Non spécifié'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgePreview;
