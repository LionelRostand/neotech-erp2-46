
import React from 'react';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Building, Phone, Mail, Briefcase } from 'lucide-react';
import ManagerCheckbox from '../form/ManagerCheckbox';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../form/employeeFormSchema';

interface InformationsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
  form?: UseFormReturn<EmployeeFormValues>;
  showManagerOption?: boolean;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee, 
  isEditing = false, 
  onFinishEditing,
  form,
  showManagerOption = true
}) => {
  // Fonction pour formater une adresse
  const formatAddress = (address: EmployeeAddress | string): string => {
    if (typeof address === 'string') {
      return address;
    }
    
    const parts = [];
    
    // Construire la ligne de rue
    if (address.street) {
      parts.push(address.street);
    }
    
    // Construire la ligne de ville/code postal
    const cityParts = [];
    if (address.postalCode) cityParts.push(address.postalCode);
    if (address.city) cityParts.push(address.city);
    if (cityParts.length > 0) {
      parts.push(cityParts.join(' '));
    }
    
    // Ajouter le département/état si disponible
    if (address.state) {
      parts.push(address.state);
    }
    
    // Ajouter le pays si disponible et différent de France
    if (address.country && address.country.toLowerCase() !== 'france') {
      parts.push(address.country);
    }
    
    return parts.join(', ');
  };

  // Extraire les composants individuels de l'adresse pour un affichage détaillé
  const getAddressComponents = (address: EmployeeAddress | string) => {
    if (typeof address === 'string') {
      return { street: address, city: '', postalCode: '', state: '', country: '' };
    }
    return address;
  };

  const addressComponents = getAddressComponents(employee.address);

  console.log('Affichage des informations de l\'employé:', employee);
  console.log('Composants d\'adresse:', addressComponents);

  return (
    <div className="space-y-6">
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
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Adresse
            </h4>
            
            {typeof employee.address === 'object' ? (
              <div className="grid grid-cols-1 gap-2">
                {addressComponents.street && (
                  <div>
                    <p className="text-sm text-muted-foreground">Rue</p>
                    <p>{addressComponents.street}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  {addressComponents.postalCode && (
                    <div>
                      <p className="text-sm text-muted-foreground">Code postal</p>
                      <p>{addressComponents.postalCode}</p>
                    </div>
                  )}
                  
                  {addressComponents.city && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ville</p>
                      <p>{addressComponents.city}</p>
                    </div>
                  )}
                </div>
                
                {addressComponents.state && (
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      Département
                    </p>
                    <p>{addressComponents.state}</p>
                  </div>
                )}
              </div>
            ) : (
              <p>{formatAddress(employee.address)}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations professionnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {employee.position && (
            <>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Poste
                </h4>
                <p>{employee.position}</p>
              </div>
              <Separator />
            </>
          )}
          
          {employee.department && (
            <>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Département</h4>
                <p>{employee.department}</p>
              </div>
              <Separator />
            </>
          )}
          
          {employee.contract && (
            <>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Type de contrat</h4>
                <p>{employee.contract}</p>
              </div>
              <Separator />
            </>
          )}
          
          {employee.manager && (
            <>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Manager</h4>
                <p>{employee.manager}</p>
              </div>
              <Separator />
            </>
          )}
          
          {employee.status && (
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Statut</h4>
              <p>{employee.status}</p>
            </div>
          )}
          
          {form && showManagerOption && (
            <div className="mt-4">
              <ManagerCheckbox form={form} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationsTab;
