
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types/employee';

interface InformationsTabProps {
  employee: Employee & { departmentName?: string };
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee }) => {
  // Format address display, handling both string and object formats
  const getFormattedAddress = (address: any) => {
    if (!address) return '-';
    
    if (typeof address === 'string') return address;
    
    const addressParts = [];
    if (address.street) addressParts.push(address.street);
    if (address.city) addressParts.push(address.city);
    if (address.postalCode) addressParts.push(address.postalCode);
    if (address.country) addressParts.push(address.country);
    
    return addressParts.length > 0 ? addressParts.join(', ') : '-';
  };

  // Format date display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Informations personnelles */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div>
              <p className="text-sm text-muted-foreground">Prénom</p>
              <p>{employee.firstName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nom</p>
              <p>{employee.lastName || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p>{formatDate(employee.birthDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email personnel</p>
              <p className="truncate">{employee.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Téléphone</p>
              <p>{employee.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">N° Sécurité Sociale</p>
              <p>{employee.socialSecurityNumber || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations professionnelles */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Informations professionnelles</h3>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div>
              <p className="text-sm text-muted-foreground">Poste</p>
              <p>{employee.position || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Département</p>
              <p>{employee.departmentName || employee.department || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date d'embauche</p>
              <p>{formatDate(employee.hireDate || employee.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email professionnel</p>
              <p className="truncate">{employee.professionalEmail || employee.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <p>
                <Badge 
                  variant={
                    employee.status === 'active' || employee.status === 'Actif'
                      ? 'default'
                      : employee.status === 'inactive' || employee.status === 'Inactif'
                      ? 'outline'
                      : employee.status === 'onLeave' || employee.status === 'En congé'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {employee.status === 'active' ? 'Actif' : 
                   employee.status === 'inactive' ? 'Inactif' : 
                   employee.status === 'onLeave' ? 'En congé' : 
                   employee.status || '-'}
                </Badge>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type de contrat</p>
              <p>{employee.contract || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adresse personnelle */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Adresse personnelle</h3>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p>{getFormattedAddress(employee.address)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ville</p>
              <p>{employee.city || (employee.address && typeof employee.address !== 'string' ? employee.address.city : '-')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Code postal</p>
              <p>{employee.postalCode || employee.zipCode || (employee.address && typeof employee.address !== 'string' ? employee.address.postalCode : '-')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pays</p>
              <p>{employee.country || (employee.address && typeof employee.address !== 'string' ? employee.address.country : '-')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adresse professionnelle */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Adresse professionnelle</h3>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Adresse</p>
              <p>{employee.workAddress ? getFormattedAddress(employee.workAddress) : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ville</p>
              <p>{employee.workAddress?.city || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Code postal</p>
              <p>{employee.workAddress?.postalCode || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pays</p>
              <p>{employee.workAddress?.country || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationsTab;
