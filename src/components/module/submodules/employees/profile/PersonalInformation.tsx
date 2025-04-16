
import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin } from 'lucide-react';
import { formatAddress } from '../utils/formatUtils';

interface PersonalInformationProps {
  employee: Employee;
}

const PersonalInformation = ({ employee }: PersonalInformationProps) => {
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
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email
          </h4>
          <p>{employee.email}</p>
        </div>
        <Separator />
        
        <div className="space-y-1">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            Téléphone
          </h4>
          <p>{employee.phone || 'Non renseigné'}</p>
        </div>
        <Separator />
        
        <div className="space-y-1">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Adresse
          </h4>
          <p>{formatAddress(employee.address)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;
