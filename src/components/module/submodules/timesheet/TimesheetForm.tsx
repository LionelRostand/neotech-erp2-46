
import React, { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { startOfWeek, endOfWeek, format, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Employee } from "@/types/employee";
import { TimeReportStatus } from "@/types/timesheet";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
  employeeId: z.string().min(1, { message: "Veuillez sélectionner un employé" }),
  weekStartDate: z.date(),
  weekEndDate: z.date(),
  hours: z.object({
    monday: z.string().regex(/^\d*\.?\d*$/, { message: "Format invalide" }).optional(),
    tuesday: z.string().regex(/^\d*\.?\d*$/, { message: "Format invalide" }).optional(),
    wednesday: z.string().regex(/^\d*\.?\d*$/, { message: "Format invalide" }).optional(),
    thursday: z.string().regex(/^\d*\.?\d*$/, { message: "Format invalide" }).optional(),
    friday: z.string().regex(/^\d*\.?\d*$/, { message: "Format invalide" }).optional(),
    saturday: z.string().regex(/^\d*\.?\d*$/, { message: "Format invalide" }).optional(),
    sunday: z.string().regex(/^\d*\.?\d*$/, { message: "Format invalide" }).optional(),
  }),
  totalHours: z.number(),
  status: z.string(),
  notes: z.string().optional(),
});

type TimesheetFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  employees: Employee[];
  isSubmitting: boolean;
};

const TimesheetForm: React.FC<TimesheetFormProps> = ({ 
  onSubmit, 
  onCancel, 
  employees,
  isSubmitting
}) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const defaultDays = {
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      hours: defaultDays,
      totalHours: 0,
      status: "active",
      notes: "",
    },
  });

  const watchHours = form.watch("hours");
  
  // Calculer le total des heures
  useEffect(() => {
    const total = Object.values(watchHours).reduce((sum, hours) => {
      const value = parseFloat(hours || "0");
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    
    form.setValue("totalHours", parseFloat(total.toFixed(2)));
  }, [watchHours, form]);

  // Fonction pour générer la liste de jours basée sur la date de début de semaine
  const generateDaysList = (startDate: Date) => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startDate, i);
      const dayName = format(date, 'EEEE', { locale: fr });
      const dayLower = dayName.toLowerCase() as keyof typeof watchHours;
      return {
        name: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        date: format(date, 'dd/MM/yyyy'),
        key: dayLower,
      };
    });
  };
  
  // Mettre à jour la date de fin quand la date de début change
  const handleStartDateChange = (date: Date) => {
    const newEndDate = addDays(date, 6);
    form.setValue("weekStartDate", date);
    form.setValue("weekEndDate", newEndDate);
  };
  
  const days = generateDaysList(form.getValues("weekStartDate"));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">Nouvelle feuille de temps</h2>
          
          {/* Sélection de l'employé */}
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employé</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un employé" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Période (date de début) */}
          <FormField
            control={form.control}
            name="weekStartDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Début de période</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={(date) => date && handleStartDateChange(date)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Affichage de la période */}
          <div className="text-sm text-gray-600">
            Période: {format(form.getValues("weekStartDate"), 'dd/MM/yyyy')} - {format(form.getValues("weekEndDate"), 'dd/MM/yyyy')}
          </div>
          
          {/* Heures par jour */}
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="text-sm font-medium mb-3">Heures travaillées</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {days.map((day) => (
                <FormField
                  key={day.key}
                  control={form.control}
                  name={`hours.${day.key}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{day.name} ({day.date})</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="0"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          
          {/* Total des heures */}
          <div className="flex justify-end">
            <div className="text-sm font-medium">
              Total des heures: <span className="text-primary">{form.getValues("totalHours")}</span>
            </div>
          </div>
          
          {/* Statut */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">En cours</SelectItem>
                    <SelectItem value="pending">Soumis</SelectItem>
                    <SelectItem value="validated">Validé</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Commentaires ou notes concernant cette feuille de temps..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TimesheetForm;
