
import React, { useState } from 'react';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save, X } from 'lucide-react';

interface InformationsTabProps {
  employee: Employee;
  onAddressUpdated: (addressData: EmployeeAddress) => Promise<void>;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ employee, onAddressUpdated }) => {
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressData, setAddressData] = useState<EmployeeAddress>(() => {
    // Initialize with the current address or default values
    if (typeof employee.address === 'string') {
      return {
        street: '',
        streetNumber: '',
        city: '',
        postalCode: '',
        country: 'France',
      };
    }
    
    return {
      street: employee.address?.street || '',
      streetNumber: employee.address?.streetNumber || '',
      city: employee.address?.city || '',
      postalCode: employee.address?.postalCode || '',
      country: employee.address?.country || 'France',
      state: employee.address?.state || '',
    };
  });

  const handleAddressChange = (field: keyof EmployeeAddress, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAddress = async () => {
    await onAddressUpdated(addressData);
    setEditingAddress(false);
  };

  const handleCancelEdit = () => {
    // Reset to the current employee address
    if (typeof employee.address === 'string') {
      setAddressData({
        street: '',
        streetNumber: '',
        city: '',
        postalCode: '',
        country: 'France',
      });
    } else {
      setAddressData({
        street: employee.address?.street || '',
        streetNumber: employee.address?.streetNumber || '',
        city: employee.address?.city || '',
        postalCode: employee.address?.postalCode || '',
        country: employee.address?.country || 'France',
        state: employee.address?.state || '',
      });
    }
    setEditingAddress(false);
  };

  // Format address for display
  const getFormattedAddress = () => {
    if (typeof employee.address === 'string') {
      return employee.address;
    }
    
    if (!employee.address) {
      return 'Adresse non renseignée';
    }
    
    const { streetNumber, street, city, postalCode, country } = employee.address;
    return `${streetNumber ? streetNumber + ' ' : ''}${street}, ${postalCode} ${city}, ${country}`;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Personal Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Nom</h4>
              <p>{employee.lastName}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Prénom</h4>
              <p>{employee.firstName}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
              <p>{employee.email}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Téléphone</h4>
              <p>{employee.phone || 'Non renseigné'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Date de naissance</h4>
              <p>{employee.birthDate || 'Non renseignée'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Numéro de sécurité sociale</h4>
              <p>{employee.socialSecurityNumber || 'Non renseigné'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Address Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Adresse</h3>
            
            {!editingAddress ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setEditingAddress(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSaveAddress}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            )}
          </div>
          
          {editingAddress ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="streetNumber">Numéro</Label>
                <Input 
                  id="streetNumber"
                  value={addressData.streetNumber || ''}
                  onChange={(e) => handleAddressChange('streetNumber', e.target.value)}
                  placeholder="N°"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="street">Rue</Label>
                <Input
                  id="street"
                  value={addressData.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="Rue"
                />
              </div>
              
              <div>
                <Label htmlFor="postalCode">Code postal</Label>
                <Input
                  id="postalCode"
                  value={addressData.postalCode}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  placeholder="Code postal"
                />
              </div>
              
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="Ville"
                />
              </div>
              
              <div>
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  value={addressData.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  placeholder="Pays"
                />
              </div>
            </div>
          ) : (
            <p>{getFormattedAddress()}</p>
          )}
        </CardContent>
      </Card>
      
      {/* Professional Information */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Informations professionnelles</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Poste</h4>
              <p>{employee.position || 'Non renseigné'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Département</h4>
              <p>{employee.department || 'Non renseigné'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Date d'embauche</h4>
              <p>{employee.hireDate || 'Non renseignée'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Type de contrat</h4>
              <p>{employee.contract || 'Non renseigné'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Manager</h4>
              <p>{employee.manager || 'Non renseigné'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Email professionnel</h4>
              <p>{employee.professionalEmail || employee.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationsTab;
