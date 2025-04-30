
import React from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface InformationsTabProps {
  employee: Employee;
}

export const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  const { departments } = useEmployeeData();
  
  const getDepartmentName = (id: string) => {
    const department = departments?.find(d => d.id === id);
    return department ? department.name : id;
  };
  
  const renderAddressSection = () => {
    const hasAddress = employee.streetNumber || employee.streetName || employee.city || 
                     employee.zipCode || employee.region || employee.country;
    
    if (!hasAddress) return <p className="text-gray-500 italic">Aucune adresse enregistrée</p>;
    
    return (
      <div className="space-y-1">
        {(employee.streetNumber || employee.streetName) && (
          <p>{employee.streetNumber} {employee.streetName}</p>
        )}
        {(employee.zipCode || employee.city) && (
          <p>{employee.zipCode} {employee.city}</p>
        )}
        {employee.region && <p>{employee.region}</p>}
        {employee.country && <p>{employee.country}</p>}
      </div>
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Informations personnelles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-sm text-gray-500">Prénom</p>
              <p>{employee.firstName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nom</p>
              <p>{employee.lastName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="break-all">{employee.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p>{employee.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de naissance</p>
              <p>
                {employee.birthDate 
                  ? new Date(employee.birthDate).toLocaleDateString('fr-FR')
                  : '-'}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Adresse</p>
            {renderAddressSection()}
          </div>
        </div>
      </div>
      
      {/* Informations professionnelles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-sm text-gray-500">Poste</p>
              <p>{employee.position || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email professionnel</p>
              <p className="break-all">{employee.professionalEmail || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Département</p>
              <p>{employee.department ? getDepartmentName(employee.department) : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Entreprise</p>
              <p>
                {employee.company 
                  ? (typeof employee.company === 'string' 
                      ? employee.company 
                      : employee.company.name)
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date d'embauche</p>
              <p>
                {employee.hireDate 
                  ? new Date(employee.hireDate).toLocaleDateString('fr-FR')
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type de contrat</p>
              <p>{employee.contract || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <p>{employee.status || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Manager</p>
              <p>{employee.isManager ? 'Oui' : 'Non'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
