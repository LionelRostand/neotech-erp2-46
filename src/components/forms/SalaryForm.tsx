
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { EmployeeSalary } from '@/hooks/useEmployeeSalaries';
import { Loader2 } from 'lucide-react';

interface SalaryFormProps {
  initialData?: EmployeeSalary;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SalaryForm: React.FC<SalaryFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm({
    defaultValues: initialData || {
      employeeId: '',
      employeeName: '',
      amount: 0, // Changed from string to number
      currency: 'EUR',
      effectiveDate: new Date().toISOString().split('T')[0],
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'En attente',
      paymentMethod: 'Virement bancaire',
      description: '',
    }
  });

  React.useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    }
  }, [initialData, setValue]);

  const onFormSubmit = (data: any) => {
    // Convert amount to number
    const formattedData = {
      ...data,
      amount: Number(data.amount)
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeId">ID de l'employé</Label>
          <Input
            id="employeeId"
            {...register('employeeId', { required: "L'ID de l'employé est requis" })}
          />
          {errors.employeeId && (
            <p className="text-sm text-red-500">{errors.employeeId.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="employeeName">Nom de l'employé</Label>
          <Input
            id="employeeName"
            {...register('employeeName', { required: "Le nom de l'employé est requis" })}
          />
          {errors.employeeName && (
            <p className="text-sm text-red-500">{errors.employeeName.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Montant</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            {...register('amount', { required: "Le montant est requis" })}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Devise</Label>
          <Select 
            defaultValue={watch('currency')} 
            onValueChange={(value) => setValue('currency', value)}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Sélectionner une devise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="CHF">CHF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="effectiveDate">Date effective</Label>
          <Input
            id="effectiveDate"
            type="date"
            {...register('effectiveDate', { required: "La date effective est requise" })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentDate">Date de paiement</Label>
          <Input
            id="paymentDate"
            type="date"
            {...register('paymentDate', { required: "La date de paiement est requise" })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            defaultValue={watch('status')} 
            onValueChange={(value) => setValue('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Payé">Payé</SelectItem>
              <SelectItem value="En attente">En attente</SelectItem>
              <SelectItem value="Annulé">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Méthode de paiement</Label>
          <Select 
            defaultValue={watch('paymentMethod')} 
            onValueChange={(value) => setValue('paymentMethod', value)}
          >
            <SelectTrigger id="paymentMethod">
              <SelectValue placeholder="Sélectionner une méthode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Virement bancaire">Virement bancaire</SelectItem>
              <SelectItem value="Chèque">Chèque</SelectItem>
              <SelectItem value="Espèces">Espèces</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          {...register('description')}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default SalaryForm;
