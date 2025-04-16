
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee, EmployeeAddress } from '@/types/employee';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/create-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({ 
  open, 
  onOpenChange,
  onCreated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    department: 'IT',
    status: 'active',
    hireDate: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create new employee 
      const newEmployee: Partial<Employee> = {
        ...formData,
        address: {
          street: '',
          city: '',
          postalCode: '',
          country: ''
        } as EmployeeAddress,
        phone: '',
        photo: '',
        photoURL: '',
        socialSecurityNumber: '',
        birthDate: '',
        documents: [],
        company: '',
        role: formData.position,
        title: formData.position,
        manager: '',
        managerId: '',
        professionalEmail: formData.email,
        skills: [],
        education: [],
        departmentId: formData.department,
        startDate: formData.hireDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDocument(COLLECTIONS.HR.EMPLOYEES, newEmployee);
      
      toast.success(`L'employé ${formData.firstName} ${formData.lastName} a été créé avec succès`);
      onCreated();
      onOpenChange(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        position: '',
        department: 'IT',
        status: 'active',
        hireDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'employé:", error);
      toast.error("Erreur lors de la création de l'employé");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel employé</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="position">Poste</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Département</Label>
            <Select 
              name="department" 
              value={formData.department} 
              onValueChange={(value) => handleSelectChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un département" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="HR">Ressources Humaines</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Ventes</SelectItem>
                <SelectItem value="Operations">Opérations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              name="status" 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="onLeave">En congé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hireDate">Date d'embauche</Label>
            <Input
              id="hireDate"
              name="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
