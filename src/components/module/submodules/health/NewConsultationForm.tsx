
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Temporary mock data
const mockPatients = [
  { id: "PAT-20230001", name: "Martin Dupont" },
  { id: "PAT-20230042", name: "Jeanne Moreau" },
  { id: "PAT-20230078", name: "Claire Dubois" },
  { id: "PAT-20230105", name: "Thomas Petit" },
];

const mockDoctors = [
  { id: "DOC-001", name: "Dr. Sophie Laurent", specialty: "Médecine générale" },
  { id: "DOC-002", name: "Dr. Michel Bernard", specialty: "Cardiologie" },
  { id: "DOC-003", name: "Dr. Anne Martin", specialty: "Pédiatrie" },
  { id: "DOC-004", name: "Dr. Jean Dubois", specialty: "Dermatologie" },
];

const consultationTypes = [
  "Consultation générale",
  "Suivi médical",
  "Consultation spécialiste",
  "Première consultation",
  "Urgence",
  "Contrôle post-opératoire",
  "Avis médical",
];

const formSchema = z.object({
  patient: z.string({
    required_error: "Veuillez sélectionner un patient",
  }),
  doctor: z.string({
    required_error: "Veuillez sélectionner un médecin",
  }),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Veuillez entrer un format d'heure valide (HH:MM)",
  }),
  consultationType: z.string({
    required_error: "Veuillez sélectionner un type de consultation",
  }),
  reason: z.string().min(5, {
    message: "La raison doit contenir au moins 5 caractères",
  }),
  notes: z.string().optional(),
  isUrgent: z.boolean().default(false),
});

interface NewConsultationFormProps {
  onSuccess: () => void;
}

const NewConsultationForm: React.FC<NewConsultationFormProps> = ({ onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: "09:00",
      isUrgent: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send data to your API
    // For now, we'll just simulate success
    setTimeout(() => {
      alert("Consultation enregistrée avec succès !");
      onSuccess();
    }, 500);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-lg font-medium mb-4">Nouvelle Consultation</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="patient"
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
                      {mockPatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} ({patient.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Sélectionnez le patient concerné par cette consultation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="doctor"
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
                      {mockDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Sélectionnez le médecin qui réalisera la consultation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
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
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Date prévue de la consultation
                  </FormDescription>
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
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="HH:MM" 
                        className="pl-10"
                      />
                    </FormControl>
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <FormDescription>
                    Heure prévue de la consultation (format 24h)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="consultationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de consultation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {consultationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motif de consultation</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez le motif de la consultation..."
                    {...field}
                    rows={3}
                  />
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
                <FormLabel>Notes complémentaires</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Informations complémentaires..."
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  Facultatif - Ajoutez des informations supplémentaires si nécessaire
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isUrgent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Consultation urgente</FormLabel>
                  <FormDescription>
                    Cochez cette case si la consultation doit être traitée en urgence
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer la consultation
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewConsultationForm;
