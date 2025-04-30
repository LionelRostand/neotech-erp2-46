
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Employee } from '@/types/employee';

interface InformationsTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

const InformationsTabEdit: React.FC<InformationsTabEditProps> = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState({
    firstName: employee.firstName || "",
    lastName: employee.lastName || "",
    email: employee.email || "",
    phone: employee.phone || "",
    position: employee.position || "",
    department: employee.department || "",
    status: employee.status || "active",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input 
            id="firstName" 
            name="firstName"
            value={formData.firstName} 
            onChange={handleInputChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input 
            id="lastName" 
            name="lastName"
            value={formData.lastName} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email"
            type="email"
            value={formData.email} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input 
            id="phone" 
            name="phone"
            value={formData.phone} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Poste</Label>
          <Input 
            id="position" 
            name="position"
            value={formData.position} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Département</Label>
          <Input 
            id="department" 
            name="department"
            value={formData.department} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
              <SelectItem value="onLeave">En congé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Sauvegarder
        </Button>
      </div>
    </form>
  );
};

export default InformationsTabEdit;
