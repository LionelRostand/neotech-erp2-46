
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';

const CompanyDepartmentFields = () => {
  const { register, control, formState: { errors }, setValue, watch } = useFormContext();
  const { departments = [], isLoading } = useAvailableDepartments();
  
  const contractType = watch('contract');
  const hireDate = watch('hireDate');
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setValue('hireDate', date.toISOString().split('T')[0]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Informations professionnelles</h3>
      
      {/* Company field */}
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entreprise</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nom de l'entreprise" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Department field */}
      <FormField
        control={control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Département</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département">
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Chargement...
                      </div>
                    ) : field.value}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Position field */}
      <FormField
        control={control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Poste</FormLabel>
            <FormControl>
              <Input 
                placeholder="Poste occupé" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contract type */}
      <FormField
        control={control}
        name="contract"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Type de contrat</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
                className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cdi" id="cdi" />
                  <Label htmlFor="cdi">CDI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cdd" id="cdd" />
                  <Label htmlFor="cdd">CDD</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="interim" id="interim" />
                  <Label htmlFor="interim">Intérim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="freelance" id="freelance" />
                  <Label htmlFor="freelance">Freelance</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Hire date */}
      <FormField
        control={control}
        name="hireDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date d'embauche</FormLabel>
            <DatePicker 
              value={field.value ? new Date(field.value) : undefined}
              onChange={handleDateChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Employee status */}
      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Statut</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Statut de l'employé" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="onLeave">En congé</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Pro Email */}
      <FormField
        control={control}
        name="professionalEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Professionnel</FormLabel>
            <FormControl>
              <Input 
                type="email"
                placeholder="Email professionnel" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyDepartmentFields;
