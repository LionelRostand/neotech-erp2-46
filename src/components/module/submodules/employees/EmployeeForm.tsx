import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Employee } from '@/types/employee';
import { 
  employeeFormSchema, 
  EmployeeFormValues 
} from './form/employeeFormSchema';
import { Form } from '@/components/ui/form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PersonalInfoFields from './form/PersonalInfoFields';
import EmploymentInfoFields from './form/EmploymentInfoFields';
import { prepareEmployeeData, extractAddressFields } from './form/employeeUtils';
import { toast } from 'sonner';
import { updateDocument, setDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (employee: Partial<Employee>) => void;
  employee?: Employee;
  isEditing?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  employee,
  isEditing = false,
}) => {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      streetNumber: '',
      streetName: '',
      city: '',
      zipCode: '',
      region: '',
      department: '',
      position: '',
      contract: 'CDI',
      hireDate: '',
      manager: '',
      status: 'active',
      professionalEmail: '',
      company: '',
    },
  });

  // Initialiser le formulaire avec les données de l'employé si disponibles
  useEffect(() => {
    if (employee && isEditing) {
      const addressFields = extractAddressFields(employee.address);
      
      // Create a form values object without the id field for reset
      const formValues: EmployeeFormValues = {
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        streetNumber: addressFields.streetNumber,
        streetName: addressFields.streetName,
        city: addressFields.city,
        zipCode: addressFields.zipCode,
        region: addressFields.region,
        department: employee.department || '',
        position: employee.position || '',
        contract: employee.contract || 'CDI',
        hireDate: employee.hireDate || '',
        manager: employee.manager || '',
        status: (employee.status as any) || 'active',
        professionalEmail: employee.professionalEmail || '',
        company: typeof employee.company === 'string' ? employee.company : '',
      };
      
      form.reset(formValues);

      console.log('Formulaire initialisé avec les données:', employee);
      console.log('Champs d\'adresse extraits:', addressFields);
    }
  }, [employee, isEditing, form]);

  const handleFormSubmit = async (data: EmployeeFormValues) => {
    try {
      console.log('Données du formulaire soumises:', data);
      
      // Keep the employee ID if we're editing an existing employee
      const employeeId = isEditing && employee ? employee.id : undefined;
      
      const employeeData = prepareEmployeeData(data, employeeId);
      console.log('Données préparées pour la sauvegarde:', employeeData);
      
      // Si nous modifions un employé existant, mettre à jour le document Firestore
      if (isEditing && employee) {
        await updateDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, employeeData);
        toast.success('Employé mis à jour avec succès');
      } 
      // Sinon, créer un nouveau document
      else {
        await setDocument(COLLECTIONS.HR.EMPLOYEES, employeeData.id as string, employeeData);
        toast.success('Employé créé avec succès');
      }
      
      // Appeler le callback onSubmit pour mettre à jour l'UI
      onSubmit(employeeData);
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      toast.error('Erreur lors de la sauvegarde des données');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier un employé' : 'Ajouter un nouvel employé'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations personnelles</h3>
              <PersonalInfoFields />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations professionnelles</h3>
              <EmploymentInfoFields />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {isEditing ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeForm;
