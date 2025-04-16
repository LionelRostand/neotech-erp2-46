
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { addDocument } from '@/hooks/firestore/add-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    status: 'active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
      
      const now = new Date().toISOString();
      const employeeData = {
        ...formData,
        createdAt: now,
        updatedAt: now
      };
      
      await addDocument(COLLECTIONS.HR.EMPLOYEES, employeeData);
      
      toast.success('Employé créé avec succès');
      onCreated();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error("Erreur lors de la création de l'employé");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouvel employé</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="required">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName" className="required">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="required">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
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
          
          <div className="grid grid-cols-2 gap-4">
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
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="">Sélectionner...</option>
                <option value="IT">IT</option>
                <option value="HR">Ressources Humaines</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Ventes</option>
                <option value="Operations">Opérations</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-md border border-input bg-background"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
              <option value="onLeave">En congé</option>
              <option value="suspended">Suspendu</option>
            </select>
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Créer
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
