import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Employee } from '@/types/employee';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { Calendar, Home, Mail, Phone, Briefcase, Building2, CalendarClock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface InformationsTabProps {
  employee: Employee;
  onEmployeeUpdated: (updatedEmployee: Employee) => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee, 
  onEmployeeUpdated 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const { employees } = useEmployeeData();
  const [managers, setManagers] = useState<Employee[]>([]);

  useEffect(() => {
    // Reset form data when employee changes or editing mode toggled
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone || '',
        birthDate: employee.birthDate || '',
        streetNumber: employee.streetNumber || '',
        streetName: employee.streetName || '',
        city: employee.city || '',
        zipCode: employee.zipCode || '',
        region: employee.region || '',
        position: employee.position || '',
        department: employee.department || '',
        contract: employee.contract || '',
        hireDate: employee.hireDate || '',
        managerId: employee.managerId || '',
      });
    }
  }, [employee, isEditing]);

  // Filter managers from employees
  useEffect(() => {
    if (employees) {
      const managersList = employees.filter(emp => 
        emp.isManager || 
        (emp.position && emp.position.toLowerCase().includes('manager')) ||
        (emp.role && emp.role.toLowerCase().includes('manager'))
      );
      setManagers(managersList);
    }
  }, [employees]);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Update employee with form data
    const updatedEmployee = {
      ...employee,
      ...formData,
      // Make sure we're keeping the address structure consistent
      address: formData.streetNumber && formData.streetName ? {
        street: `${formData.streetNumber} ${formData.streetName}`,
        city: formData.city || '',
        postalCode: formData.zipCode || '',
        country: 'France', // Default to France
        state: formData.region || ''
      } : employee.address
    };
    
    // Call the update function
    onEmployeeUpdated(updatedEmployee);
    setIsEditing(false);
  };

  const formatAddress = () => {
    if (employee.streetNumber && employee.streetName) {
      return `${employee.streetNumber} ${employee.streetName}, ${employee.city || ''} ${employee.zipCode || ''}, ${employee.region || ''}`;
    } else if (typeof employee.address === 'object') {
      return `${employee.address.street || ''}, ${employee.address.city || ''} ${employee.address.postalCode || ''}, ${employee.address.state || ''}`;
    } else if (typeof employee.address === 'string' && employee.address) {
      return employee.address;
    }
    return 'Non spécifiée';
  };

  const getManagerName = () => {
    if (employee.managerId) {
      const manager = employees?.find(emp => emp.id === employee.managerId);
      return manager ? `${manager.firstName} ${manager.lastName}` : 'Non spécifié';
    }
    return 'Non spécifié';
  };

  if (!employee) return null;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Informations personnelles</h3>
          {!isEditing ? (
            <Button variant="outline" onClick={handleStartEditing}>
              Modifier
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancelEditing}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                Enregistrer
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Date de naissance</Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-4 col-span-full">
                <Label>Adresse</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="streetNumber">Numéro de rue</Label>
                    <Input
                      id="streetNumber"
                      name="streetNumber"
                      value={formData.streetNumber || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="streetName">Nom de rue</Label>
                    <Input
                      id="streetName"
                      name="streetName"
                      value={formData.streetName || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Code postal</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Région</Label>
                    <Input
                      id="region"
                      name="region"
                      value={formData.region || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Prénom</span>
                <p>{employee.firstName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Nom</span>
                <p>{employee.lastName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Email</span>
                <p>{employee.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Téléphone</span>
                <p>{employee.phone || 'Non spécifié'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Date de naissance</span>
                <p>{employee.birthDate ? formatDate(new Date(employee.birthDate)) : 'Non spécifiée'}</p>
              </div>
              <div className="col-span-full">
                <span className="text-sm font-medium text-muted-foreground">Adresse</span>
                <p className="flex items-center">
                  <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                  {formatAddress()}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-medium mb-4">Informations professionnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="position">Poste</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract">Type de contrat</Label>
                  <Input
                    id="contract"
                    name="contract"
                    value={formData.contract || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hireDate">Date d'embauche</Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      id="hireDate"
                      name="hireDate"
                      type="date"
                      value={formData.hireDate || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="managerId">Responsable</Label>
                  <Select 
                    value={formData.managerId || 'none'} 
                    onValueChange={(value) => handleSelectChange('managerId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun responsable</SelectItem>
                      {managers.map((manager) => (
                        <SelectItem key={manager.id} value={manager.id}>
                          {manager.firstName} {manager.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Poste</span>
                  <p className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    {employee.position || 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Département</span>
                  <p className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    {employee.department || 'Non spécifié'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Type de contrat</span>
                  <p>{employee.contract || 'Non spécifié'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Date d'embauche</span>
                  <p className="flex items-center">
                    <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                    {employee.hireDate ? formatDate(new Date(employee.hireDate)) : 'Non spécifiée'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Responsable</span>
                  <p>{getManagerName()}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InformationsTab;
