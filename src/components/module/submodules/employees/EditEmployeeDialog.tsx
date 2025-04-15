
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Employee } from '@/types/employee';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import PhotoUploadField from '@/components/module/submodules/employees/form/PhotoUploadField';

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
}

export const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      position: employee.position || employee.title || '',
      department: employee.department || '',
      status: employee.status || 'active',
      photo: employee.photoURL || employee.photo || ''
    }
  });

  const onSubmit = (data: any) => {
    console.log('Soumission du formulaire avec les données:', data);
    toast.success(`Informations de ${data.firstName} ${data.lastName} mises à jour avec succès`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l'employé</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PhotoUploadField defaultPhotoUrl={employee.photoURL || employee.photo} />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" {...register('firstName', { required: true })} />
              {errors.firstName && <p className="text-red-500 text-sm">Prénom requis</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" {...register('lastName', { required: true })} />
              {errors.lastName && <p className="text-red-500 text-sm">Nom requis</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email', { required: true })} />
            {errors.email && <p className="text-red-500 text-sm">Email requis</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" {...register('phone')} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Poste</Label>
            <Input id="position" {...register('position')} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Input id="department" {...register('department')} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select defaultValue={employee.status || 'active'} name="status">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="onLeave">En congé</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="En congé">En congé</SelectItem>
                <SelectItem value="Inactif">Inactif</SelectItem>
                <SelectItem value="Suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
