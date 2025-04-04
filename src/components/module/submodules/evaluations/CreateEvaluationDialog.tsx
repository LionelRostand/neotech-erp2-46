
import React, { useState } from 'react';
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
import { toast } from 'sonner';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CreateEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateEvaluationDialog: React.FC<CreateEvaluationDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { employees } = useHrModuleData();
  const [formData, setFormData] = useState({
    employeeId: '',
    evaluatorId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Planifiée',
    maxScore: 100,
    comments: '',
  });

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
    
    if (!formData.employeeId || !formData.evaluatorId || !formData.date) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Ici, on simulerait l'ajout à Firebase
    console.log('Creating evaluation:', formData);
    
    toast.success('Évaluation créée avec succès');
    onOpenChange(false);
    
    // Réinitialisation du formulaire
    setFormData({
      employeeId: '',
      evaluatorId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      status: 'Planifiée',
      maxScore: 100,
      comments: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle évaluation</DialogTitle>
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
            <Label htmlFor="evaluatorId">Évaluateur *</Label>
            <Select
              value={formData.evaluatorId}
              onValueChange={(value) => handleSelectChange('evaluatorId', value)}
              required
            >
              <SelectTrigger id="evaluatorId">
                <SelectValue placeholder="Sélectionner un évaluateur" />
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
            <Label htmlFor="date">Date d'évaluation *</Label>
            <div className="relative">
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
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
                <SelectItem value="Complétée">Complétée</SelectItem>
                <SelectItem value="Annulée">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxScore">Score maximum</Label>
            <Input
              id="maxScore"
              name="maxScore"
              type="number"
              value={formData.maxScore}
              onChange={handleChange}
              min={1}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments">Commentaires</Label>
            <Textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows={3}
              placeholder="Saisissez vos commentaires..."
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer l'évaluation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvaluationDialog;
