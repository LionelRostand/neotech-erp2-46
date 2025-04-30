import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Employee } from '@/types/employee';
import { EmployeeFormValues } from '../form/employeeFormSchema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InformationsTabEditProps {
  employee?: Employee;
}

const InformationsTabEdit: React.FC<InformationsTabEditProps> = ({ employee }) => {
  // Get form context
  const form = useFormContext<EmployeeFormValues>();
  
  // Ensure form is available before rendering form controls
  if (!form) {
    return <div>Loading form...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Informations personnelles</h3>
          
          <div className="space-y-4">
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input {...form.register('firstName')} placeholder="Prénom" />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...form.register('lastName')} placeholder="Nom" />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Date de naissance</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...form.register('birthDate')} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Email personnel</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  {...form.register('email')} 
                  placeholder="nom@example.com" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input 
                  {...form.register('phone')} 
                  placeholder="+33 6 xx xx xx xx" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Informations professionnelles</h3>
          
          <div className="space-y-4">
            <FormItem>
              <FormLabel>Poste</FormLabel>
              <FormControl>
                <Input {...form.register('position')} placeholder="Poste" />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Département</FormLabel>
              <FormControl>
                <Input {...form.register('department')} placeholder="Département" />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Date d'embauche</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...form.register('hireDate')} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Email professionnel</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  {...form.register('professionalEmail')} 
                  placeholder="prenom.nom@entreprise.com" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={value => form.setValue('status', value as any)} 
                  defaultValue={form.getValues('status')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="onLeave">En congé</SelectItem>
                    <SelectItem value="Suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Type de contrat</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={value => form.setValue('contract', value)} 
                  defaultValue={form.getValues('contract')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Alternance">Alternance</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Intérim">Intérim</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Adresse personnelle</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Numéro de rue</FormLabel>
                <FormControl>
                  <Input {...form.register('streetNumber')} placeholder="123" />
                </FormControl>
                <FormMessage />
              </FormItem>
              
              <FormItem>
                <FormLabel>Nom de la rue</FormLabel>
                <FormControl>
                  <Input {...form.register('streetName')} placeholder="Rue des exemples" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input {...form.register('city')} placeholder="Ville" />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Code postal</FormLabel>
              <FormControl>
                <Input {...form.register('zipCode')} placeholder="75000" />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Région</FormLabel>
              <FormControl>
                <Input {...form.register('region')} placeholder="Région" />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormItem>
              <FormLabel>Pays</FormLabel>
              <FormControl>
                <Input {...form.register('country')} placeholder="France" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </div>
        
        {/* Work address section - if we implement this field later */}
        {form.getValues('workAddress') && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Adresse professionnelle</h3>
            
            <div className="space-y-4">
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input {...form.register('workAddress.street')} placeholder="123 rue professionnelle" />
                </FormControl>
                <FormMessage />
              </FormItem>
              
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <Input {...form.register('workAddress.city')} placeholder="Ville" />
                </FormControl>
                <FormMessage />
              </FormItem>
              
              <FormItem>
                <FormLabel>Code postal</FormLabel>
                <FormControl>
                  <Input {...form.register('workAddress.postalCode')} placeholder="75000" />
                </FormControl>
                <FormMessage />
              </FormItem>
              
              <FormItem>
                <FormLabel>Pays</FormLabel>
                <FormControl>
                  <Input {...form.register('workAddress.country')} placeholder="France" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformationsTabEdit;
