
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmployeeFormValues } from './employeeFormSchema';
import { EmployeeAddress } from '@/types/employee';

const PersonalInfoFields: React.FC = () => {
  const form = useFormContext<EmployeeFormValues>();

  // Helper to convert address object to string if needed
  const formatAddressValue = (addressValue: any): string => {
    if (typeof addressValue === 'string') {
      return addressValue;
    }
    
    // Convert address object to string
    if (!addressValue) return '';
    
    const { street, streetNumber, city, postalCode, department, country } = addressValue as EmployeeAddress;
    
    // Make sure to handle potentially missing required fields
    const parts = [
      streetNumber && street ? `${streetNumber} ${street}` : street || 'Rue non spécifiée',
      city || 'Ville non spécifiée',
      postalCode || '00000',
      department ? `(${department})` : '',
      country || 'France'
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="Prénom" {...field} />
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
                <Input placeholder="Nom" {...field} />
              </FormControl>
              <FormMessage />
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
              <Input type="email" placeholder="email@example.com" {...field} />
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
              <Input placeholder="+33 6 12 34 56 78" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => {
          const { onChange, value, ...rest } = field;
          const stringValue = value ? formatAddressValue(value) : '';
          
          return (
            <FormItem>
              <FormLabel>Adresse</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Adresse complète" 
                  value={stringValue}
                  onChange={(e) => onChange(e.target.value)}
                  {...rest}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
};

export default PersonalInfoFields;
