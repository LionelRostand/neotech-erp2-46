
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Consultation, Patient, Doctor } from '../../types/health-types';

interface ConsultationFormProps {
  onSubmit: (consultation: Consultation) => void;
  onCancel: () => void;
  patients: Patient[];
  doctors: Doctor[];
}

const consultationSchema = z.object({
  patientId: z.string({ required_error: "Le patient est requis" }),
  doctorId: z.string({ required_error: "Le médecin est requis" }),
  date: z.string({ required_error: "La date est requise" }),
  time: z.string({ required_error: "L'heure est requise" }),
  consultationType: z.string({ required_error: "Le type de consultation est requis" }),
  chiefComplaint: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'in-progress'], { 
    required_error: "Le statut est requis" 
  }),
});

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  onSubmit,
  onCancel,
  patients,
  doctors,
}) => {
  const form = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      patientId: '',
      doctorId: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      consultationType: 'routine',
      chiefComplaint: '',
      notes: '',
      status: 'scheduled',
    },
  });

  const handleSubmit = (data: z.infer<typeof consultationSchema>) => {
    const consultation: Consultation = {
      ...data,
      symptoms: [],
      prescriptionIds: [],
    };
    
    onSubmit(consultation);
  };

  const consultationTypes = [
    { value: 'routine', label: 'Consultation de routine' },
    { value: 'followup', label: 'Suivi' },
    { value: 'emergency', label: 'Urgence' },
    { value: 'specialist', label: 'Spécialiste' },
    { value: 'checkup', label: 'Bilan de santé' },
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Planifiée' },
    { value: 'in-progress', label: 'En cours' },
    { value: 'completed', label: 'Terminée' },
    { value: 'cancelled', label: 'Annulée' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id || ''}>
                        {patient.firstName} {patient.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Médecin</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un médecin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id || ''}>
                        Dr. {doctor.firstName} {doctor.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consultationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de consultation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {consultationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="chiefComplaint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motif de consultation</FormLabel>
              <FormControl>
                <Textarea placeholder="Motif principal de la consultation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Notes additionnelles" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Form>
  );
};

export default ConsultationForm;
