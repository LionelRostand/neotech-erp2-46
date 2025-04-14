
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Training } from '@/hooks/useTrainingsData';
import { Employee } from '@/types/employee';
import { addTrainingDocument } from '@/hooks/firestore/firestore-utils';

export interface CreateTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onSubmit: (training: Partial<Training>) => void;
  employees: Employee[];
}

const CreateTrainingDialog: React.FC<CreateTrainingDialogProps> = ({
  open,
  onOpenChange,
  onClose,
  onSubmit,
  employees
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Training>>({
    title: '',
    description: '',
    employeeId: '',
    type: 'Formation professionnelle',
    status: 'Planifiée',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    provider: '',
    location: '',
    cost: 0,
    skills: [],
    certificate: false
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.employeeId || !formData.startDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Add training to Firestore
      await addTrainingDocument({
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      toast.success('Formation ajoutée avec succès');
      onSubmit(formData);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la formation:', error);
      toast.error('Erreur lors de l\'ajout de la formation');
    } finally {
      setIsSubmitting(false);
      setFormData({
        title: '',
        description: '',
        employeeId: '',
        type: 'Formation professionnelle',
        status: 'Planifiée',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        provider: '',
        location: '',
        cost: 0,
        skills: [],
        certificate: false
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle formation</DialogTitle>
          <DialogDescription>
            Remplissez les détails de la formation. Les champs marqués d'un * sont obligatoires.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la formation *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employé *</Label>
                <Select 
                  value={formData.employeeId} 
                  onValueChange={(value) => handleChange('employeeId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de formation</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formation professionnelle">Formation professionnelle</SelectItem>
                    <SelectItem value="Formation interne">Formation interne</SelectItem>
                    <SelectItem value="Formation continue">Formation continue</SelectItem>
                    <SelectItem value="Certification">Certification</SelectItem>
                    <SelectItem value="Conférence">Conférence</SelectItem>
                    <SelectItem value="Séminaire">Séminaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleChange('status', value as Training['status'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planifiée">Planifiée</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Terminée">Terminée</SelectItem>
                    <SelectItem value="Annulée">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début *</Label>
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
                  value={formData.endDate || ''}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Organisme de formation</Label>
                <Input
                  id="provider"
                  value={formData.provider || ''}
                  onChange={(e) => handleChange('provider', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Coût (€)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost || 0}
                  onChange={(e) => handleChange('cost', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2 flex items-end pb-2">
                <Label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5"
                    checked={formData.certificate || false}
                    onChange={(e) => handleChange('certificate', e.target.checked)}
                  />
                  <span>Certification incluse</span>
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">◌</span>
                  Création...
                </>
              ) : (
                'Créer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTrainingDialog;
