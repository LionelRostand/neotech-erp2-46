
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Employee } from '@/types/employee';
import { Pencil, Save, X } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useEmployeeService } from '@/hooks/useEmployeeService';
import { toast } from 'sonner';

interface InformationsTabProps {
  employee: Employee;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
}

// Create a schema for the form
const formSchema = z.object({
  streetNumber: z.string().optional(),
  streetName: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  region: z.string().optional(),
  managerId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const InformationsTab: React.FC<InformationsTabProps> = ({ employee, onEmployeeUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { employees } = useEmployeeData();
  const { updateEmployee, isLoading } = useEmployeeService();
  
  // Get managers from employees
  const managers = employees?.filter(emp => emp.isManager || emp.forceManager) || [];
  
  // Initialize form with employee data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(employee),
  });
  
  // Reset form when employee data changes
  useEffect(() => {
    if (employee) {
      form.reset(getDefaultValues(employee));
    }
  }, [employee, form]);
  
  // Convert employee address to form values
  function getDefaultValues(employee: Employee): FormValues {
    let streetNumber = '';
    let streetName = '';
    let city = '';
    let zipCode = '';
    let region = '';
    
    // Handle address depending on its format
    if (typeof employee.address === 'object' && employee.address) {
      city = employee.address.city || '';
      region = employee.address.state || '';
      // For compatibility, some addresses might store postalCode as zipCode
      zipCode = employee.address.postalCode || '';
      
      // Street might be stored as a combined value or separate fields
      if (employee.address.street) {
        // Try to extract street number and name from combined street
        const streetMatch = employee.address.street.match(/^(\d+)\s+(.+)$/);
        if (streetMatch) {
          streetNumber = streetMatch[1];
          streetName = streetMatch[2];
        } else {
          streetName = employee.address.street;
        }
      }
    } else {
      // If address fields are directly on employee
      streetNumber = employee.streetNumber || '';
      streetName = employee.streetName || '';
      city = employee.city || '';
      zipCode = employee.zipCode || '';
      region = employee.region || '';
    }
    
    return {
      streetNumber,
      streetName,
      city,
      zipCode,
      region,
      managerId: employee.managerId || '',
    };
  }
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    form.reset(getDefaultValues(employee));
    setIsEditing(false);
  };
  
  const onSubmit = async (data: FormValues) => {
    try {
      // Prepare update payload
      const updateData: Partial<Employee> = {
        // Add address fields to be updated
        streetNumber: data.streetNumber,
        streetName: data.streetName,
        city: data.city,
        zipCode: data.zipCode,
        region: data.region,
        managerId: data.managerId,
        // If manager ID is set, we need to update manager name too
        manager: data.managerId ? 
          managers.find(m => m.id === data.managerId)?.lastName + ' ' + 
          managers.find(m => m.id === data.managerId)?.firstName : 
          '',
      };
      
      // Update employee
      const updatedEmployee = await updateEmployee(employee.id, updateData);
      
      if (updatedEmployee) {
        toast.success('Informations mises à jour avec succès');
        setIsEditing(false);
        
        // Call the callback if provided
        if (onEmployeeUpdated) {
          onEmployeeUpdated(updatedEmployee);
        }
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Erreur lors de la mise à jour des informations');
    }
  };
  
  // Format address for display
  const formatAddress = () => {
    if (typeof employee.address === 'object' && employee.address) {
      const parts = [];
      if (employee.address.street) parts.push(employee.address.street);
      if (employee.address.city) parts.push(employee.address.city);
      if (employee.address.postalCode) parts.push(employee.address.postalCode);
      if (employee.address.state) parts.push(employee.address.state);
      if (employee.address.country) parts.push(employee.address.country);
      return parts.join(', ');
    } else if (typeof employee.address === 'string' && employee.address) {
      return employee.address;
    } else {
      const parts = [];
      if (employee.streetNumber || employee.streetName) {
        parts.push(`${employee.streetNumber || ''} ${employee.streetName || ''}`.trim());
      }
      if (employee.city) parts.push(employee.city);
      if (employee.zipCode) parts.push(employee.zipCode);
      if (employee.region) parts.push(employee.region);
      return parts.join(', ') || 'Non spécifiée';
    }
  };
  
  // Format birth date for display
  const formatBirthDate = () => {
    if (!employee.birthDate) return 'Non spécifiée';
    try {
      return format(new Date(employee.birthDate), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return employee.birthDate;
    }
  };
  
  // Format hire date for display
  const formatHireDate = () => {
    if (!employee.hireDate) return 'Non spécifiée';
    try {
      return format(new Date(employee.hireDate), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return employee.hireDate;
    }
  };
  
  // Get manager full name
  const getManagerName = () => {
    if (employee.manager) return employee.manager;
    if (employee.managerId) {
      const manager = employees?.find(emp => emp.id === employee.managerId);
      return manager ? `${manager.lastName} ${manager.firstName}` : 'Non spécifié';
    }
    return 'Non spécifié';
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Informations de base de l'employé</CardDescription>
          </div>
          
          {isEditing ? (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancelEdit}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-1" />
                Annuler
              </Button>
              <Button 
                size="sm" 
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-1" />
                Enregistrer
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={handleEditClick}>
              <Pencil className="w-4 h-4 mr-1" />
              Modifier
            </Button>
          )}
        </CardHeader>
        
        <CardContent>
          {isEditing ? (
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Adresse</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="streetNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de rue</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="streetName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de rue</FormLabel>
                            <FormControl>
                              <Input placeholder="Rue de l'exemple" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input placeholder="Paris" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl>
                              <Input placeholder="75000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Département</FormLabel>
                          <FormControl>
                            <Input placeholder="Île-de-France" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Responsable</h3>
                    
                    <FormField
                      control={form.control}
                      name="managerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsable</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un responsable" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Aucun responsable</SelectItem>
                              {managers.map((manager) => (
                                <SelectItem key={manager.id} value={manager.id}>
                                  {manager.lastName} {manager.firstName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nom & Prénom</h3>
                  <p>{employee.lastName} {employee.firstName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{employee.email || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Téléphone</h3>
                  <p>{employee.phone || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date de naissance</h3>
                  <p>{formatBirthDate()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Adresse</h3>
                  <p>{formatAddress()}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Poste</h3>
                  <p>{employee.position || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Département</h3>
                  <p>{employee.department || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date d'embauche</h3>
                  <p>{formatHireDate()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Type de contrat</h3>
                  <p>{employee.contract || 'Non spécifié'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Responsable</h3>
                  <p>{getManagerName()}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Statut</h3>
                  <Badge variant={employee.status === 'active' || employee.status === 'Actif' ? 'success' : 'destructive'}>
                    {employee.status === 'active' || employee.status === 'Actif' ? 'Actif' : employee.status || 'Non spécifié'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InformationsTab;
