
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Consultation, Patient, Doctor } from './types/health-types';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ConsultationFormProps {
  onSubmit: (consultation: Consultation) => void;
  onCancel: () => void;
  patients: Patient[];
  doctors: Doctor[];
  initialData?: Partial<Consultation>;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  onSubmit,
  onCancel,
  patients,
  doctors,
  initialData
}) => {
  const [formData, setFormData] = useState<Partial<Consultation>>(initialData || {
    patientId: '',
    doctorId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    consultationType: 'standard',
    notes: '',
    diagnosis: '',
    treatment: '',
    status: 'scheduled'
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );

  const handleChange = (field: keyof Consultation, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData(prev => ({ ...prev, date: format(date, 'yyyy-MM-dd') }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.time) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    onSubmit(formData as Consultation);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patient">Patient</Label>
          <Select
            value={formData.patientId}
            onValueChange={(value) => handleChange('patientId', value)}
          >
            <SelectTrigger id="patient">
              <SelectValue placeholder="Sélectionner un patient" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id || ''}>
                  {patient.firstName} {patient.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="doctor">Médecin</Label>
          <Select
            value={formData.doctorId}
            onValueChange={(value) => handleChange('doctorId', value)}
          >
            <SelectTrigger id="doctor">
              <SelectValue placeholder="Sélectionner un médecin" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id || ''}>
                  Dr. {doctor.firstName} {doctor.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : <span>Sélectionner une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Heure</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="consultationType">Type de consultation</Label>
          <Select
            value={formData.consultationType}
            onValueChange={(value) => handleChange('consultationType', value)}
          >
            <SelectTrigger id="consultationType">
              <SelectValue placeholder="Type de consultation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="urgent">Urgence</SelectItem>
              <SelectItem value="followup">Suivi</SelectItem>
              <SelectItem value="specialist">Spécialiste</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Notes sur la consultation"
          rows={3}
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnostic</Label>
        <Textarea
          id="diagnosis"
          placeholder="Diagnostic"
          rows={2}
          value={formData.diagnosis || ''}
          onChange={(e) => handleChange('diagnosis', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="treatment">Traitement prescrit</Label>
        <Textarea
          id="treatment"
          placeholder="Traitement"
          rows={2}
          value={formData.treatment || ''}
          onChange={(e) => handleChange('treatment', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange('status', value as Consultation['status'])}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Programmée</SelectItem>
            <SelectItem value="in-progress">En cours</SelectItem>
            <SelectItem value="completed">Terminée</SelectItem>
            <SelectItem value="cancelled">Annulée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
};

export default ConsultationForm;
