
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ConsultationFormData {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: string;
  notes: string;
}

interface AddConsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: ConsultationFormData) => void;
  patients: { id: string; name: string }[];
  doctors: { id: string; name: string }[];
}

const AddConsultationDialog: React.FC<AddConsultationDialogProps> = ({
  isOpen,
  onClose,
  onAdd,
  patients,
  doctors
}) => {
  const [formData, setFormData] = React.useState<ConsultationFormData>({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'routine',
    notes: ''
  });

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    // Reset form
    setFormData({
      patientId: '',
      doctorId: '',
      date: '',
      time: '',
      type: 'routine',
      notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Consultation</DialogTitle>
          <DialogDescription>
            Créez une nouvelle consultation pour un patient
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="patient">Patient</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => handleChange('patientId', value)}
                required
              >
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Sélectionner un patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="doctor">Médecin</Label>
              <Select
                value={formData.doctorId}
                onValueChange={(value) => handleChange('doctorId', value)}
                required
              >
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Sélectionner un médecin" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Heure</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="emergency">Urgence</SelectItem>
                  <SelectItem value="followup">Suivi</SelectItem>
                  <SelectItem value="specialist">Spécialiste</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Informations supplémentaires..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddConsultationDialog;
