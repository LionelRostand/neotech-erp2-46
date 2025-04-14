
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Save, Link, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEvaluationsData, Evaluation as HookEvaluation } from '@/hooks/useEvaluationsData';

interface EvaluationsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ 
  employee, 
  isEditing = false, 
  onFinishEditing 
}) => {
  const navigate = useNavigate();
  const { evaluations: allEvaluations } = useEvaluationsData();
  const [employeeEvaluations, setEmployeeEvaluations] = useState<HookEvaluation[]>([]);
  const [localEvaluations, setLocalEvaluations] = useState<HookEvaluation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch employee evaluations from useEvaluationsData
  useEffect(() => {
    if (allEvaluations && allEvaluations.length > 0 && employee && employee.id) {
      const relevantEvaluations = allEvaluations.filter(ev => ev.employeeId === employee.id);
      setEmployeeEvaluations(relevantEvaluations);
    }
  }, [allEvaluations, employee]);
  
  // Initialize local evaluations from employee record
  useEffect(() => {
    if (employee.evaluations) {
      // Convert employee.evaluations to HookEvaluation type as needed
      const convertedEvaluations = employee.evaluations.map(evalItem => ({
        ...evalItem,
        employeeId: employee.id,
        id: evalItem.id || `emp-eval-${employee.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: evalItem.date || new Date().toISOString(),
        fromEmployeeRecord: true
      })) as HookEvaluation[];
      
      setLocalEvaluations(convertedEvaluations);
    } else {
      setLocalEvaluations([]);
    }
  }, [employee]);

  const handleSaveEvaluations = async () => {
    if (!employee.id) return;
    
    setIsSubmitting(true);
    try {
      await updateDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, {
        evaluations: localEvaluations
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

  // Navigate to evaluations module
  const handleViewAllEvaluations = () => {
    navigate('/modules/employees/evaluations');
  };

  // Function to get rating stars display
  const getRatingStars = (rating: number | undefined) => {
    if (rating === undefined) return '☆☆☆☆☆';
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    
    if (hasHalfStar) {
      stars += '☆';
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars += '☆';
    }
    
    return stars;
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Combine employee record evaluations with those from the evaluations collection
  const combinedEvaluations = [...employeeEvaluations];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Évaluations</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleViewAllEvaluations}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Voir toutes les évaluations
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {combinedEvaluations && combinedEvaluations.length > 0 ? (
          <div className="space-y-6">
            {combinedEvaluations.map((evaluation, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium">
                    {evaluation.title || 'Évaluation'}
                    {evaluation.fromEmployeeRecord && (
                      <span className="ml-2 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                        Local
                      </span>
                    )}
                  </h4>
                  <div className="text-yellow-500 text-lg">
                    {getRatingStars(evaluation.rating || evaluation.score)}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Date: {formatDate(evaluation.date)} • Évaluateur: {evaluation.evaluatorName || 'Non spécifié'}
                </p>
                {(evaluation.comments || evaluation.strengths || evaluation.improvements) && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Commentaires</h5>
                    <p className="text-sm mt-1">{evaluation.comments}</p>
                    
                    {evaluation.strengths && evaluation.strengths.length > 0 && (
                      <div className="mt-2">
                        <h6 className="text-xs font-medium text-green-700">Points forts</h6>
                        <ul className="list-disc list-inside text-sm">
                          {evaluation.strengths.map((strength, idx) => (
                            <li key={idx}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {evaluation.improvements && evaluation.improvements.length > 0 && (
                      <div className="mt-2">
                        <h6 className="text-xs font-medium text-amber-700">Axes d'amélioration</h6>
                        <ul className="list-disc list-inside text-sm">
                          {evaluation.improvements.map((improvement, idx) => (
                            <li key={idx}>{improvement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Aucune évaluation enregistrée
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
  );
};

export default EvaluationsTab;
