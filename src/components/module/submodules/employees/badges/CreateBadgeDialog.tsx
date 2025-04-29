
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { generateBadgeNumber } from './BadgeTypes';

interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBadgeCreated: (newBadge: BadgeData) => Promise<void>;
  employees?: Employee[];
}

// Form schema for badge creation
const formSchema = z.object({
  employeeId: z.string({
    required_error: "Veuillez sélectionner un employé",
  }),
  accessLevel: z.string({
    required_error: "Veuillez sélectionner un niveau d'accès",
  }),
  department: z.string().optional(),
  status: z.string().default("success"),
  company: z.string().optional(),
});

const accessLevels = [
  { value: "Accès complet", label: "Accès complet" },
  { value: "Accès restreint", label: "Accès restreint" },
  { value: "Accès visiteur", label: "Accès visiteur" },
  { value: "Accès entreprise", label: "Accès entreprise" },
];

const statusOptions = [
  { value: "success", label: "Actif" },
  { value: "warning", label: "En attente" },
  { value: "danger", label: "Désactivé" },
];

const CreateBadgeDialog: React.FC<CreateBadgeDialogProps> = ({
  isOpen,
  onOpenChange,
  onBadgeCreated,
  employees = []
}) => {
  const { departments } = useAvailableDepartments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessLevel: "Accès restreint",
      status: "success",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const selectedEmployee = employees.find(emp => emp.id === values.employeeId);
      
      if (!selectedEmployee) {
        throw new Error("Employé non trouvé");
      }
      
      const employeeName = `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
      const badgeId = generateBadgeNumber();
      const todayDate = new Date().toLocaleDateString('fr-FR');
      
      // Get the department name
      const departmentObj = departments.find(dept => dept.id === values.department);
      
      // Create new badge
      const newBadge: BadgeData = {
        id: badgeId,
        employeeId: values.employeeId,
        employeeName: employeeName,
        department: departmentObj?.name || values.department || '',
        accessLevel: values.accessLevel,
        status: values.status as "success" | "warning" | "danger",
        statusText: statusOptions.find(s => s.value === values.status)?.label || "Actif",
        date: todayDate,
        company: values.company || selectedEmployee.company || '',
      };
      
      await onBadgeCreated(newBadge);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la création du badge:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSelectEmployee = (employeeId: string) => {
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    if (selectedEmployee && selectedEmployee.department) {
      form.setValue('department', selectedEmployee.department);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau badge</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employé</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      onSelectEmployee(value);
                    }}
                    defaultValue={field.value}
                  >
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
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Département</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un département" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
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
              name="accessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d'accès</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le niveau d'accès" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accessLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
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
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise (optionnel)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom de l'entreprise" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer le badge"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBadgeDialog;
