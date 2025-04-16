
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Employee } from '@/types/employee';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { toast } from 'sonner';
import { useEmployeeService } from '@/hooks/useEmployeeService';
import { employeeFormSchema, EmployeeFormValues } from './form/employeeFormSchema';
import PhotoUploadField from './form/PhotoUploadField';

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({
  open,
  onOpenChange,
  onCreated
}) => {
  const { departments } = useHrModuleData();
  const { addEmployee, isLoading } = useEmployeeService();
  
  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      status: 'active',
      contract: 'CDI',
      professionalEmail: '',
      forceManager: false
    }
  });
  
  const { handleSubmit, reset, formState: { errors } } = methods;

  const handleFormSubmit = async (data: EmployeeFormValues) => {
    try {
      console.log('Creating employee with data:', data);
      
      // Prepare employee data
      const employeeData: Partial<Employee> = {
        ...data,
        hireDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // If the photo is provided as base64, use it
        photo: data.photo || '',
        photoURL: data.photo || '',
        isManager: data.forceManager || false
      };
      
      // Save to Firestore using the employee service
      const result = await addEmployee(employeeData);
      
      if (result) {
        reset();
        onOpenChange(false);
        onCreated();
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error("Erreur lors de la création de l'employé");
    }
  };
  
  const onDialogClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onDialogClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel employé</DialogTitle>
          <DialogDescription>
            Complétez les informations ci-dessous pour créer un nouvel employé.
          </DialogDescription>
        </DialogHeader>
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input 
                  id="firstName" 
                  {...methods.register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                  id="lastName" 
                  {...methods.register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email personnel</Label>
                <Input 
                  id="email" 
                  type="email"
                  {...methods.register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="professionalEmail">Email professionnel</Label>
                <Input 
                  id="professionalEmail" 
                  type="email"
                  {...methods.register("professionalEmail")}
                />
                {errors.professionalEmail && (
                  <p className="text-red-500 text-xs">{errors.professionalEmail.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  {...methods.register("phone")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Poste</Label>
                <Input 
                  id="position" 
                  {...methods.register("position")}
                />
                {errors.position && (
                  <p className="text-red-500 text-xs">{errors.position.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Select 
                  onValueChange={(value) => methods.setValue("department", value)}
                  defaultValue={methods.getValues("department")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept, index) => (
                      <SelectItem key={dept.id || index} value={dept.id || ''}>
                        {dept.name || 'Département sans nom'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-red-500 text-xs">{errors.department.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select 
                  onValueChange={(value) => methods.setValue("status", value as any)}
                  defaultValue={methods.getValues("status")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="onLeave">En congé</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-xs">{errors.status.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract">Type de contrat</Label>
                <Select 
                  onValueChange={(value) => methods.setValue("contract", value)}
                  defaultValue={methods.getValues("contract")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de contrat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDI">CDI</SelectItem>
                    <SelectItem value="CDD">CDD</SelectItem>
                    <SelectItem value="Intérim">Intérim</SelectItem>
                    <SelectItem value="Stage">Stage</SelectItem>
                    <SelectItem value="Alternance">Alternance</SelectItem>
                  </SelectContent>
                </Select>
                {errors.contract && (
                  <p className="text-red-500 text-xs">{errors.contract.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <PhotoUploadField />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onDialogClose}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer l'employé"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
