
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Save, MapPin, Home, Building, Landmark } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InformationsTabProps {
  employee: Employee;
  onAddressUpdated?: (address: EmployeeAddress) => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee, onAddressUpdated }) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState<EmployeeAddress>(() => {
    if (typeof employee.address === 'object' && employee.address !== null) {
      return employee.address as EmployeeAddress;
    }
    return {
      street: '',
      streetNumber: '',
      city: '',
      postalCode: '',
      country: 'France',
    };
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non renseigné';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Invalid date format:', dateString);
      return 'Date invalide';
    }
  };

  const formatAddress = (address: string | EmployeeAddress | undefined) => {
    if (!address) return 'Adresse non renseignée';
    
    if (typeof address === 'string') return address;
    
    const addressObj = address as EmployeeAddress;
    let formattedAddress = '';
    
    if (addressObj.streetNumber) {
      formattedAddress += `${addressObj.streetNumber} `;
    }
    
    formattedAddress += `${addressObj.street}, ${addressObj.city}, ${addressObj.postalCode}`;
    
    if (addressObj.country) {
      formattedAddress += `, ${addressObj.country}`;
    }
    
    return formattedAddress;
  };

  const handleStartAddressEdit = () => {
    setIsEditingAddress(true);
  };

  const handleCancelAddressEdit = () => {
    setIsEditingAddress(false);
    // Reset address to employee address
    if (typeof employee.address === 'object' && employee.address !== null) {
      setAddress(employee.address as EmployeeAddress);
    } else {
      setAddress({
        street: '',
        streetNumber: '',
        city: '',
        postalCode: '',
        country: 'France',
      });
    }
  };

  const handleAddressChange = (field: keyof EmployeeAddress) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSaveAddress = () => {
    if (onAddressUpdated) {
      onAddressUpdated(address);
    }
    setIsEditingAddress(false);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Informations personnelles */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="font-medium">{employee.firstName} {employee.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{employee.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email professionnel</p>
              <p className="font-medium">{employee.professionalEmail || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium">{employee.phone || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de naissance</p>
              <p className="font-medium">{formatDate(employee.birthDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Numéro de sécurité sociale</p>
              <p className="font-medium">{employee.socialSecurityNumber || 'Non renseigné'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adresse */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Adresse</CardTitle>
            {!isEditingAddress ? (
              <Button variant="outline" size="sm" onClick={handleStartAddressEdit}>
                <Edit2 className="h-4 w-4 mr-1" />
                Modifier
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelAddressEdit}>
                  Annuler
                </Button>
                <Button variant="default" size="sm" onClick={handleSaveAddress}>
                  <Save className="h-4 w-4 mr-1" />
                  Enregistrer
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isEditingAddress ? (
            <p className="font-medium">{formatAddress(employee.address)}</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Numéro de rue</label>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      value={address.streetNumber || ''} 
                      onChange={handleAddressChange('streetNumber')} 
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Rue</label>
                  <div className="flex items-center mt-1">
                    <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      value={address.street} 
                      onChange={handleAddressChange('street')} 
                      placeholder="Rue de l'exemple"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Ville</label>
                  <div className="flex items-center mt-1">
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      value={address.city} 
                      onChange={handleAddressChange('city')} 
                      placeholder="Paris"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Code postal</label>
                  <div className="flex items-center mt-1">
                    <Landmark className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      value={address.postalCode} 
                      onChange={handleAddressChange('postalCode')} 
                      placeholder="75000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations professionnelles */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Informations professionnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Poste</p>
              <p className="font-medium">{employee.position || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Département</p>
              <p className="font-medium">{employee.department || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date d'embauche</p>
              <p className="font-medium">{formatDate(employee.hireDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type de contrat</p>
              <p className="font-medium">{employee.contract || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Manager</p>
              <p className="font-medium">{employee.manager || 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Entreprise</p>
              <p className="font-medium">
                {typeof employee.company === 'string' 
                  ? employee.company || 'Non renseigné'
                  : employee.company?.name || 'Non renseigné'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationsTab;
