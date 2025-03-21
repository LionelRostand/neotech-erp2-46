
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SalonAppointment } from '../../types/salon-types';
import { useAppointmentForm } from '../hooks/useAppointmentForm';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAppointment: (data: Omit<SalonAppointment, 'id'>) => Promise<SalonAppointment>;
}

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  open,
  onOpenChange,
  onCreateAppointment
}) => {
  const {
    formData,
    formErrors,
    updateFormField,
    validateForm,
    resetForm
  } = useAppointmentForm();

  // Set default values
  useEffect(() => {
    if (open) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      
      updateFormField('date', formattedDate);
      updateFormField('time', '10:00');
      updateFormField('duration', '60');
      updateFormField('status', 'confirmed');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await onCreateAppointment({
        clientId: formData.clientId,
        service: formData.service,
        stylist: formData.stylist,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        status: formData.status as 'pending' | 'confirmed' | 'cancelled' | 'completed',
        notes: formData.notes
      });
      
      resetForm();
      onOpenChange(false);
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  // Mock client data for the dropdown
  const mockClients = [
    { id: "client-001", name: "Emma Bernard" },
    { id: "client-002", name: "Thomas Petit" },
    { id: "client-003", name: "Sophie Martin" },
    { id: "client-004", name: "Lucas Dubois" },
    { id: "client-005", name: "Julie Leroy" }
  ];

  // Mock stylist data for the dropdown
  const mockStylists = [
    "Sophie Martin",
    "Jean Dupont",
    "Marie Leclerc",
    "Thomas Bernard",
    "Laura Klein"
  ];

  // Mock service data for the dropdown
  const mockServices = [
    "Coupe femme",
    "Coupe homme",
    "Coloration",
    "Brushing",
    "Coupe + Coloration",
    "Coiffure de mariage",
    "Traitement capillaire"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouveau rendez-vous</DialogTitle>
          <DialogDescription>
            Créez un nouveau rendez-vous pour un client
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => updateFormField('clientId', value)}
            >
              <SelectTrigger className={formErrors.clientId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.clientId && <p className="text-red-500 text-xs">{formErrors.clientId}</p>}
          </div>
          
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
            <Select
              value={formData.service}
              onValueChange={(value) => updateFormField('service', value)}
            >
              <SelectTrigger className={formErrors.service ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                {mockServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.service && <p className="text-red-500 text-xs">{formErrors.service}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stylist">Coiffeur</Label>
            <Select
              value={formData.stylist}
              onValueChange={(value) => updateFormField('stylist', value)}
            >
              <SelectTrigger className={formErrors.stylist ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner un coiffeur" />
              </SelectTrigger>
              <SelectContent>
                {mockStylists.map((stylist) => (
                  <SelectItem key={stylist} value={stylist}>
                    {stylist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                value={formData.status}
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
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
