
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Employee, Evaluation } from '@/types/employee';
import { Plus, X } from 'lucide-react';

interface EvaluationsTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

const EvaluationsTabEdit: React.FC<EvaluationsTabEditProps> = ({ employee, onSave, onCancel }) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(employee.evaluations || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvaluation, setNewEvaluation] = useState<Partial<Evaluation>>({
    date: new Date().toISOString().split('T')[0],
    type: 'performance',
    score: '3',
    evaluator: '',
    comments: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvaluation(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewEvaluation(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvaluation = () => {
    if (newEvaluation.evaluator && newEvaluation.date) {
      const evaluation: Evaluation = {
        id: Date.now().toString(),
        date: newEvaluation.date,
        type: newEvaluation.type as 'performance' | 'skills' | 'objectives',
        score: newEvaluation.score || '3',
        evaluator: newEvaluation.evaluator,
        comments: newEvaluation.comments || ''
      };
      
      setEvaluations([...evaluations, evaluation]);
      setNewEvaluation({
        date: new Date().toISOString().split('T')[0],
        type: 'performance',
        score: '3',
        evaluator: '',
        comments: ''
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveEvaluation = (id: string) => {
    setEvaluations(evaluations.filter(ev => ev.id !== id));
  };

  const handleSave = () => {
    onSave({ evaluations });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Évaluations</h3>
          {!showAddForm && (
            <Button type="button" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Nouvelle évaluation
            </Button>
          )}
        </div>
        
        {evaluations.length === 0 && !showAddForm ? (
          <p className="text-gray-500">Aucune évaluation enregistrée</p>
        ) : (
          <div className="space-y-4">
            {evaluations.map(ev => (
              <div key={ev.id} className="border rounded-md p-3 relative">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveEvaluation(ev.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <span className="text-sm text-gray-500">Date :</span>
                    <p>{new Date(ev.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Type :</span>
                    <p>{ev.type === 'performance' ? 'Performance' : 
                       ev.type === 'skills' ? 'Compétences' : 'Objectifs'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Évaluateur :</span>
                    <p>{ev.evaluator}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Note :</span>
                    <p>{ev.score}/5</p>
                  </div>
                </div>
                {ev.comments && (
                  <div>
                    <span className="text-sm text-gray-500">Commentaires :</span>
                    <p className="text-sm">{ev.comments}</p>
                  </div>
                )}
              </div>
            ))}

            {showAddForm && (
              <div className="border rounded-md p-4 space-y-4">
                <h4 className="font-medium">Nouvelle évaluation</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      name="date"
                      type="date"
                      value={newEvaluation.date} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'évaluation</Label>
                    <Select 
                      value={newEvaluation.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="skills">Compétences</SelectItem>
                        <SelectItem value="objectives">Objectifs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evaluator">Évaluateur</Label>
                    <Input 
                      id="evaluator" 
                      name="evaluator"
                      value={newEvaluation.evaluator} 
                      onChange={handleInputChange} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="score">Note (1-5)</Label>
                    <Select 
                      value={newEvaluation.score} 
                      onValueChange={(value) => handleSelectChange('score', value)}
                    >
                      <SelectTrigger id="score">
                        <SelectValue placeholder="Choisir une note" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - À améliorer</SelectItem>
                        <SelectItem value="2">2 - Passable</SelectItem>
                        <SelectItem value="3">3 - Satisfaisant</SelectItem>
                        <SelectItem value="4">4 - Très bon</SelectItem>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Commentaires</Label>
                  <Textarea 
                    id="comments" 
                    name="comments"
                    value={newEvaluation.comments} 
                    onChange={handleInputChange} 
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="button" onClick={handleAddEvaluation}>
                    Ajouter
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" onClick={handleSave}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default EvaluationsTabEdit;
