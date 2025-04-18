
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { updateEmployee } from '../services/employeeService';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Clock, HomeIcon, Mail, Phone, User, Briefcase, Building, Fingerprint } from 'lucide-react';

interface InformationsTabProps {
  employee: Employee;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee,
  onEmployeeUpdated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // State for form values
  const [formValues, setFormValues] = useState({
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    email: employee.email || '',
    phone: employee.phone || '',
    position: employee.position || employee.role || '',
    department: employee.department || '',
    hireDate: employee.hireDate || employee.startDate || '',
    street: employee.address?.street || '',
    city: employee.address?.city || '',
    postalCode: employee.address?.postalCode || '',
    country: employee.address?.country || 'France',
    socialSecurityNumber: employee.socialSecurityNumber || '',
    birthDate: employee.birthDate || '',
  });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Create updated employee object
      const updatedEmployeeData = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        phone: formValues.phone,
        position: formValues.position,
        department: formValues.department,
        hireDate: formValues.hireDate,
        address: {
          street: formValues.street,
          city: formValues.city,
          postalCode: formValues.postalCode,
          country: formValues.country
        },
        socialSecurityNumber: formValues.socialSecurityNumber,
        birthDate: formValues.birthDate,
      };
      
      // Call the API
      await updateEmployee(employee.id, updatedEmployeeData);
      
      // Update the employee state in the parent component
      if (onEmployeeUpdated) {
        const updatedEmployee = {
          ...employee,
          ...updatedEmployeeData
        };
        onEmployeeUpdated(updatedEmployee);
      }
      
      toast.success('Informations de l\'employé mises à jour avec succès');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Erreur lors de la mise à jour des informations');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="flex items-center text-sm font-medium">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                Prénom
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                placeholder="Prénom"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lastName" className="flex items-center text-sm font-medium">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                Nom
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                placeholder="Nom"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center text-sm font-medium">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="flex items-center text-sm font-medium">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                Téléphone
              </label>
              <Input
                id="phone"
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                placeholder="Téléphone"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="position" className="flex items-center text-sm font-medium">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                Poste
              </label>
              <Input
                id="position"
                name="position"
                value={formValues.position}
                onChange={handleChange}
                placeholder="Poste ou fonction"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="department" className="flex items-center text-sm font-medium">
                <Building className="h-4 w-4 mr-2 text-gray-500" />
                Département
              </label>
              <Input
                id="department"
                name="department"
                value={formValues.department}
                onChange={handleChange}
                placeholder="Département"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="hireDate" className="flex items-center text-sm font-medium">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                Date d'embauche
              </label>
              <Input
                id="hireDate"
                name="hireDate"
                type="date"
                value={formValues.hireDate.substring(0, 10)}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="birthDate" className="flex items-center text-sm font-medium">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                Date de naissance
              </label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formValues.birthDate?.substring(0, 10) || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="socialSecurityNumber" className="flex items-center text-sm font-medium">
                <Fingerprint className="h-4 w-4 mr-2 text-gray-500" />
                Numéro de sécurité sociale
              </label>
              <Input
                id="socialSecurityNumber"
                name="socialSecurityNumber"
                value={formValues.socialSecurityNumber}
                onChange={handleChange}
                placeholder="Numéro de sécurité sociale"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <HomeIcon className="h-5 w-5 mr-2 text-gray-500" />
              Adresse
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <label htmlFor="street" className="text-sm font-medium">
                  Rue et numéro
                </label>
                <Input
                  id="street"
                  name="street"
                  value={formValues.street}
                  onChange={handleChange}
                  placeholder="Rue et numéro"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="postalCode" className="text-sm font-medium">
                  Code postal
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formValues.postalCode}
                  onChange={handleChange}
                  placeholder="Code postal"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">
                  Ville
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formValues.city}
                  onChange={handleChange}
                  placeholder="Ville"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium">
                  Pays
                </label>
                <Input
                  id="country"
                  name="country"
                  value={formValues.country}
                  onChange={handleChange}
                  placeholder="Pays"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InformationsTab;
