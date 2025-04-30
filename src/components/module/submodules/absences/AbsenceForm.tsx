
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface AbsenceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AbsenceForm: React.FC<AbsenceFormProps> = ({ onSubmit, onCancel }) => {
  const { employees = [] } = useEmployeeData();
  const form = useForm({
    defaultValues: {
      employeeId: '',
      employeeName: '',
      type: 'paid',
      startDate: undefined,
      endDate: undefined,
      reason: '',
      notes: ''
    }
  });

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      form.setValue('employeeId', employeeId);
      form.setValue('employeeName', `${employee.firstName} ${employee.lastName}`);
    }
  };

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employé</FormLabel>
              <Select 
                onValueChange={(value) => handleEmployeeChange(value)}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un employé" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employees.map(employee => (
                    <SelectItem 
                      key={employee.id} 
                      value={employee.id}
                    >
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d'absence</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="paid">Congés payés</SelectItem>
                  <SelectItem value="unpaid">Congés sans solde</SelectItem>
                  <SelectItem value="sick">Congés maladie</SelectItem>
                  <SelectItem value="maternity">Congés maternité</SelectItem>
                  <SelectItem value="paternity">Congés paternité</SelectItem>
                  <SelectItem value="rtt">RTT</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="Date de début"
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
                    placeholder="Date de fin"
                    fromMonth={form.watch('startDate')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motif</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Indiquez le motif de l'absence"
                  {...field}
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
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes additionnelles"
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
          <Button type="submit">
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AbsenceForm;
