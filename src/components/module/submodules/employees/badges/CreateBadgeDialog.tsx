
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData, generateBadgeNumber } from '../badges/BadgeTypes';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define a getInitials function since it's missing from utils
const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const badgeFormSchema = z.object({
  employeeId: z.string().min(1, "Veuillez sélectionner un employé"),
  accessLevel: z.string().min(1, "Veuillez sélectionner un niveau d'accès"),
  departmentId: z.string().optional(),
  companyId: z.string().optional(),
});

type BadgeFormValues = z.infer<typeof badgeFormSchema>;

interface CreateBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBadgeCreated: (newBadge: BadgeData) => Promise<void>;
  employees?: Employee[];
}

const CreateBadgeDialog: React.FC<CreateBadgeDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onBadgeCreated,
  employees = []
}) => {
  const [badgeNumber, setBadgeNumber] = useState(generateBadgeNumber());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const form = useForm<BadgeFormValues>({
    resolver: zodResolver(badgeFormSchema),
    defaultValues: {
      employeeId: '',
      accessLevel: '',
      departmentId: '',
      companyId: '',
    }
  });

  const resetForm = () => {
    form.reset();
    setSelectedEmployee(null);
    setBadgeNumber(generateBadgeNumber());
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const onSubmit = (values: BadgeFormValues) => {
    if (!selectedEmployee) {
      toast.error("Veuillez sélectionner un employé valide");
      return;
    }

    // Create a new badge
    const newBadge: BadgeData = {
      id: badgeNumber,
      date: new Date().toISOString().split('T')[0],
      employeeId: selectedEmployee.id,
      employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
      department: selectedEmployee.department || '',
      accessLevel: values.accessLevel,
      status: "success",
      statusText: "Actif",
      company: selectedEmployee.company as string || ''
    };

    // Callback to add the badge
    onBadgeCreated(newBadge);
    
    // Reset form and close dialog
    resetForm();
    onOpenChange(false);
  };

  // Update selected employee when employeeId changes
  const watchEmployeeId = form.watch('employeeId');
  useEffect(() => {
    if (watchEmployeeId) {
      const employee = employees.find(emp => emp.id === watchEmployeeId);
      setSelectedEmployee(employee || null);
    } else {
      setSelectedEmployee(null);
    }
  }, [watchEmployeeId, employees]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau badge</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employé</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un employé" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees && employees.length > 0 ? (
                            employees.map((employee) => (
                              <SelectItem 
                                key={employee.id} 
                                value={employee.id}
                              >
                                {employee.firstName} {employee.lastName}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-employees-available">
                              Aucun employé disponible
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Niveau d'accès</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un niveau" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sécurité Niveau 1">Sécurité Niveau 1</SelectItem>
                          <SelectItem value="Sécurité Niveau 2">Sécurité Niveau 2</SelectItem>
                          <SelectItem value="Sécurité Niveau 3">Sécurité Niveau 3</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="RH">RH</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="DIRECTION">DIRECTION</SelectItem>
                          <SelectItem value="PDG">PDG</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="badge-number" className="text-right col-span-1">
                    Numéro
                  </Label>
                  <Input id="badge-number" className="col-span-3" value={badgeNumber} disabled />
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 border rounded-md">
                {selectedEmployee ? (
                  <div className="text-center space-y-3">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={selectedEmployee.photoURL} alt={selectedEmployee.firstName} />
                      <AvatarFallback className="text-lg">
                        {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-base">{selectedEmployee.firstName} {selectedEmployee.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{selectedEmployee.position || 'Sans poste'}</p>
                      <p className="text-sm text-muted-foreground">{selectedEmployee.department || 'Sans département'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>Sélectionnez un employé pour voir sa photo</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Annuler</Button>
              <Button type="submit">Créer le badge</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBadgeDialog;
