
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { Employee } from '@/types/employee';
import { LeaveRequest, updateLeaveRequest } from './services/leaveService';

interface UpdateLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave: LeaveRequest;
  onUpdateSuccess: () => void;
  employees: Employee[];
}

const leaveTypes = [
  { id: 'paid', name: 'Congés payés' },
  { id: 'unpaid', name: 'Congés sans solde' },
  { id: 'sick', name: 'Maladie' },
  { id: 'maternity', name: 'Maternité' },
  { id: 'paternity', name: 'Paternité' },
  { id: 'other', name: 'Autre' },
];

const statusOptions = [
  { id: 'pending', name: 'En attente' },
  { id: 'approved', name: 'Approuvée' },
  { id: 'rejected', name: 'Refusée' },
  { id: 'canceled', name: 'Annulée' },
];

const UpdateLeaveDialog: React.FC<UpdateLeaveDialogProps> = ({ open, onOpenChange, leave, onUpdateSuccess, employees }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      employeeId: leave.employeeId,
      type: leave.type,
      startDate: parseISO(leave.startDate),
      endDate: parseISO(leave.endDate),
      reason: leave.reason || '',
      status: leave.status,
    }
  });
  
  const startDate = watch('startDate');
  
  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Format dates as strings for Firestore
      const formattedData = {
        ...data,
        startDate: format(data.startDate, 'yyyy-MM-dd'),
        endDate: format(data.endDate, 'yyyy-MM-dd'),
        
        // Add approval info if status is changed to approved
        ...(data.status === 'approved' && leave.status !== 'approved' ? {
          approvedBy: 'currentUserId', // Replace with actual current user ID in a real app
          approvedAt: new Date().toISOString()
        } : {})
      };
      
      await updateLeaveRequest(leave.id, formattedData);
      
      toast.success("Demande de congé mise à jour avec succès");
      onUpdateSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la demande de congé:", error);
      toast.error("Une erreur est survenue lors de la mise à jour de la demande");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la demande de congé</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* Employee selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Employé</label>
            <Controller
              name="employeeId"
              control={control}
              rules={{ required: "L'employé est requis" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={errors.employeeId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem 
                        key={employee.id} 
                        value={employee.id}
                      >
                        {`${employee.firstName} ${employee.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId.message}</p>}
          </div>
          
          {/* Leave type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type de congé</label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Le type de congé est requis" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map(type => (
                      <SelectItem 
                        key={type.id} 
                        value={type.id}
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Statut</label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Le statut est requis" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem 
                        key={status.id} 
                        value={status.id}
                      >
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>
          
          {/* Start and end dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de début</label>
              <Controller
                name="startDate"
                control={control}
                rules={{ required: "La date de début est requise" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          errors.startDate ? "border-red-500" : ""
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'dd MMMM yyyy', { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date de fin</label>
              <Controller
                name="endDate"
                control={control}
                rules={{ required: "La date de fin est requise" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          errors.endDate ? "border-red-500" : ""
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, 'dd MMMM yyyy', { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < startDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
            </div>
          </div>
          
          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Motif (optionnel)</label>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Motif de la demande de congé..."
                  className="min-h-[100px]"
                />
              )}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLeaveDialog;
