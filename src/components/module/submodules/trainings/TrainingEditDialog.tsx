
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Calendar } from 'lucide-react';
import { Training } from '@/hooks/useTrainingsData';
import { format } from 'date-fns';

interface TrainingEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training: Training | null;
  onSuccess?: () => void;
}

const TrainingEditDialog: React.FC<TrainingEditDialogProps> = ({
  open,
  onOpenChange,
  training,
  onSuccess
}) => {
  const { employees } = useHrModuleData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    employeeId: '',
    title: '',
    type: '',
    description: '',
    provider: '',
    location: '',
    startDate: '',
    endDate: '',
    duration: '',
    status: '',
    cost: '',
    certificate: 'false',
  });

  useEffect(() => {
    if (training) {
      setFormData({
        employeeId: training.employeeId || '',
        title: training.title || '',
        type: training.type || 'Formation professionnelle',
        description: training.description || '',
        provider: training.provider || '',
        location: training.location || '',
        startDate: formatDateForInput(training.startDate) || format(new Date(), 'yyyy-MM-dd'),
        endDate: training.endDate ? formatDateForInput(training.endDate) : '',
        duration: training.duration ? String(training.duration) : '1',
        status: training.status || 'Planifiée',
        cost: training.cost ? String(training.cost) : '',
        certificate: training.certificate ? 'true' : 'false',
      });
    }
  }, [training]);

  const formatDateForInput = (dateStr: string) => {
    try {
      // Convert from French format (DD/MM/YYYY) to ISO format (YYYY-MM-DD)
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      // If it's already in a valid format, return as is
      return dateStr;
    } catch (error) {
      console.error('Date formatting error:', error);
      return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.title || !formData.startDate) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Simulate an API call to update the training
    console.log('Updating training:', formData);
    
    toast({
      title: "Formation mise à jour",
      description: "Les informations de la formation ont été mises à jour avec succès."
    });
    
    if (onSuccess) {
      onSuccess();
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Modifier la formation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Employé *</Label>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => handleSelectChange('employeeId', value)}
              required
            >
              <SelectTrigger id="employeeId">
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
          
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la formation *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Titre de la formation"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type de formation</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formation professionnelle">Formation professionnelle</SelectItem>
                <SelectItem value="Formation réglementaire">Formation réglementaire</SelectItem>
                <SelectItem value="Formation en ligne">Formation en ligne</SelectItem>
                <SelectItem value="Séminaire">Séminaire</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Conférence">Conférence</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <div className="relative">
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <div className="relative">
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (jours)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                min={1}
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
              <Label htmlFor="provider">Prestataire</Label>
              <Input
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                placeholder="Nom du prestataire"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Lieu de la formation"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Coût (€)</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                min={0}
                step={0.01}
                placeholder="0.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certificate">Certification</Label>
              <Select
                value={formData.certificate}
                onValueChange={(value) => handleSelectChange('certificate', value)}
              >
                <SelectTrigger id="certificate">
                  <SelectValue placeholder="Certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Oui</SelectItem>
                  <SelectItem value="false">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Description de la formation..."
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer les modifications</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingEditDialog;
