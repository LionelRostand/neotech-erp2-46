
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Star, Save, Plus, Calendar, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface Evaluation {
  id: string;
  date: string;
  title: string;
  rating: number;
  comments: string;
  evaluator?: string;
}

interface EvaluationsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee, isEditing = false, onFinishEditing }) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(employee.evaluations || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEvaluation, setNewEvaluation] = useState<Partial<Evaluation>>({
    rating: 3,
    title: '',
    comments: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // Mettre à jour les évaluations avec les données de l'employé
    setEvaluations(employee.evaluations || []);
  }, [employee]);

  const handleSaveEvaluations = async () => {
    if (!employee.id) return;
    
    setIsSubmitting(true);
    try {
      await updateDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, {
        evaluations
      });
      
      toast.success('Évaluations mises à jour avec succès');
      if (onFinishEditing) {
        onFinishEditing();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des évaluations:', error);
      toast.error('Erreur lors de la mise à jour des évaluations');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEvaluation = () => {
    if (!selectedDate || !newEvaluation.title || !newEvaluation.comments) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newEval: Evaluation = {
      id: `eval-${Date.now()}`,
      date: format(selectedDate, 'yyyy-MM-dd'),
      title: newEvaluation.title || '',
      rating: newEvaluation.rating || 3,
      comments: newEvaluation.comments || '',
      evaluator: newEvaluation.evaluator
    };

    setEvaluations([...evaluations, newEval]);
    
    // Réinitialiser le formulaire
    setNewEvaluation({
      rating: 3,
      title: '',
      comments: ''
    });
    setSelectedDate(undefined);
    
    toast.success('Évaluation ajoutée');
  };

  const handleRemoveEvaluation = (id: string) => {
    setEvaluations(evaluations.filter(eval => eval.id !== id));
    toast.success('Évaluation supprimée');
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      return dateStr;
    }
  };

  // Générer des étoiles pour l'affichage de la note
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 inline ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Évaluations de l'employé</CardTitle>
          <CardDescription>
            Historique des évaluations professionnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {evaluations.length > 0 ? (
            <div className="space-y-6">
              {evaluations.map((evaluation) => (
                <Card key={evaluation.id} className="relative">
                  {isEditing && (
                    <button
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveEvaluation(evaluation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">{evaluation.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(evaluation.date)}
                      </div>
                    </div>
                    <div className="mb-2">
                      {renderStars(evaluation.rating)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{evaluation.comments}</p>
                    {evaluation.evaluator && (
                      <div className="text-xs text-right text-muted-foreground">
                        Par: {evaluation.evaluator}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-muted-foreground">
              Aucune évaluation n'a été enregistrée pour cet employé.
            </p>
          )}
          
          {isEditing && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-4">Ajouter une évaluation</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eval-title">Titre de l'évaluation</Label>
                  <Input
                    id="eval-title"
                    value={newEvaluation.title || ''}
                    onChange={(e) => setNewEvaluation({...newEvaluation, title: e.target.value})}
                    placeholder="Ex: Évaluation annuelle, Revue de performance, etc."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date de l'évaluation</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : "Sélectionner une date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="eval-rating">Note (1-5)</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="eval-rating"
                        type="range"
                        min="1"
                        max="5"
                        value={newEvaluation.rating || 3}
                        onChange={(e) => setNewEvaluation({...newEvaluation, rating: parseInt(e.target.value)})}
                        className="w-full"
                      />
                      <span>{newEvaluation.rating || 3}/5</span>
                    </div>
                    <div className="mt-1">
                      {renderStars(newEvaluation.rating || 3)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eval-comments">Commentaires</Label>
                  <Textarea
                    id="eval-comments"
                    value={newEvaluation.comments || ''}
                    onChange={(e) => setNewEvaluation({...newEvaluation, comments: e.target.value})}
                    placeholder="Détails de l'évaluation..."
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="eval-evaluator">Évaluateur (optionnel)</Label>
                  <Input
                    id="eval-evaluator"
                    value={newEvaluation.evaluator || ''}
                    onChange={(e) => setNewEvaluation({...newEvaluation, evaluator: e.target.value})}
                    placeholder="Nom de l'évaluateur"
                  />
                </div>
                
                <Button onClick={handleAddEvaluation} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter l'évaluation
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        {isEditing && (
          <CardFooter className="border-t px-6 py-4 bg-muted/20">
            <div className="ml-auto flex gap-2">
              <Button 
                variant="outline" 
                onClick={onFinishEditing}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSaveEvaluations}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default EvaluationsTab;
