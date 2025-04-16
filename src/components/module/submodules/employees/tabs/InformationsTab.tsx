
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Employee, EmployeeAddress } from '@/types/employee';
import { toast } from 'sonner';

export interface InformationsTabProps {
  employee: Employee;
  onAddressUpdated?: (addressData: any) => Promise<void>;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee,
  onAddressUpdated = async () => {} 
}) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressData, setAddressData] = useState<EmployeeAddress>(
    typeof employee.address === 'object' 
      ? employee.address as EmployeeAddress 
      : {
          street: '',
          streetNumber: '',
          city: '',
          postalCode: '',
          country: 'France'
        }
  );

  const handleEditAddress = () => {
    setIsEditingAddress(true);
  };

  const handleCancelEdit = () => {
    // Reset to original address data
    setAddressData(
      typeof employee.address === 'object' 
        ? employee.address as EmployeeAddress 
        : {
            street: '',
            streetNumber: '',
            city: '',
            postalCode: '',
            country: 'France'
          }
    );
    setIsEditingAddress(false);
  };

  const handleSaveAddress = async () => {
    try {
      await onAddressUpdated(addressData);
      setIsEditingAddress(false);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error("Une erreur s'est produite lors de l'enregistrement de l'adresse");
    }
  };

  const handleAddressChange = (field: keyof EmployeeAddress, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format address for display
  const formatAddress = () => {
    if (typeof employee.address === 'string') {
      return employee.address;
    }
    
    if (typeof employee.address === 'object' && employee.address) {
      const addr = employee.address as EmployeeAddress;
      const streetWithNumber = addr.streetNumber 
        ? `${addr.streetNumber} ${addr.street}`
        : addr.street;
      
      return `${streetWithNumber}, ${addr.postalCode} ${addr.city}, ${addr.country}`;
    }
    
    return 'Adresse non spécifiée';
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Informations de {employee.firstName} {employee.lastName}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Informations personnelles</h3>
            <div className="space-y-4">
              <div>
                <Label>Nom</Label>
                <div className="mt-1">{employee.lastName}</div>
              </div>
              <div>
                <Label>Prénom</Label>
                <div className="mt-1">{employee.firstName}</div>
              </div>
              <div>
                <Label>Date de naissance</Label>
                <div className="mt-1">{employee.birthDate || 'Non spécifié'}</div>
              </div>
              <div>
                <Label>Adresse</Label>
                <div className="mt-1 flex justify-between items-start">
                  {isEditingAddress ? (
                    <div className="w-full space-y-4">
                      <div>
                        <Label htmlFor="streetNumber">Numéro</Label>
                        <Input
                          id="streetNumber"
                          value={addressData.streetNumber || ''}
                          onChange={(e) => handleAddressChange('streetNumber', e.target.value)}
                          placeholder="Numéro"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="street">Rue</Label>
                        <Input
                          id="street"
                          value={addressData.street}
                          onChange={(e) => handleAddressChange('street', e.target.value)}
                          placeholder="Rue"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                          id="postalCode"
                          value={addressData.postalCode}
                          onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                          placeholder="Code postal"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={addressData.city}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          placeholder="Ville"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Pays</Label>
                        <Input
                          id="country"
                          value={addressData.country}
                          onChange={(e) => handleAddressChange('country', e.target.value)}
                          placeholder="Pays"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button onClick={handleSaveAddress}>Enregistrer</Button>
                        <Button variant="outline" onClick={handleCancelEdit}>Annuler</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>{formatAddress()}</div>
                      <Button variant="ghost" size="sm" onClick={handleEditAddress}>
                        Modifier
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div>
                <Label>Numéro de sécurité sociale</Label>
                <div className="mt-1">{employee.socialSecurityNumber || 'Non spécifié'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Professional Information */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Informations professionnelles</h3>
            <div className="space-y-4">
              <div>
                <Label>Email professionnel</Label>
                <div className="mt-1">{employee.professionalEmail || employee.email}</div>
              </div>
              <div>
                <Label>Téléphone</Label>
                <div className="mt-1">{employee.phone || 'Non spécifié'}</div>
              </div>
              <div>
                <Label>Poste</Label>
                <div className="mt-1">{employee.position || employee.title}</div>
              </div>
              <div>
                <Label>Département</Label>
                <div className="mt-1">{employee.department}</div>
              </div>
              <div>
                <Label>Manager</Label>
                <div className="mt-1">{employee.manager || 'Aucun'}</div>
              </div>
              <div>
                <Label>Date d'embauche</Label>
                <div className="mt-1">{employee.hireDate || employee.startDate || 'Non spécifié'}</div>
              </div>
              <div>
                <Label>Type de contrat</Label>
                <div className="mt-1">{employee.contract || 'Non spécifié'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InformationsTab;
