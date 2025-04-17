
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { employeeFormSchema, EmployeeFormValues } from './form/employeeFormSchema';
import PersonalInfoFields from './form/PersonalInfoFields';
import FormActions from './form/FormActions';
import { useEmployeeService } from '@/hooks/useEmployeeService';
import { addDocument } from '@/hooks/firestore/create-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({ 
  open, 
  onOpenChange,
  onCreated
}) => {
  const { addEmployee, isLoading, error } = useEmployeeService();
  
  const methods = useForm<EmployeeFormValues>({
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
      contract: 'cdi',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'active',
      forceManager: false,
      isManager: false
    }
  });
  
  const { handleSubmit, reset } = methods;
  
  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      console.log('Form data submitted:', data);
      
      // Prepare employee data object for Firestore
      const employeeData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || '',
        position: data.position || '',
        department: data.department || '',
        hireDate: data.hireDate || new Date().toISOString(),
        status: data.status,
        address: {
          streetNumber: data.streetNumber || '',
          streetName: data.streetName || '',
          city: data.city || '',
          zipCode: data.zipCode || '',
          region: data.region || ''
        },
        isManager: data.isManager || false,
        professionalEmail: data.professionalEmail || '',
        company: data.company || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Saving employee to Firestore:', employeeData);
      
      // Add directly to Firestore collection
      const result = await addDocument(COLLECTIONS.HR.EMPLOYEES, employeeData);
      
      if (result) {
        console.log('Employee added successfully with ID:', result.id);
        toast.success(`L'employé ${data.firstName} ${data.lastName} a été créé avec succès`);
        reset();
        onOpenChange(false);
        if (onCreated) onCreated();
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error(`Erreur lors de la création de l'employé: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel employé</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouvel employé
          </DialogDescription>
        </DialogHeader>
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoFields />
            
            <DialogFooter>
              <FormActions 
                isSubmitting={isLoading} 
                onCancel={handleClose} 
                error={error}
              />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
