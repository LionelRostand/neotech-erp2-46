
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { addTimeSheet } from './services/timesheetService';
import { toast } from 'sonner';

// Define form schema
const formSchema = z.object({
  title: z.string().min(2, { message: 'Le titre est requis' }),
  employeeId: z.string().min(1, { message: "L'employé est requis" }),
  startDate: z.date({ required_error: "La date de début est requise" }),
  endDate: z.date({ required_error: "La date de fin est requise" }),
  totalHours: z.coerce.number().min(0, { message: "Le nombre d'heures doit être positif" }),
  status: z.enum(["En cours", "Soumis", "Validé", "Rejeté"]),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TimesheetFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({ onSubmit, onCancel }) => {
  const { employees, isLoading } = useEmployeeData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: Partial<FormValues> = {
    title: '',
    employeeId: '',
    startDate: new Date(),
    endDate: new Date(),
    totalHours: 0,
    status: "En cours",
    comments: '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Prepare data for submission
      const selectedEmployee = employees.find(emp => emp.id === values.employeeId);
      const timeSheetData = {
        ...values,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : 'Employé inconnu',
        employeePhoto: selectedEmployee?.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        lastUpdateText: new Date().toLocaleDateString('fr'),
      };

      // Call the onSubmit function passed from parent
      await onSubmit(timeSheetData);
      
      toast.success('Feuille de temps créée avec succès');
      form.reset(defaultValues);
    } catch (error) {
      console.error('Erreur lors de la soumission de la feuille de temps:', error);
      toast.error("Erreur lors de la création de la feuille de temps");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to get a unique list of employees (no duplicates)
  const getUniqueEmployees = () => {
    if (!employees || employees.length === 0) return [];

    // Create a map to store unique employees by ID
    const uniqueEmployeesMap = new Map();

    // Add each employee to the map, overwriting any duplicates
    employees.forEach(employee => {
      // Only add active employees
      if (employee.status === 'active' || employee.status === 'Actif') {
        uniqueEmployeesMap.set(employee.id, employee);
      }
    });

    // Convert the map back to an array
    return Array.from(uniqueEmployeesMap.values());
  };

  // Get unique employees list
  const uniqueEmployees = getUniqueEmployees();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <h2 className="text-lg font-medium text-center mb-4">Créer une nouvelle feuille de temps</h2>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Nom de la feuille de temps" {...field} />
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
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Use the unique employees list here */}
                  {uniqueEmployees && uniqueEmployees.map(employee => (
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
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Sélectionner une date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Sélectionner une date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="totalHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre d'heures</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0.5" {...field} />
              </FormControl>
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
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Soumis">Soumis</SelectItem>
                  <SelectItem value="Validé">Validé</SelectItem>
                  <SelectItem value="Rejeté">Rejeté</SelectItem>
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
              <FormLabel>Commentaires</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Commentaires ou notes supplémentaires" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center justify-end space-x-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TimesheetForm;
