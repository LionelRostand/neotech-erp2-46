
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form } from '@/components/ui/form';
import { Employee } from '@/types/employee';
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
      status: 'Actif',
      professionalEmail: '',
    },
  });

  // Si mode édition, charger les valeurs de l'employé
  useEffect(() => {
    if (isEditing && employee) {
      form.reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        department: employee.department,
        position: employee.position,
        contract: employee.contract,
        hireDate: employee.hireDate,
        manager: employee.manager,
        status: employee.status,
        professionalEmail: employee.professionalEmail || '',
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
        status: 'Actif',
        professionalEmail: '',
      });
    }
  }, [isEditing, employee, form, open]);

  const handleSubmit = async (data: EmployeeFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (createAccount && !isEditing) {
        // Vérifier que l'email professionnel est fourni
        if (!data.professionalEmail) {
          toast.error("L'email professionnel est requis pour créer un compte utilisateur");
          setIsSubmitting(false);
          return;
        }
        
        // Créer l'employé avec un compte utilisateur
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
        // Créer ou mettre à jour l'employé sans compte utilisateur
        const employeeData = isEditing 
          ? data
          : prepareEmployeeData(data);
        
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

  // Générer un email professionnel basé sur le nom et prénom
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
                    <Alert variant="outline" className="bg-blue-50">
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
