
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Employee } from '@/types/employee';
import { updateEmployee } from '../services/employeeService';
import { toast } from 'sonner';

// Define validation schema for editing employee info
const employeeInfoSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide').min(1, 'Email est requis'),
  phone: z.string().optional(),
  position: z.string().optional(),
  professionalEmail: z.string().email('Email professionnel invalide').optional().or(z.literal('')),
  address: z.object({
    street: z.string().optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    postalCode: z.string().optional().or(z.literal('')),
    country: z.string().optional().or(z.literal(''))
  }).optional().or(z.record(z.string())),
  socialSecurityNumber: z.string().optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal(''))
});

type EmployeeInfoFormValues = z.infer<typeof employeeInfoSchema>;

interface EditEmployeeInfoFormProps {
  employee: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditEmployeeInfoForm: React.FC<EditEmployeeInfoFormProps> = ({ employee, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with employee data
  const form = useForm<EmployeeInfoFormValues>({
    resolver: zodResolver(employeeInfoSchema),
    defaultValues: {
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || employee.role || '',
      professionalEmail: employee.professionalEmail || employee.email || '',
      address: {
        street: employee.address?.street || '',
        city: employee.address?.city || '',
        postalCode: employee.address?.postalCode || '',
        country: employee.address?.country || ''
      },
      socialSecurityNumber: employee.socialSecurityNumber || '',
      birthDate: employee.birthDate || ''
    }
  });

  // Submit handler
  const onSubmit = async (data: EmployeeInfoFormValues) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting updated employee data:", data);
      
      // Format address object correctly
      const formattedData = {
        ...data,
        address: {
          street: data.address?.street || '',
          city: data.address?.city || '',
          postalCode: data.address?.postalCode || '',
          country: data.address?.country || ''
        }
      };
      
      const success = await updateEmployee(employee.id, formattedData);
      
      if (success) {
        onSuccess();
        toast.success('Informations mises à jour avec succès');
      } else {
        toast.error('Échec de la mise à jour des informations');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Une erreur est survenue'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Information */}
          <div className="space-y-4 col-span-2">
            <h3 className="text-lg font-medium">Informations personnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="socialSecurityNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de sécurité sociale</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Address Information */}
          <div className="space-y-4 col-span-2">
            <h3 className="text-lg font-medium">Adresse</h3>
            
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rue</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Professional Information */}
          <div className="space-y-4 col-span-2">
            <h3 className="text-lg font-medium">Informations professionnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poste</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="professionalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email professionnel</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditEmployeeInfoForm;
