
import React from 'react';
import { Employee } from '@/types/employee';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../form/employeeFormSchema';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface InformationsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
  form?: UseFormReturn<EmployeeFormValues>;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee, 
  isEditing = false,
  form
}) => {
  if (isEditing && !form) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Erreur: Configuration du formulaire manquante
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        {isEditing && form ? (
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input {...field} defaultValue={employee.firstName} />
                        </FormControl>
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
                          <Input {...field} defaultValue={employee.lastName} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} defaultValue={employee.email} />
                      </FormControl>
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
                        <Input {...field} defaultValue={employee.phone} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poste</FormLabel>
                      <FormControl>
                        <Input {...field} defaultValue={employee.position} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Département</FormLabel>
                      <FormControl>
                        <Input {...field} defaultValue={employee.department} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Prénom</FormLabel>
                  <div className="p-2 border rounded-md bg-muted/10">{employee.firstName}</div>
                </div>
                <div className="space-y-2">
                  <FormLabel>Nom</FormLabel>
                  <div className="p-2 border rounded-md bg-muted/10">{employee.lastName}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Email</FormLabel>
                <div className="p-2 border rounded-md bg-muted/10">{employee.email}</div>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Téléphone</FormLabel>
                <div className="p-2 border rounded-md bg-muted/10">{employee.phone || '-'}</div>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Poste</FormLabel>
                <div className="p-2 border rounded-md bg-muted/10">{employee.position || '-'}</div>
              </div>
              
              <div className="space-y-2">
                <FormLabel>Département</FormLabel>
                <div className="p-2 border rounded-md bg-muted/10">{employee.department || '-'}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InformationsTab;
