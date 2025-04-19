
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';

export interface InformationsTabProps {
  employee: Employee;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee,
  onEmployeeUpdated
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                <p>{employee.birthDate || "Non renseignée"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Numéro de sécurité sociale</p>
                <p>{employee.socialSecurityNumber || "Non renseigné"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Adresse</p>
                <p>
                  {typeof employee.address === 'object' 
                    ? `${employee.address.street || ''}, ${employee.address.postalCode || ''} ${employee.address.city || ''}`
                    : employee.address || "Non renseignée"}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Informations professionnelles</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Poste</p>
                <p>{employee.position}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Département</p>
                <p>{employee.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date d'embauche</p>
                <p>{new Date(employee.hireDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Manager</p>
                <p>{employee.manager || "Aucun"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Type de contrat</p>
                <p>{employee.contract || "Non spécifié"}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InformationsTab;
