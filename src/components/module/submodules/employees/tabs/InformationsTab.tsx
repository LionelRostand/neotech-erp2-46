
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/formatters';
import { Employee, EmployeeAddress } from '@/types/employee';
import { toast } from 'sonner';
import { updateEmployeeDoc } from '@/services/employeeService';

interface InformationsTabProps {
  employee: Employee;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee, 
  onEmployeeUpdated,
  isEditing: isEditingProp = false,
  onFinishEditing
}) => {
  const [isEditing, setIsEditing] = useState(isEditingProp);
  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone || '',
    position: employee.position || '',
    department: employee.department || '',
    hireDate: employee.hireDate || '',
    street: typeof employee.address === 'object' ? employee.address.street : '',
    city: typeof employee.address === 'object' ? employee.address.city : '',
    postalCode: typeof employee.address === 'object' ? employee.address.postalCode : '',
    country: typeof employee.address === 'object' ? employee.address.country : 'France',
    status: employee.status || 'active',
    contract: employee.contract || '',
    socialSecurityNumber: employee.socialSecurityNumber || '',
    birthDate: employee.birthDate || '',
    manager: employee.manager || '',
    professionalEmail: employee.professionalEmail || ''
  });
  
  // Use isEditingProp if it's provided
  useEffect(() => {
    setIsEditing(isEditingProp);
  }, [isEditingProp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      position: employee.position || '',
      department: employee.department || '',
      hireDate: employee.hireDate || '',
      street: typeof employee.address === 'object' ? employee.address.street : '',
      city: typeof employee.address === 'object' ? employee.address.city : '',
      postalCode: typeof employee.address === 'object' ? employee.address.postalCode : '',
      country: typeof employee.address === 'object' ? employee.address.country : 'France',
      status: employee.status || 'active',
      contract: employee.contract || '',
      socialSecurityNumber: employee.socialSecurityNumber || '',
      birthDate: employee.birthDate || '',
      manager: employee.manager || '',
      professionalEmail: employee.professionalEmail || ''
    });
    setIsEditing(false);
    if (onFinishEditing) {
      onFinishEditing();
    }
  };

  const handleSave = async () => {
    try {
      const addressObj: EmployeeAddress = {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      };

      const updatedEmployee = await updateEmployeeDoc(employee.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        hireDate: formData.hireDate,
        address: addressObj,
        status: formData.status as Employee['status'],
        contract: formData.contract,
        socialSecurityNumber: formData.socialSecurityNumber,
        birthDate: formData.birthDate,
        manager: formData.manager,
        professionalEmail: formData.professionalEmail
      });

      if (updatedEmployee) {
        toast.success('Informations mises à jour avec succès');
        if (typeof onEmployeeUpdated === 'function') {
          onEmployeeUpdated(updatedEmployee);
        }
        setIsEditing(false);
        if (onFinishEditing) {
          onFinishEditing();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations:', error);
      toast.error('Erreur lors de la mise à jour des informations: ' + (error as Error).message);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Informations personnelles</h3>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <XCircle className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Prénom</label>
              {isEditing ? (
                <Input 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Nom</label>
              {isEditing ? (
                <Input 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.lastName}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Email</label>
              {isEditing ? (
                <Input 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.email}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Email professionnel</label>
              {isEditing ? (
                <Input 
                  name="professionalEmail"
                  value={formData.professionalEmail}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.professionalEmail || '-'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Téléphone</label>
              {isEditing ? (
                <Input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.phone || '-'}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Date de naissance</label>
              {isEditing ? (
                <Input 
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="JJ/MM/AAAA"
                />
              ) : (
                <p className="mt-1">{employee.birthDate ? formatDate(employee.birthDate) : '-'}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Adresse</label>
              {isEditing ? (
                <div className="space-y-2 mt-1">
                  <Input 
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Rue"
                  />
                  <Input 
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Code postal"
                  />
                  <Input 
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ville"
                  />
                  <Input 
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Pays"
                  />
                </div>
              ) : (
                <p className="mt-1">
                  {typeof employee.address === 'object' 
                    ? `${employee.address.street}, ${employee.address.postalCode} ${employee.address.city}, ${employee.address.country}` 
                    : employee.address || '-'}
                </p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Numéro de sécurité sociale</label>
              {isEditing ? (
                <Input 
                  name="socialSecurityNumber"
                  value={formData.socialSecurityNumber}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.socialSecurityNumber || '-'}</p>
              )}
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mt-8 mb-4">Informations professionnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Poste</label>
              {isEditing ? (
                <Input 
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.position || '-'}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Département</label>
              {isEditing ? (
                <Input 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.department || '-'}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Date d'embauche</label>
              {isEditing ? (
                <Input 
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className="mt-1"
                  placeholder="JJ/MM/AAAA"
                />
              ) : (
                <p className="mt-1">{employee.hireDate ? formatDate(employee.hireDate) : '-'}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Type de contrat</label>
              {isEditing ? (
                <Input 
                  name="contract"
                  value={formData.contract}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.contract || '-'}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Manager</label>
              {isEditing ? (
                <Input 
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.manager || '-'}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium">Statut</label>
              {isEditing ? (
                <Input 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{employee.status || 'Actif'}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InformationsTab;
