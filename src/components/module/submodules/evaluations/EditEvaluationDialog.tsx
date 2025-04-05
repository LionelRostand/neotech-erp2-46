
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
import { toast } from 'sonner';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Evaluation } from '@/hooks/useEvaluationsData';

interface EditEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: Evaluation;
  onSubmit: (data: any) => void;
}

const EditEvaluationDialog: React.FC<EditEvaluationDialogProps> = ({
  open,
  onOpenChange,
  evaluation,
  onSubmit,
}) => {
  const { employees } = useHrModuleData();
  const [formData, setFormData] = useState({
    employeeId: '',
    evaluatorId: '',
    date: '',
    status: 'Planifiée',
    maxScore: 100,
    score: 0,
    comments: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser le formulaire avec les données de l'évaluation existante
  useEffect(() => {
    if (evaluation) {
      try {
        // Formatage de la date pour l'input type=date
        const dateObj = new Date(evaluation.date);
        const formattedDate = isNaN(dateObj.getTime()) 
          ? format(new Date(), 'yyyy-MM-dd')
          : format(dateObj, 'yyyy-MM-dd');

        setFormData({
          employeeId: evaluation.employeeId || '',
          evaluatorId: evaluation.evaluatorId || '',
          date: formattedDate,
          status: evaluation.status,
          maxScore: evaluation.maxScore || 100,
          score: evaluation.score || 0,
          comments: evaluation.comments || '',
        });
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du formulaire:', error);
      }
    }
  }, [evaluation]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.evaluatorId || !formData.date) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convertir la date au format ISO pour le stockage
      const evaluationData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        maxScore: Number(formData.maxScore),
        score: Number(formData.score),
        updatedAt: new Date().toISOString(),
      };
      
      await onSubmit(evaluationData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'évaluation:', error);
      toast.error('Une erreur est survenue lors de la mise à jour de l\'évaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Modifier l'évaluation</DialogTitle>
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
          
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="score">Score obtenu</Label>
              <Input
                id="score"
                name="score"
                type="number"
                value={formData.score}
                onChange={handleChange}
                min={0}
                max={formData.maxScore}
              />
            </div>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour en cours..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEvaluationDialog;
