
import React from 'react';
import { Employee } from '@/types/employee';

interface InformationsTabProps {
  employee: Employee;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Informations personnelles</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Prénom</div>
            <div>{employee.firstName || '-'}</div>
            
            <div className="text-gray-500">Nom</div>
            <div>{employee.lastName || '-'}</div>
            
            <div className="text-gray-500">Date de naissance</div>
            <div>{formatDate(employee.birthDate)}</div>
            
            <div className="text-gray-500">Email</div>
            <div>{employee.email || '-'}</div>
            
            <div className="text-gray-500">Téléphone</div>
            <div>{employee.phone || '-'}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Informations professionnelles</h3>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">Poste</div>
            <div>{employee.position || '-'}</div>
            
            <div className="text-gray-500">Département</div>
            <div>{employee.department || '-'}</div>
            
            <div className="text-gray-500">Date d'embauche</div>
            <div>{formatDate(employee.hireDate)}</div>
            
            <div className="text-gray-500">Statut</div>
            <div>{employee.status || '-'}</div>
            
            <div className="text-gray-500">Type de contrat</div>
            <div>{employee.contract || '-'}</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Adresse</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="text-gray-500">Adresse</div>
          <div>{employee.address || '-'}</div>
          
          <div className="text-gray-500">Ville</div>
          <div>{employee.city || '-'}</div>
          
          <div className="text-gray-500">Code postal</div>
          <div>{employee.postalCode || '-'}</div>
          
          <div className="text-gray-500">Pays</div>
          <div>{employee.country || '-'}</div>
        </div>
      </div>
    </div>
  );
};

export default InformationsTab;
