
import React, { useState } from 'react';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Building, Phone, Mail, Briefcase, UserCheck, User, Save } from 'lucide-react';
import ManagerCheckbox from '../form/ManagerCheckbox';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../form/employeeFormSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateEmployee } from '../services/employeeService';
import { toast } from 'sonner';

interface InformationsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
  form?: UseFormReturn<EmployeeFormValues>;
  showManagerOption?: boolean;
  onEmployeeUpdated?: () => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee, 
  isEditing: externalIsEditing,
  onFinishEditing,
  form,
  showManagerOption = true,
  onEmployeeUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addressData, setAddressData] = useState<EmployeeAddress>(() => {
    if (typeof employee.address === 'object') {
      return employee.address as EmployeeAddress;
    }
    return {
      street: '',
      streetNumber: '',
      city: '',
      postalCode: '',
      country: 'France',
      state: ''
    };
  });

  const handleAddressChange = (field: keyof EmployeeAddress, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAddress = async () => {
    try {
      setIsSaving(true);
      await updateEmployee(employee.id, { address: addressData });
      toast.success("Adresse mise à jour avec succès");
      setIsEditing(false);
      if (onEmployeeUpdated) {
        onEmployeeUpdated();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'adresse:", error);
      toast.error("Erreur lors de la mise à jour de l'adresse");
    } finally {
      setIsSaving(false);
    }
  };

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
              Email professionnel
            </h4>
            <p>{employee.professionalEmail || employee.email}</p>
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
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Adresse
              </h4>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                >
                  Modifier
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleSaveAddress}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">N° de rue</label>
                    <Input
                      value={addressData.streetNumber || ''}
                      onChange={(e) => handleAddressChange('streetNumber', e.target.value)}
                      placeholder="123"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Rue</label>
                    <Input
                      value={addressData.street || ''}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      placeholder="Nom de la rue"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Code postal</label>
                    <Input
                      value={addressData.postalCode || ''}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      placeholder="75000"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Ville</label>
                    <Input
                      value={addressData.city || ''}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder="Paris"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {addressComponents.street && (
                  <div>
                    <p className="text-sm text-muted-foreground">Rue</p>
                    <p>{addressComponents.streetNumber} {addressComponents.street}</p>
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
              </div>
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
          
          {(employee.manager || employee.managerId) && (
            <>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Responsable
                </h4>
                <p>{employee.manager || 'Non spécifié'}</p>
              </div>
              <Separator />
            </>
          )}
          
          {employee.status && (
            <>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Statut</h4>
                <p>{employee.status}</p>
              </div>
              <Separator />
            </>
          )}
          
          {form && showManagerOption && (
            <div className="mt-4">
              <div className="space-y-1 mb-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  Privilèges de management
                </h4>
              </div>
              <ManagerCheckbox form={form} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationsTab;
