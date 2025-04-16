
import React from 'react';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Building, Phone, Mail, Briefcase, UserCheck, User } from 'lucide-react';
import ManagerCheckbox from '../form/ManagerCheckbox';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../form/employeeFormSchema';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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

  // Rendre les champs en mode édition ou les informations en mode lecture seule
  const renderViewOrEditField = (isEditMode: boolean, fieldType: string, fieldValue: string, formField?: string) => {
    if (!isEditMode) {
      return <p>{fieldValue || 'Non renseigné'}</p>;
    }

    if (!form || !formField) return null;

    return (
      <FormField
        control={form.control}
        name={formField}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} type={fieldType} placeholder={fieldValue} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Nom complet</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {renderViewOrEditField(isEditing, 'text', employee.firstName, 'firstName')}
              </div>
              <div>
                {renderViewOrEditField(isEditing, 'text', employee.lastName, 'lastName')}
              </div>
            </div>
          </div>
          <Separator />
          
          <div className="space-y-1">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </h4>
            {renderViewOrEditField(isEditing, 'email', employee.email, 'email')}
          </div>
          <Separator />
          
          <div className="space-y-1">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Téléphone
            </h4>
            {renderViewOrEditField(isEditing, 'tel', employee.phone || '', 'phone')}
          </div>
          <Separator />
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Adresse
            </h4>
            
            {isEditing ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form?.control}
                    name="streetNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de rue</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form?.control}
                    name="streetName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de rue</FormLabel>
                        <FormControl>
                          <Input placeholder="Rue de l'exemple" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form?.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Paris" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form?.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="75000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form?.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Département</FormLabel>
                      <FormControl>
                        <Input placeholder="Île-de-France" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              typeof employee.address === 'object' ? (
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
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations professionnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Poste
            </h4>
            {renderViewOrEditField(isEditing, 'text', employee.position || '', 'position')}
          </div>
          <Separator />
          
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Département</h4>
            {renderViewOrEditField(isEditing, 'text', employee.department || '', 'department')}
          </div>
          <Separator />
          
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Type de contrat</h4>
            {isEditing && form ? (
              <FormField
                control={form.control}
                name="contract"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un type de contrat" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CDI">CDI</SelectItem>
                          <SelectItem value="CDD">CDD</SelectItem>
                          <SelectItem value="Intérim">Intérim</SelectItem>
                          <SelectItem value="Stage">Stage</SelectItem>
                          <SelectItem value="Alternance">Alternance</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <p>{employee.contract || 'Non spécifié'}</p>
            )}
          </div>
          <Separator />
          
          <div className="space-y-1">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Responsable
            </h4>
            {isEditing && form ? (
              <FormField
                control={form.control}
                name="managerId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="ID du responsable" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <p>{employee.manager || 'Non spécifié'}</p>
            )}
          </div>
          <Separator />
          
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Statut</h4>
            {isEditing && form ? (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                          <SelectItem value="onLeave">En congé</SelectItem>
                          <SelectItem value="Actif">Actif</SelectItem>
                          <SelectItem value="Inactif">Inactif</SelectItem>
                          <SelectItem value="En congé">En congé</SelectItem>
                          <SelectItem value="Suspendu">Suspendu</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <p>{employee.status}</p>
            )}
          </div>
          
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
