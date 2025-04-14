
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
import { useForm } from 'react-hook-form';
import { Employee } from '@/types/hr-types';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { toast } from 'sonner';

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  status: string;
}

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({
  open,
  onOpenChange,
  onCreated
}) => {
  const { departments } = useHrModuleData();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmployeeFormData>();

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      // Here we would normally send the data to an API or Firestore
      // For now, we'll just simulate a successful creation
      console.log('Creating employee:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Employé ${data.firstName} ${data.lastName} créé avec succès`);
      reset();
      onOpenChange(false);
      onCreated();
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel employé</DialogTitle>
          <DialogDescription>
            Complétez les informations ci-dessous pour créer un nouvel employé.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input 
                id="firstName" 
                {...register("firstName", { required: "Le prénom est requis" })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input 
                id="lastName" 
                {...register("lastName", { required: "Le nom est requis" })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              {...register("email", { 
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide"
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Poste</Label>
            <Input 
              id="position" 
              {...register("position", { required: "Le poste est requis" })}
            />
            {errors.position && (
              <p className="text-red-500 text-xs">{errors.position.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select onValueChange={(value) => register("department").onChange({ target: { value } })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un département" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept: any, index: number) => (
                  <SelectItem key={index} value={dept.id || dept.name || ''}>
                    {dept.name || dept.id || 'Département sans nom'}
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
            <Select onValueChange={(value) => register("status").onChange({ target: { value } })}>
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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onDialogClose}>
              Annuler
            </Button>
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
