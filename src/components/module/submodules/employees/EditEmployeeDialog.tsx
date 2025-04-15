
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, FormProvider } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Loader2 } from 'lucide-react';
import PhotoUploadField from '@/components/module/submodules/employees/form/PhotoUploadField';
import { useEmployeeService } from '@/hooks/useEmployeeService';

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onEmployeeUpdate?: (updatedEmployee: Employee) => void;
}

export const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee,
  onEmployeeUpdate
}) => {
  const { updateEmployee, isLoading } = useEmployeeService();
  
  const methods = useForm({
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      position: employee.position || employee.title || '',
      department: employee.department || '',
      status: employee.status || 'active',
      photoURL: employee.photoURL || employee.photo || '',
      photoData: employee.photoData || employee.photoURL || employee.photo || '',
      photo: employee.photo || employee.photoURL || '',
    }
  });

  const onSubmit = async (data: any) => {
    console.log('Soumission du formulaire avec les données:', data);
    
    try {
      const updatedEmployee = await updateEmployee(employee.id, data);
      
      if (updatedEmployee) {
        toast.success(`Informations de ${data.firstName} ${data.lastName} mises à jour avec succès`);
        
        // Notifier le composant parent de la mise à jour
        if (onEmployeeUpdate) {
          onEmployeeUpdate(updatedEmployee);
        }
        
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l'employé</DialogTitle>
        </DialogHeader>
        
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center gap-4 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={employee.photoURL || employee.photo} 
                  alt={`${employee.firstName} ${employee.lastName}`} 
                />
                <AvatarFallback>
                  <User className="h-12 w-12 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <PhotoUploadField defaultPhotoUrl={employee.photoURL || employee.photo} />
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
              <Input id="department" {...methods.register('department')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                defaultValue={employee.status || 'active'} 
                onValueChange={(value) => methods.setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="onLeave">En congé</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
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
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
