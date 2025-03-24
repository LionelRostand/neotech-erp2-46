
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Check, CalendarClock, PlusCircle, StarIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Evaluation {
  id: string;
  date: string;
  type: string;
  reviewer: string;
  overallRating: number;
  skills: { name: string; rating: number; comment?: string }[];
  strengths: string[];
  areasToImprove: string[];
  goals: string[];
  comments: string;
}

interface EvaluationsTabProps {
  employee: Employee;
  isEditing: boolean;
  onFinishEditing: () => void;
}

// Données d'exemple
const INITIAL_EVALUATIONS: Evaluation[] = [
  {
    id: '1',
    date: '15/12/2024',
    type: 'Évaluation annuelle',
    reviewer: 'Sophie Martin',
    overallRating: 4,
    skills: [
      { name: 'Compétences techniques', rating: 4, comment: 'Excellente maîtrise des outils' },
      { name: 'Communication', rating: 3, comment: 'Communication claire mais peut être améliorée' },
      { name: 'Travail d\'équipe', rating: 5, comment: 'Collabore très bien avec ses collègues' },
      { name: 'Résolution de problèmes', rating: 4, comment: 'Trouve des solutions efficaces' },
    ],
    strengths: [
      'Grande capacité d\'adaptation',
      'Autonomie dans les tâches',
      'Bonne gestion du stress'
    ],
    areasToImprove: [
      'Communication écrite',
      'Gestion du temps'
    ],
    goals: [
      'Formation en leadership',
      'Amélioration des compétences en présentation'
    ],
    comments: 'Très bon élément dans l\'équipe, continue à progresser.'
  }
];

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ 
  employee, 
  isEditing,
  onFinishEditing
}) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(INITIAL_EVALUATIONS);
  const [activeTab, setActiveTab] = useState('overview');
  const [newEvaluation, setNewEvaluation] = useState<Partial<Evaluation>>({
    date: new Date().toLocaleDateString('fr-FR'),
    type: 'Évaluation annuelle',
    reviewer: '',
    overallRating: 3,
    skills: [
      { name: 'Compétences techniques', rating: 3 },
      { name: 'Communication', rating: 3 },
      { name: 'Travail d\'équipe', rating: 3 },
      { name: 'Résolution de problèmes', rating: 3 },
    ],
    strengths: [''],
    areasToImprove: [''],
    goals: [''],
    comments: ''
  });

  const handleSaveEvaluation = () => {
    // Validation basique
    if (!newEvaluation.reviewer || !newEvaluation.comments) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const evaluation: Evaluation = {
      id: `${evaluations.length + 1}`,
      date: newEvaluation.date || new Date().toLocaleDateString('fr-FR'),
      type: newEvaluation.type || 'Évaluation annuelle',
      reviewer: newEvaluation.reviewer || '',
      overallRating: newEvaluation.overallRating || 3,
      skills: newEvaluation.skills || [],
      strengths: newEvaluation.strengths?.filter(s => s.trim() !== '') || [],
      areasToImprove: newEvaluation.areasToImprove?.filter(a => a.trim() !== '') || [],
      goals: newEvaluation.goals?.filter(g => g.trim() !== '') || [],
      comments: newEvaluation.comments || ''
    };

    setEvaluations([...evaluations, evaluation]);
    toast.success("Évaluation enregistrée avec succès");
    onFinishEditing();
    setActiveTab('overview');
  };

  const updateSkillRating = (index: number, rating: number) => {
    if (!newEvaluation.skills) return;
    
    const updatedSkills = [...newEvaluation.skills];
    updatedSkills[index] = { ...updatedSkills[index], rating };
    
    setNewEvaluation({
      ...newEvaluation,
      skills: updatedSkills
    });
  };

  const updateSkillComment = (index: number, comment: string) => {
    if (!newEvaluation.skills) return;
    
    const updatedSkills = [...newEvaluation.skills];
    updatedSkills[index] = { ...updatedSkills[index], comment };
    
    setNewEvaluation({
      ...newEvaluation,
      skills: updatedSkills
    });
  };

  const updateArrayField = (field: 'strengths' | 'areasToImprove' | 'goals', index: number, value: string) => {
    if (!newEvaluation[field]) return;
    
    const updatedArray = [...(newEvaluation[field] as string[])];
    updatedArray[index] = value;
    
    setNewEvaluation({
      ...newEvaluation,
      [field]: updatedArray
    });
  };

  const addArrayItem = (field: 'strengths' | 'areasToImprove' | 'goals') => {
    if (!newEvaluation[field]) return;
    
    setNewEvaluation({
      ...newEvaluation,
      [field]: [...(newEvaluation[field] as string[]), '']
    });
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <StarIcon 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Évaluations</CardTitle>
        {!isEditing && (
          <Button onClick={() => onFinishEditing()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle évaluation
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type d'évaluation</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newEvaluation.type}
                  onChange={e => setNewEvaluation({...newEvaluation, type: e.target.value})}
                >
                  <option value="Évaluation annuelle">Évaluation annuelle</option>
                  <option value="Évaluation de fin de période d'essai">Fin de période d'essai</option>
                  <option value="Entretien professionnel">Entretien professionnel</option>
                  <option value="Évaluation de performance">Évaluation de performance</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Évaluateur</label>
                <Input 
                  placeholder="Nom de l'évaluateur" 
                  value={newEvaluation.reviewer}
                  onChange={e => setNewEvaluation({...newEvaluation, reviewer: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium">Évaluation des compétences</label>
              {newEvaluation.skills?.map((skill, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="font-medium mb-2">{skill.name}</div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-500 mr-3">Note:</span>
                    <div className="flex-1 px-4">
                      <Slider 
                        value={[skill.rating]} 
                        min={1} 
                        max={5} 
                        step={1}
                        onValueChange={values => updateSkillRating(index, values[0])}
                      />
                    </div>
                    <div className="flex">
                      {renderStars(skill.rating)}
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-sm text-gray-500">Commentaire:</label>
                    <Textarea 
                      placeholder="Commentaire sur cette compétence"
                      value={skill.comment || ''}
                      onChange={e => updateSkillComment(index, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Points forts</label>
              {newEvaluation.strengths?.map((strength, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    placeholder="Point fort" 
                    value={strength}
                    onChange={e => updateArrayField('strengths', index, e.target.value)}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addArrayItem('strengths')}>
                Ajouter un point fort
              </Button>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Points à améliorer</label>
              {newEvaluation.areasToImprove?.map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    placeholder="Point à améliorer" 
                    value={area}
                    onChange={e => updateArrayField('areasToImprove', index, e.target.value)}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addArrayItem('areasToImprove')}>
                Ajouter un point à améliorer
              </Button>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Objectifs</label>
              {newEvaluation.goals?.map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    placeholder="Objectif" 
                    value={goal}
                    onChange={e => updateArrayField('goals', index, e.target.value)}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addArrayItem('goals')}>
                Ajouter un objectif
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Commentaires généraux</label>
              <Textarea 
                placeholder="Commentaires généraux sur l'évaluation"
                value={newEvaluation.comments}
                onChange={e => setNewEvaluation({...newEvaluation, comments: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-3">
              <Button variant="outline" onClick={onFinishEditing}>Annuler</Button>
              <Button onClick={handleSaveEvaluation}>Enregistrer l'évaluation</Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Résumé</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="skills">Compétences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              {evaluations.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium text-lg">
                          {evaluations[0].type}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarClock className="h-4 w-4 mr-1" />
                          {evaluations[0].date} par {evaluations[0].reviewer}
                        </div>
                      </div>
                      <div className="flex">
                        {renderStars(evaluations[0].overallRating)}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Points forts</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {evaluations[0].strengths.map((strength, i) => (
                            <li key={i} className="text-sm">{strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Points à améliorer</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {evaluations[0].areasToImprove.map((area, i) => (
                            <li key={i} className="text-sm">{area}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Objectifs</h4>
                        <ul className="pl-5 space-y-1">
                          {evaluations[0].goals.map((goal, i) => (
                            <li key={i} className="text-sm flex items-start">
                              <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Commentaires</h4>
                        <p className="text-sm text-gray-700">
                          {evaluations[0].comments}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>Aucune évaluation disponible</p>
                  <p className="text-sm mt-2">Créez une nouvelle évaluation pour commencer</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4">
                {evaluations.length > 0 ? (
                  evaluations.map((evaluation) => (
                    <div key={evaluation.id} className="p-4 border rounded-md flex justify-between items-center">
                      <div>
                        <div className="font-medium">{evaluation.type}</div>
                        <div className="text-sm text-gray-500">
                          {evaluation.date} par {evaluation.reviewer}
                        </div>
                      </div>
                      <div className="flex">
                        {renderStars(evaluation.overallRating)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    Aucune évaluation enregistrée
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="skills">
              {evaluations.length > 0 ? (
                <div className="space-y-4">
                  {evaluations[0].skills.map((skill, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{skill.name}</div>
                        <div className="flex">
                          {renderStars(skill.rating)}
                        </div>
                      </div>
                      {skill.comment && (
                        <p className="text-sm text-gray-600">{skill.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  Aucune évaluation de compétences disponible
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default EvaluationsTab;
