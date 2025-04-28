
import React, { useState } from 'react';
import { Employee, Evaluation } from '@/types/employee';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash } from 'lucide-react';

interface EvaluationsTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

const EvaluationsTabEdit: React.FC<EvaluationsTabEditProps> = ({ 
  employee, 
  onSave, 
  onCancel 
}) => {
  // Make sure evaluations is always an array
  const initialEvaluations = Array.isArray(employee.evaluations) ? employee.evaluations : [];

  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations);
  
  // State for new evaluation
  const [newEvaluation, setNewEvaluation] = useState<Evaluation>({
    id: `eval-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    title: '',
    rating: 3,
    comments: '',
    evaluator: '',
  });

  const handleEvaluationChange = (index: number, field: string, value: any) => {
    const updatedEvaluations = [...evaluations];
    updatedEvaluations[index] = {
      ...updatedEvaluations[index],
      [field]: value
    };
    setEvaluations(updatedEvaluations);
  };

  const handleNewEvaluationChange = (field: string, value: any) => {
    setNewEvaluation({
      ...newEvaluation,
      [field]: value
    });
  };

  const handleAddEvaluation = () => {
    if (newEvaluation.title && newEvaluation.evaluator) {
      setEvaluations([
        ...evaluations, 
        { ...newEvaluation, id: `eval-${Date.now()}` }
      ]);
      setNewEvaluation({
        id: `eval-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: '',
        rating: 3,
        comments: '',
        evaluator: '',
      });
    }
  };

  const handleDeleteEvaluation = (index: number) => {
    const updatedEvaluations = [...evaluations];
    updatedEvaluations.splice(index, 1);
    setEvaluations(updatedEvaluations);
  };

  const handleSubmit = () => {
    onSave({
      evaluations
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Évaluations</h3>
      
      {/* Liste des évaluations existantes */}
      {evaluations.length > 0 ? (
        <div className="space-y-6">
          {evaluations.map((evaluation, index) => (
            <div key={evaluation.id || index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Évaluation {index + 1}</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDeleteEvaluation(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input 
                    value={evaluation.title || ''} 
                    onChange={(e) => handleEvaluationChange(index, 'title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={evaluation.date?.split('T')[0] || ''} 
                    onChange={(e) => handleEvaluationChange(index, 'date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Evaluateur</Label>
                  <Input 
                    value={evaluation.evaluator || ''} 
                    onChange={(e) => handleEvaluationChange(index, 'evaluator', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Note (1-5)</Label>
                  <Select 
                    value={String(evaluation.rating || 3)} 
                    onValueChange={(value) => handleEvaluationChange(index, 'rating', Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Note" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Insuffisant</SelectItem>
                      <SelectItem value="2">2 - À améliorer</SelectItem>
                      <SelectItem value="3">3 - Satisfaisant</SelectItem>
                      <SelectItem value="4">4 - Très bien</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label>Commentaires</Label>
                  <Textarea 
                    value={evaluation.comments || ''} 
                    onChange={(e) => handleEvaluationChange(index, 'comments', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            Aucune évaluation n'a été enregistrée pour cet employé.
          </p>
        </div>
      )}
      
      {/* Formulaire pour ajouter une nouvelle évaluation */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium">Ajouter une évaluation</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Titre</Label>
            <Input 
              value={newEvaluation.title} 
              onChange={(e) => handleNewEvaluationChange('title', e.target.value)}
              placeholder="Entretien annuel"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Input 
              type="date" 
              value={newEvaluation.date?.split('T')[0]} 
              onChange={(e) => handleNewEvaluationChange('date', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Evaluateur</Label>
            <Input 
              value={newEvaluation.evaluator} 
              onChange={(e) => handleNewEvaluationChange('evaluator', e.target.value)}
              placeholder="Nom de l'évaluateur"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Note (1-5)</Label>
            <Select 
              value={String(newEvaluation.rating)} 
              onValueChange={(value) => handleNewEvaluationChange('rating', Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Insuffisant</SelectItem>
                <SelectItem value="2">2 - À améliorer</SelectItem>
                <SelectItem value="3">3 - Satisfaisant</SelectItem>
                <SelectItem value="4">4 - Très bien</SelectItem>
                <SelectItem value="5">5 - Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label>Commentaires</Label>
            <Textarea 
              value={newEvaluation.comments || ''} 
              onChange={(e) => handleNewEvaluationChange('comments', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="col-span-2 flex justify-end">
            <Button 
              onClick={handleAddEvaluation} 
              type="button"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter l'évaluation
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default EvaluationsTabEdit;
