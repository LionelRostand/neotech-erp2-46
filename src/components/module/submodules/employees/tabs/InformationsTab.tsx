import React from 'react';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface InformationsTabProps {
  employee: Employee;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  // Fonction pour formater une adresse
  const formatAddress = (address: EmployeeAddress | string): string => {
    if (typeof address === 'string') {
      return address;
    }
    
    const { street, city, postalCode, country } = address;
    const parts = [street, city, postalCode, country].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Nom complet</h4>
          <p>{employee.firstName} {employee.lastName}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Email</h4>
          <p>{employee.email}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Téléphone</h4>
          <p>{employee.phone || 'Non renseigné'}</p>
        </div>
        <Separator />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Adresse</h4>
          <p>{formatAddress(employee.address)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InformationsTab;
