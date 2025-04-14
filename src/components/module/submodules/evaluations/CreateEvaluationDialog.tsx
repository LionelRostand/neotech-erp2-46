
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/create-operations'; // Changed from add-operations to create-operations
import { COLLECTIONS } from '@/lib/firebase-collections';

const CreateEvaluationDialog = ({ open, onOpenChange, onSuccess }) => {
  const { employees } = useHrModuleData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('Planifiée');
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setTitle('');
    setSelectedEmployeeId('');
    setSelectedEvaluatorId('');
    setDate(new Date().toISOString().split('T')[0]);
    setStatus('Planifiée');
    setRating('');
    setComments('');
    setStrengths('');
    setImprovements('');
  };

  const handleCreate = async () => {
    if (!selectedEmployeeId) {
      toast.error('Veuillez sélectionner un employé');
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert strengths and improvements from string to array
      const strengthsArray = strengths.split('\n').map(item => item.trim()).filter(item => item !== '');
      const improvementsArray = improvements.split('\n').map(item => item.trim()).filter(item => item !== '');

      // Create the evaluation object
      const evaluationData = {
        title,
        employeeId: selectedEmployeeId,
        evaluatorId: selectedEvaluatorId || null,
        date,
        status,
        rating: rating !== '' ? Number(rating) : null,
        comments,
        strengths: strengthsArray,
        improvements: improvementsArray,
        createdAt: new Date().toISOString()
      };

      // Add to Firestore
      await addDocument(COLLECTIONS.HR.EVALUATIONS, evaluationData);
      toast.success('L\'évaluation a été créée avec succès');
      
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluation:', error);
      toast.error('Erreur lors de la création de l\'évaluation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle évaluation</DialogTitle>
          <DialogDescription>
            Remplissez les informations de l'évaluation ci-dessous
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employé</Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="evaluator">Évaluateur</Label>
              <Select value={selectedEvaluatorId} onValueChange={setSelectedEvaluatorId}>
                <SelectTrigger id="evaluator">
                  <SelectValue placeholder="Sélectionner un évaluateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non assigné</SelectItem>
                  {employees?.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input 
                id="title" 
                placeholder="Titre de l'évaluation" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={status} 
                onValueChange={(val) => setStatus(val)}
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
              <Label htmlFor="rating">Note (1-5)</Label>
              <Input 
                id="rating" 
                type="number" 
                min="1" 
                max="5" 
                step="0.5" 
                placeholder="Note sur 5" 
                value={rating} 
                onChange={(e) => setRating(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comments">Commentaires</Label>
            <Textarea 
              id="comments" 
              placeholder="Commentaires généraux sur l'évaluation" 
              value={comments} 
              onChange={(e) => setComments(e.target.value)} 
              rows={3} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="strengths">Points forts (un par ligne)</Label>
            <Textarea 
              id="strengths" 
              placeholder="Listez les points forts (un par ligne)" 
              value={strengths} 
              onChange={(e) => setStrengths(e.target.value)} 
              rows={3} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="improvements">Axes d'amélioration (un par ligne)</Label>
            <Textarea 
              id="improvements" 
              placeholder="Listez les axes d'amélioration (un par ligne)" 
              value={improvements} 
              onChange={(e) => setImprovements(e.target.value)} 
              rows={3} 
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Création en cours...' : 'Créer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvaluationDialog;
