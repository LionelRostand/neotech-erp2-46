
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Employee } from '@/types/employee';
import { useForm, FormProvider } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useEmployeeService } from '@/hooks/useEmployeeService';
import PhotoUploadField from './form/PhotoUploadField';

export interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (employee: Employee) => Promise<void>;
  departments?: any[];
}

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({
  open,
  onOpenChange,
  onCreated,
  departments = []
}) => {
  const { addEmployee, isLoading } = useEmployeeService();

  const methods = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      status: 'active' as const,
      photo: '',
      photoURL: '',
      photoData: '',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      console.log('Creating employee with data:', data);
      const newEmployee = await addEmployee(data);
      
      if (newEmployee) {
        toast.success(`${data.firstName} ${data.lastName} ajouté avec succès`);
        methods.reset();
        if (onCreated) {
          await onCreated(newEmployee);
        }
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel employé</DialogTitle>
        </DialogHeader>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center gap-4 mb-6">
              <PhotoUploadField />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" {...methods.register('firstName', { required: true })} />
                {methods.formState.errors.firstName && <p className="text-red-500 text-sm">Prénom requis</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" {...methods.register('lastName', { required: true })} />
                {methods.formState.errors.lastName && <p className="text-red-500 text-sm">Nom requis</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...methods.register('email', { required: true })} />
              {methods.formState.errors.email && <p className="text-red-500 text-sm">Email requis</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" {...methods.register('phone')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input id="position" {...methods.register('position')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              {departments && departments.length > 0 ? (
                <Select 
                  onValueChange={(value) => methods.setValue('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input id="department" {...methods.register('department')} />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                defaultValue="active"
                onValueChange={(value) => {
                  // Sécuriser le type pour éviter les erreurs TypeScript
                  if (value === 'active' || value === 'onLeave' || value === 'inactive' || 
                      value === 'Actif' || value === 'En congé' || value === 'Inactif' || 
                      value === 'Suspendu') {
                    methods.setValue('status', value as Employee['status']);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="onLeave">En congé</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer'
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
