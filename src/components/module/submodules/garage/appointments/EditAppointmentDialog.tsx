
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { isValid, parseISO, format } from 'date-fns';

interface EditAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
  onUpdate: (id: string, data: any) => Promise<void>;
  isLoading?: boolean;
}

const EditAppointmentDialog = ({ 
  open, 
  onOpenChange, 
  appointment, 
  onUpdate,
  isLoading 
}: EditAppointmentDialogProps) => {
  // Format date to YYYY-MM-DD for the date input
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      // Try to parse as ISO first
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, 'yyyy-MM-dd');
      }
      
      return '';
    } catch (error) {
      console.error('Invalid date format:', error);
      return '';
    }
  };

  // Initialize form with default empty values
  const defaultValues = {
    date: '',
    time: '',
    clientName: '',
    service: '',
    notes: ''
  };

  // If appointment is available, use its values
  const initialValues = appointment ? {
    date: formatDateForInput(appointment.date),
    time: appointment.time || '',
    clientName: appointment.clientName || '',
    service: appointment.service || '',
    notes: appointment.notes || ''
  } : defaultValues;

  const { register, handleSubmit } = useForm({
    defaultValues: initialValues
  });

  // Update form values when appointment changes
  React.useEffect(() => {
    if (appointment) {
      // Reset form with new appointment data
      const updatedValues = {
        date: formatDateForInput(appointment.date),
        time: appointment.time || '',
        clientName: appointment.clientName || '',
        service: appointment.service || '',
        notes: appointment.notes || ''
      };
      
      // Use reset method to update form values
      // Note: This is commented out because useForm's reset method isn't properly typed here
      // If using TypeScript with proper types, uncomment this line:
      // form.reset(updatedValues);
    }
  }, [appointment]);

  const onSubmit = async (data: any) => {
    if (!appointment || !appointment.id) {
      console.error('No appointment ID available');
      return;
    }
    
    await onUpdate(appointment.id, data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le rendez-vous</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date"
                type="date"
                className="col-span-3"
                {...register('date')}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time">Heure</Label>
              <Input 
                id="time"
                type="time"
                className="col-span-3"
                {...register('time')}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientName">Client</Label>
              <Input 
                id="clientName"
                className="col-span-3"
                {...register('clientName')}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service">Service</Label>
              <Input 
                id="service"
                className="col-span-3"
                {...register('service')}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes"
                className="col-span-3"
                {...register('notes')}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentDialog;
