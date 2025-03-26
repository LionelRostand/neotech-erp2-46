
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SalonAppointment } from '../../types/salon-types';
import { useAppointmentForm } from '../hooks/useAppointmentForm';

interface EditAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: SalonAppointment;
  onUpdateAppointment: (id: string, data: Partial<SalonAppointment>) => Promise<void>;
}

const EditAppointmentDialog: React.FC<EditAppointmentDialogProps> = ({
  open,
  onOpenChange,
  appointment,
  onUpdateAppointment
}) => {
  const {
    formData,
    formErrors,
    updateFormField,
    validateForm,
    resetForm
  } = useAppointmentForm(appointment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await onUpdateAppointment(appointment.id, {
        service: formData.service,
        stylist: formData.stylist,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        status: formData.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
        notes: formData.notes
      });
      
      onOpenChange(false);
    }
  };

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le rendez-vous</DialogTitle>
          <DialogDescription>
            Modifiez les détails du rendez-vous
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateFormField('date', e.target.value)}
                className={formErrors.date ? 'border-red-500' : ''}
              />
              {formErrors.date && <p className="text-red-500 text-xs">{formErrors.date}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => updateFormField('time', e.target.value)}
                className={formErrors.time ? 'border-red-500' : ''}
              />
              {formErrors.time && <p className="text-red-500 text-xs">{formErrors.time}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Input
              id="service"
              value={formData.service}
              onChange={(e) => updateFormField('service', e.target.value)}
              className={formErrors.service ? 'border-red-500' : ''}
            />
            {formErrors.service && <p className="text-red-500 text-xs">{formErrors.service}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stylist">Coiffeur</Label>
            <Input
              id="stylist"
              value={formData.stylist}
              onChange={(e) => updateFormField('stylist', e.target.value)}
              className={formErrors.stylist ? 'border-red-500' : ''}
            />
            {formErrors.stylist && <p className="text-red-500 text-xs">{formErrors.stylist}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => updateFormField('duration', e.target.value)}
                className={formErrors.duration ? 'border-red-500' : ''}
              />
              {formErrors.duration && <p className="text-red-500 text-xs">{formErrors.duration}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status || "pending"}
                onValueChange={(value) => updateFormField('status', value)}
              >
                <SelectTrigger className={formErrors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.status && <p className="text-red-500 text-xs">{formErrors.status}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => updateFormField('notes', e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentDialog;
