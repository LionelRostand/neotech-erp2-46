
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { addMonths, format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, { message: 'Le titre est requis' }),
  employeeId: z.string().min(1, { message: "L'employé est requis" }),
  month: z.string().min(1, { message: 'Le mois est requis' }),
  comments: z.string().optional(),
});

interface MonthlyTimeSheetFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const MonthlyTimeSheetForm: React.FC<MonthlyTimeSheetFormProps> = ({ onSubmit, onCancel }) => {
  const { employees } = useHrModuleData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Générer des options pour les 12 prochains mois
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = addMonths(new Date(), i);
    return {
      value: date.toISOString(),
      label: format(date, 'MMMM yyyy', { locale: fr })
    };
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      employeeId: '',
      month: monthOptions[0].value,
      comments: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const selectedMonth = new Date(values.month);
      const startDate = startOfMonth(selectedMonth);
      const endDate = endOfMonth(selectedMonth);
      
      // Trouver le nom de l'employé
      const employee = employees.find(emp => emp.id === values.employeeId);
      const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
      const employeePhoto = employee?.photoURL || '';
      
      // Créer l'objet de feuille de temps
      const timeSheetData = {
        title: values.title,
        employeeId: values.employeeId,
        employeeName,
        employeePhoto,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalHours: 0, // Sera mis à jour par l'employé
        status: "En cours" as const,
        comments: values.comments,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        lastUpdateText: `Créée le ${format(new Date(), 'dd/MM/yyyy', { locale: fr })}`,
        details: [],
      };
      
      await onSubmit(timeSheetData);
    } catch (error) {
      console.error("Erreur lors de la création de la feuille de temps:", error);
      toast.error("Erreur lors de la création de la feuille de temps");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la feuille de temps</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Feuille de temps - Mars 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mois</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un mois" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {monthOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaires (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ajouter des informations complémentaires..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer la feuille de temps"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MonthlyTimeSheetForm;
