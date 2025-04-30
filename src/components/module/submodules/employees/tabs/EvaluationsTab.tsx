
import React from 'react';
import { Employee, Evaluation } from '@/types/employee';
import { BarChart, Calendar, Star, Info, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '../utils/employeeUtils';

interface EvaluationsTabProps {
  employee: Employee;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ employee }) => {
  // Utiliser les évaluations de l'employé ou des données factices si non disponibles
  const evaluations = employee.evaluations || [
    {
      id: "1",
      date: new Date(Date.now() - 86400000 * 90).toISOString(),
      type: "performance",
      score: "4/5",
      evaluator: "Jean Dupont",
      comments: "Très bon travail, continue comme ça !"
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000 * 180).toISOString(),
      type: "objectives",
      score: "3.5/5",
      evaluator: "Marie Martin",
      comments: "Objectifs atteints, mais quelques points à améliorer sur la communication."
    }
  ];
  
  // Fonction pour afficher le type d'évaluation
  const getEvaluationType = (type: string): string => {
    switch(type) {
      case 'performance':
        return 'Évaluation de performance';
      case 'skills':
        return 'Évaluation des compétences';
      case 'objectives':
        return 'Évaluation des objectifs';
      default:
        return type;
    }
  };
  
  // Fonction pour afficher l'icône selon le type d'évaluation
  const getEvaluationIcon = (type: string) => {
    switch(type) {
      case 'performance':
        return <BarChart className="h-5 w-5 text-blue-600" />;
      case 'skills':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'objectives':
        return <Info className="h-5 w-5 text-green-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Évaluations</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle évaluation
        </Button>
      </div>
      
      <div className="space-y-4">
        {evaluations.length > 0 ? (
          evaluations.map((evaluation) => (
            <div 
              key={evaluation.id} 
              className="border p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-md">
                    {getEvaluationIcon(evaluation.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{getEvaluationType(evaluation.type)}</h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(evaluation.date)} • Par {evaluation.evaluator}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {evaluation.score}
                </div>
              </div>
              
              {evaluation.comments && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  <p className="font-medium mb-1">Commentaires:</p>
                  <p>{evaluation.comments}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-center border border-dashed rounded-md">
            <BarChart className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-medium">Aucune évaluation</h3>
            <p className="text-gray-500 mt-1">
              Aucune évaluation n'a été ajoutée pour cet employé
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationsTab;
