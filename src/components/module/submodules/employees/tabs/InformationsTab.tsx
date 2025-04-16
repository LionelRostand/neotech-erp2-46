
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Check, PenLine } from 'lucide-react';

interface InformationsTabProps {
  employee: Employee;
  onAddressUpdated: (address: EmployeeAddress) => Promise<void> | void;
  editMode?: boolean;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee, 
  onAddressUpdated,
  editMode = false
}) => {
  const [address, setAddress] = useState<EmployeeAddress>(
    typeof employee.address === 'string' 
      ? { street: '', city: '', postalCode: '', country: '' } 
      : employee.address as EmployeeAddress
  );
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSave = async () => {
    setIsSaving(true);
    try {
      await onAddressUpdated(address);
      setIsEditingAddress(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'adresse:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informations personnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Prénom</Label>
              <Input 
                value={employee.firstName} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label>Nom</Label>
              <Input 
                value={employee.lastName} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label>Email professionnel</Label>
              <Input 
                value={employee.professionalEmail || employee.email} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input 
                value={employee.phone} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label>Date de naissance</Label>
              <Input 
                value={employee.birthDate || 'Non spécifié'} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
                type={editMode ? "date" : "text"}
              />
            </div>
            <div>
              <Label>Numéro de sécurité sociale</Label>
              <Input 
                value={employee.socialSecurityNumber || 'Non spécifié'} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations professionnelles */}
      <Card>
        <CardHeader>
          <CardTitle>Informations professionnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Poste</Label>
              <Input 
                value={employee.position} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label>Département</Label>
              <Input 
                value={employee.department} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label>Type de contrat</Label>
              <Input 
                value={employee.contract || 'Non spécifié'} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label>Date d'embauche</Label>
              <Input 
                value={employee.hireDate || 'Non spécifié'} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
                type={editMode ? "date" : "text"}
              />
            </div>
            <div>
              <Label>Manager</Label>
              <Input 
                value={employee.manager || 'Non spécifié'} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
            <div>
              <Label>Statut</Label>
              <Input 
                value={employee.status || 'Actif'} 
                readOnly={!editMode}
                className={!editMode ? "bg-gray-50" : ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Adresse */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Adresse</CardTitle>
          {editMode && !isEditingAddress && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditingAddress(true)}
            >
              <PenLine className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {editMode && isEditingAddress && (
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleAddressSave}
                disabled={isSaving}
              >
                <Check className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditingAddress(false)}
                disabled={isSaving}
              >
                Annuler
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditingAddress ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Rue</Label>
                  <Input 
                    name="street" 
                    value={address.street || ''} 
                    onChange={handleAddressChange}
                  />
                </div>
                <div>
                  <Label>Ville</Label>
                  <Input 
                    name="city" 
                    value={address.city || ''} 
                    onChange={handleAddressChange}
                  />
                </div>
                <div>
                  <Label>Code postal</Label>
                  <Input 
                    name="postalCode" 
                    value={address.postalCode || ''} 
                    onChange={handleAddressChange}
                  />
                </div>
                <div>
                  <Label>Pays</Label>
                  <Input 
                    name="country" 
                    value={address.country || ''} 
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">{address.street || 'Rue non spécifiée'}</p>
              <p className="text-sm">{address.postalCode || ''} {address.city || 'Ville non spécifiée'}</p>
              <p className="text-sm">{address.country || 'Pays non spécifié'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationsTab;
