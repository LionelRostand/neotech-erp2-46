
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { updateEmployeeDoc } from '@/services/employeeService';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InformationsTabProps {
  employee: Employee;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee,
  onEmployeeUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: employee.email || '',
    phone: employee.phone || '',
    professionalEmail: employee.professionalEmail || '',
    streetNumber: employee.address_string?.split(',')[0]?.trim().split(' ')[0] || '',
    streetName: employee.address_string?.split(',')[0]?.trim().split(' ').slice(1).join(' ') || 
               (typeof employee.address === 'object' ? employee.address?.street : ''),
    city: typeof employee.address === 'object' ? employee.address?.city : 
          employee.address_string?.split(',')[1]?.trim() || '',
    zipCode: typeof employee.address === 'object' ? employee.address?.postalCode : 
             employee.address_string?.split(',')[2]?.trim() || '',
    managerId: employee.managerId || ''
  });
  
  const { employees } = useEmployeeData();
  
  // Filtrer uniquement les managers pour la liste déroulante
  const managers = employees.filter(emp => 
    emp.isManager || 
    (emp.position && emp.position.toLowerCase().includes('manager')) ||
    emp.forceManager
  ).filter(manager => manager.id !== employee.id); // Exclure l'employé actuel
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    // Réinitialiser le formulaire aux valeurs actuelles de l'employé
    setFormData({
      email: employee.email || '',
      phone: employee.phone || '',
      professionalEmail: employee.professionalEmail || '',
      streetNumber: employee.address_string?.split(',')[0]?.trim().split(' ')[0] || '',
      streetName: employee.address_string?.split(',')[0]?.trim().split(' ').slice(1).join(' ') || 
                 (typeof employee.address === 'object' ? employee.address?.street : ''),
      city: typeof employee.address === 'object' ? employee.address?.city : 
            employee.address_string?.split(',')[1]?.trim() || '',
      zipCode: typeof employee.address === 'object' ? employee.address?.postalCode : 
               employee.address_string?.split(',')[2]?.trim() || '',
      managerId: employee.managerId || ''
    });
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    try {
      // Construire l'adresse complète
      const addressString = `${formData.streetNumber} ${formData.streetName}, ${formData.city}, ${formData.zipCode}`;
      
      // Préparer les données pour la mise à jour
      const updateData: Partial<Employee> = {
        email: formData.email,
        phone: formData.phone,
        professionalEmail: formData.professionalEmail,
        address_string: addressString,
        address: {
          street: `${formData.streetNumber} ${formData.streetName}`,
          city: formData.city,
          postalCode: formData.zipCode,
          country: typeof employee.address === 'object' ? employee.address.country : 'France'
        },
        managerId: formData.managerId
      };
      
      // Mettre à jour l'employé dans la base de données
      const updatedEmployee = await updateEmployeeDoc(employee.id, updateData);
      
      if (updatedEmployee) {
        toast.success('Informations mises à jour avec succès');
        
        // Si un callback de mise à jour a été fourni, l'appeler avec l'employé mis à jour
        if (typeof onEmployeeUpdated === 'function') {
          onEmployeeUpdated(updatedEmployee);
        }
        
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations:', error);
      toast.error('Erreur lors de la mise à jour des informations');
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="professionalEmail">Email professionnel</Label>
              <Input
                id="professionalEmail"
                name="professionalEmail"
                value={formData.professionalEmail}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="streetNumber">N° rue</Label>
                <Input
                  id="streetNumber"
                  name="streetNumber"
                  value={formData.streetNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="streetName">Nom de rue</Label>
                <Input
                  id="streetName"
                  name="streetName"
                  value={formData.streetName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="zipCode">Code postal</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="manager">Responsable</Label>
              {isEditing ? (
                <Select
                  value={formData.managerId || "none"}
                  onValueChange={(value) => handleSelectChange('managerId', value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun responsable</SelectItem>
                    {managers.map(manager => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.lastName} {manager.firstName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={employee.manager || 'Non défini'}
                  disabled={true}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InformationsTab;
