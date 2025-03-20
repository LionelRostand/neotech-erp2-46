
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { toast } from 'sonner';

// Schéma de validation
const appointmentSchema = z.object({
  patientId: z.string({ required_error: 'Veuillez sélectionner un patient' }),
  doctorId: z.string({ required_error: 'Veuillez sélectionner un médecin' }),
  date: z.date({ required_error: 'Veuillez sélectionner une date' }),
  time: z.string({ required_error: 'Veuillez sélectionner une heure' }),
  duration: z.string({ required_error: 'Veuillez sélectionner une durée' }),
  type: z.string({ required_error: 'Veuillez sélectionner un type de rendez-vous' }),
  notes: z.string().optional(),
  notification: z.enum(['email', 'sms', 'both', 'none'], { 
    required_error: 'Veuillez sélectionner un type de notification' 
  }),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

// Options statiques
const patients = [
  { value: 'PAT001', label: 'Martin Dupont' },
  { value: 'PAT002', label: 'Sophie Durand' },
  { value: 'PAT003', label: 'Philippe Martin' },
  { value: 'PAT004', label: 'Claire Fontaine' },
];

const doctors = [
  { value: 'DOC001', label: 'Dr. Laurent (Généraliste)' },
  { value: 'DOC002', label: 'Dr. Moreau (Cardiologue)' },
  { value: 'DOC003', label: 'Dr. Petit (Pédiatre)' },
];

const appointmentTypes = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'suivi', label: 'Suivi' },
  { value: 'urgence', label: 'Urgence' },
  { value: 'examen', label: 'Examen' },
];

const durations = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 heure' },
  { value: '90', label: '1 heure 30' },
];

interface NewAppointmentFormProps {
  onSuccess?: () => void;
}

const NewAppointmentForm: React.FC<NewAppointmentFormProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: '',
      doctorId: '',
      time: '',
      duration: '30',
      type: 'consultation',
      notes: '',
      notification: 'email',
    }
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      // Simulation d'envoi à l'API
      console.log('Appointment data submitted:', data);
      
      // Simuler une attente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Notifier l'utilisateur
      toast.success('Rendez-vous enregistré avec succès');
      form.reset();
      
      // Callback de succès
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error('Erreur lors de l\'enregistrement du rendez-vous');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Patient</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between w-full"
                      >
                        {field.value
                          ? patients.find((patient) => patient.value === field.value)?.label
                          : "Sélectionner un patient"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Rechercher un patient..." />
                      <CommandEmpty>Aucun patient trouvé</CommandEmpty>
                      <CommandGroup>
                        {patients.map((patient) => (
                          <CommandItem
                            key={patient.value}
                            value={patient.value}
                            onSelect={() => {
                              form.setValue("patientId", patient.value);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                patient.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            {patient.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un médecin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.value} value={doctor.value}>
                        {doctor.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full pl-3 text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "P", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                  <Input type="time" {...field} min="08:00" max="19:00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durée</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une durée" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de rendez-vous</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
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
            name="notification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de notification" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="both">Email et SMS</SelectItem>
                    <SelectItem value="none">Aucune notification</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes ou informations complémentaires pour le rendez-vous"
                  className="resize-none min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Annuler
          </Button>
          <Button type="submit">Planifier le rendez-vous</Button>
        </div>
      </form>
    </Form>
  );
};

export default NewAppointmentForm;
