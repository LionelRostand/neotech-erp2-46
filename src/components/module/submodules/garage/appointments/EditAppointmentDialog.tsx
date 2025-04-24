
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';

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
  const { register, handleSubmit } = useForm({
    defaultValues: {
      date: appointment.date,
      time: appointment.time,
      clientName: appointment.clientName,
      service: appointment.service,
      notes: appointment.notes || ''
    }
  });

  const onSubmit = async (data: any) => {
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
