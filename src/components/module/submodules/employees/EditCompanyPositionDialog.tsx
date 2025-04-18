
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateEmployee } from './services/employeeService';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';

const editSchema = z.object({
  company: z.string().min(1, { message: 'L\'entreprise est requise' }),
  position: z.string().optional(),
});

type FormValues = z.infer<typeof editSchema>;

interface EditCompanyPositionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onEmployeeUpdated: (updatedEmployee: Employee) => void;
}

export const EditCompanyPositionDialog: React.FC<EditCompanyPositionDialogProps> = ({
  open,
  onOpenChange,
  employee,
  onEmployeeUpdated,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      company: typeof employee.company === 'string' ? employee.company : employee.company?.name || '',
      position: employee.position || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (!employee.id) {
        toast.error('ID de l\'employé non trouvé');
        return;
      }
      
      const updatedEmployee = await updateEmployee(employee.id, data);
      
      if (updatedEmployee) {
        onEmployeeUpdated(updatedEmployee as Employee);
        toast.success('Informations mises à jour avec succès');
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Erreur lors de la mise à jour des informations');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier entreprise et poste</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="company">Entreprise</Label>
            <Input
              id="company"
              {...register('company')}
              placeholder="Nom de l'entreprise"
            />
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Poste</Label>
            <Input
              id="position"
              {...register('position')}
              placeholder="Intitulé du poste"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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
