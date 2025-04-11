
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form } from '@/components/ui/form';
import { Employee, EmployeeAddress } from '@/types/employee';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import PersonalInfoFields from './form/PersonalInfoFields';
import EmploymentInfoFields from './form/EmploymentInfoFields';
import FormActions from './form/FormActions';
import { employeeFormSchema, EmployeeFormValues } from './form/employeeFormSchema';
import { prepareEmployeeData } from './form/employeeUtils';
import { createEmployeeWithAccount } from '@/services/userService';
import { toast } from 'sonner';
import { Company } from '@/components/module/submodules/companies/types';

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Employee>) => void;
  employee?: Employee;
  isEditing?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  employee, 
  isEditing = false 
}) => {
  const [createAccount, setCreateAccount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      department: '',
      position: '',
      contract: 'CDI',
      hireDate: '',
      manager: '',
      status: 'Actif' as 'active' | 'inactive' | 'onLeave' | 'Actif',
      professionalEmail: '',
      company: '',
    },
  });

  useEffect(() => {
    if (isEditing && employee) {
      const addressString = typeof employee.address === 'object' 
        ? `${(employee.address as EmployeeAddress).street}, ${(employee.address as EmployeeAddress).city}` 
        : employee.address as string;
      
      const companyString = typeof employee.company === 'object'
        ? (employee.company as Company).id
        : employee.company as string;
        
      form.reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        address: addressString,
        department: employee.department,
        position: employee.position,
        contract: employee.contract,
        hireDate: employee.hireDate,
        manager: employee.manager,
        status: employee.status as 'active' | 'inactive' | 'onLeave' | 'Actif',
        professionalEmail: employee.professionalEmail || '',
        company: companyString,
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        department: '',
        position: '',
        contract: 'CDI',
        hireDate: '',
        manager: '',
        status: 'Actif' as 'active' | 'inactive' | 'onLeave' | 'Actif',
        professionalEmail: '',
        company: '',
      });
    }
  }, [isEditing, employee, form, open]);

  const handleSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (createAccount && !isEditing) {
        if (!data.professionalEmail) {
          toast.error("L'email professionnel est requis pour créer un compte utilisateur");
          setIsSubmitting(false);
          return;
        }
        
        const employeeData = prepareEmployeeData(data);
        const result = await createEmployeeWithAccount(employeeData, data.professionalEmail);
        
        if (result.success) {
          onSubmit(result.employee);
          toast.success(
            "Employé créé avec succès. Un email a été envoyé à l'adresse professionnelle pour configurer le mot de passe."
          );
        } else {
          toast.error("Erreur lors de la création du compte utilisateur");
        }
      } else {
        // Handle different submission paths for editing vs creating
        let employeeData: Partial<Employee>;
        
        if (isEditing) {
          // When editing, we need to ensure the address is properly formatted
          let formattedAddress: string | EmployeeAddress;
          
          if (typeof data.address === 'string') {
            // If it's a string, parse it into the required structure
            const addressParts = data.address.split(',').map(part => part.trim());
            formattedAddress = {
              street: addressParts[0] || 'Rue non spécifiée',
              city: addressParts[1] || 'Ville non spécifiée',
              postalCode: addressParts[2] || '00000',
              country: addressParts[3] || 'France'
            };
          } else if (data.address) {
            // Ensure all required fields are present
            formattedAddress = {
              street: data.address.street || 'Rue non spécifiée',
              city: data.address.city || 'Ville non spécifiée',
              postalCode: data.address.postalCode || '00000',
              country: data.address.country || 'France',
              streetNumber: data.address.streetNumber,
              department: data.address.department,
              state: data.address.state
            };
          } else {
            // Default address if none provided
            formattedAddress = {
              street: 'Rue non spécifiée',
              city: 'Ville non spécifiée',
              postalCode: '00000',
              country: 'France'
            };
          }
          
          // Create a properly formatted employee object
          employeeData = {
            ...data,
            address: formattedAddress
          };
        } else {
          // For new employees, use prepareEmployeeData which already handles address formatting
          employeeData = prepareEmployeeData(data);
        }
        
        onSubmit(employeeData);
        toast.success(`Employé ${isEditing ? 'mis à jour' : 'ajouté'} avec succès`);
      }
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateProfessionalEmail = () => {
    const firstName = form.getValues('firstName').toLowerCase();
    const lastName = form.getValues('lastName').toLowerCase();
    
    if (firstName && lastName) {
      const professionalEmail = `${firstName.charAt(0)}.${lastName}@entreprise.com`;
      form.setValue('professionalEmail', professionalEmail);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{isEditing ? 'Modifier un employé' : 'Ajouter un nouvel employé'}</SheetTitle>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <PersonalInfoFields />
            <EmploymentInfoFields />
            
            {!isEditing && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="create-account" 
                    checked={createAccount}
                    onCheckedChange={setCreateAccount}
                  />
                  <Label htmlFor="create-account">
                    Créer un compte utilisateur pour cet employé
                  </Label>
                </div>
                
                {createAccount && (
                  <div className="space-y-4">
                    <Alert variant="default" className="bg-blue-50">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        Un email sera envoyé à l'adresse professionnelle pour configurer le mot de passe.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="professional-email">Email professionnel</Label>
                      <div className="flex gap-2">
                        <input
                          id="professional-email"
                          {...form.register('professionalEmail')}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="prenom.nom@entreprise.com"
                        />
                        <button
                          type="button"
                          onClick={generateProfessionalEmail}
                          className="h-10 px-3 py-2 bg-gray-100 rounded-md text-sm font-medium"
                        >
                          Générer
                        </button>
                      </div>
                      {form.formState.errors.professionalEmail && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.professionalEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <FormActions onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeForm;
