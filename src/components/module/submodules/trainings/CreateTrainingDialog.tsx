
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addTrainingDocument } from '@/hooks/firestore/create-operations';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';

export interface Training {
  id: string;
  title: string;
  description: string;
  instructor: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  type: string;
  employeeIds: string[];
  documentUrls?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSubmit: (training: Training) => void;
  employees: Employee[];
}

const CreateTrainingDialog: React.FC<CreateTrainingDialogProps> = ({
  open,
  onOpenChange,
  onClose,
  onSubmit,
  employees,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'planned' as const,
    type: 'technical',
    employeeIds: [] as string[],
  });

  const handleChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare training data
      const trainingData = {
        ...formData,
        createdAt: new Date().toISOString(),
      };

      // Add to Firestore
      const response = await addTrainingDocument(trainingData);
      
      // Pass the created training to parent component
      onSubmit({
        ...trainingData,
        id: response.id,
        documentUrls: [],
      } as Training);
      
      toast.success('Formation créée avec succès');
      
      // Reset form data
      setFormData({
        title: '',
        description: '',
        instructor: '',
        startDate: '',
        endDate: '',
        location: '',
        status: 'planned',
        type: 'technical',
        employeeIds: [],
      });
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating training:', error);
      toast.error('Erreur lors de la création de la formation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle formation</DialogTitle>
          <DialogDescription>
            Remplissez les détails pour créer une nouvelle formation.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la formation</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instructor">Formateur</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => handleChange('instructor', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type de formation</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technique</SelectItem>
                  <SelectItem value="soft_skills">Compétences douces</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="security">Sécurité</SelectItem>
                  <SelectItem value="onboarding">Intégration</SelectItem>
                  <SelectItem value="compliance">Conformité</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'planned' | 'in_progress' | 'completed' | 'cancelled') => 
                handleChange('status', value)
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planifiée</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="employees">Employés</Label>
            <Select 
              value={formData.employeeIds.length > 0 ? formData.employeeIds[0] : ''}
              onValueChange={(value) => handleChange('employeeIds', [value])}
            >
              <SelectTrigger id="employees">
                <SelectValue placeholder="Sélectionnez un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              *La sélection multiple sera disponible dans une future mise à jour
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Création...
                </>
              ) : (
                'Créer la formation'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTrainingDialog;
