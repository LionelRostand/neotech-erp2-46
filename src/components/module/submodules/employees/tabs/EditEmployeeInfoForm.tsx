
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee } from '@/types/employee';
import { updateEmployee } from '../services/employeeService';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { toast } from 'sonner';

interface EditEmployeeInfoFormProps {
  employee: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditEmployeeInfoForm: React.FC<EditEmployeeInfoFormProps> = ({
  employee,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    firstName: employee.firstName || '',
    lastName: employee.lastName || '',
    email: employee.email || '',
    phone: employee.phone || '',
    birthDate: employee.birthDate || '',
    socialSecurityNumber: employee.socialSecurityNumber || '',
    address: {
      street: employee.address?.street || '',
      city: employee.address?.city || '',
      postalCode: employee.address?.postalCode || '',
      country: employee.address?.country || '',
    },
    position: employee.position || employee.role || '',
    department: employee.department || employee.departmentId || '',
    professionalEmail: employee.professionalEmail || employee.email || '',
    hireDate: employee.hireDate || employee.startDate || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { departments, isLoading: loadingDepartments } = useAvailableDepartments();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await updateEmployee(employee.id, formData);
      
      if (success) {
        toast.success("Informations mises à jour avec succès");
        onSuccess();
      } else {
        toast.error("Échec de la mise à jour des informations");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!employee?.id) {
    return <div>Erreur: Employé non trouvé</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="socialSecurityNumber">Numéro de sécurité sociale</Label>
            <Input
              id="socialSecurityNumber"
              name="socialSecurityNumber"
              value={formData.socialSecurityNumber}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Adresse</h3>
        <div className="space-y-2">
          <Label htmlFor="street">Rue</Label>
          <Input
            id="street"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="postalCode">Code postal</Label>
            <Input
              id="postalCode"
              name="address.postalCode"
              value={formData.address.postalCode}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Pays</Label>
            <Input
              id="country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations professionnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="position">Poste</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleSelectChange(value, 'department')}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                {loadingDepartments ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : departments && departments.length > 0 ? (
                  departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>Aucun département disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="professionalEmail">Email professionnel</Label>
            <Input
              id="professionalEmail"
              name="professionalEmail"
              type="email"
              value={formData.professionalEmail}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hireDate">Date d'embauche</Label>
            <Input
              id="hireDate"
              name="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={handleChange}
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
  );
};

export default EditEmployeeInfoForm;
