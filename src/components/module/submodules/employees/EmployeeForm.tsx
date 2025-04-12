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
import PhotoUploadField from './form/PhotoUploadField';
import { prepareEmployeeData, extractAddressFields } from './form/employeeUtils';
import { toast } from 'sonner';
import { updateDocument, setDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
      photo: undefined,
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
        photo: employee.photoData ? {
          data: employee.photoData,
          fileName: employee.photoMeta?.fileName || 'profile.jpg',
          fileType: employee.photoMeta?.fileType || 'image/jpeg',
          fileSize: employee.photoMeta?.fileSize || 0,
          updatedAt: employee.photoMeta?.updatedAt || new Date().toISOString()
        } : undefined,
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
      const employeeId = isEditing && employee ? employee.id : `EMP${Math.floor(1000 + Math.random() * 9000)}`;
      
      const employeeData = prepareEmployeeData(data, employeeId);
      console.log('Données préparées pour la sauvegarde:', employeeData);
      
      // Check if the document exists before attempting to update it
      if (isEditing && employee) {
        // Check if the document exists in Firestore
        const docRef = doc(db, COLLECTIONS.HR.EMPLOYEES, employee.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Document exists, update it
          await updateDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, employeeData);
          toast.success('Employé mis à jour avec succès');
        } else {
          // Document doesn't exist, create it instead
          await setDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, employeeData);
          toast.success('Employé créé avec succès');
        }
      } 
      // Create a new employee document
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
            <div className="space-y-6">
              <div className="text-center">
                <PhotoUploadField defaultPhotoUrl={employee?.photoData} />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations personnelles</h3>
                <PersonalInfoFields />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations professionnelles</h3>
                <EmploymentInfoFields />
              </div>
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
