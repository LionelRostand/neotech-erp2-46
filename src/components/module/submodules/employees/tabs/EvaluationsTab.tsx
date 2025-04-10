
import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Award, Star, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface Evaluation {
  id: string;
  employeeId: string;
  evaluatorId?: string;
  evaluatorName?: string;
  date: string;
  score?: number;
  maxScore?: number;
  status: 'Planifiée' | 'Complétée' | 'Annulée';
  comments?: string;
  goals?: string[];
  strengths?: string[];
  improvements?: string[];
}

interface EvaluationsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const EvaluationsTab: React.FC<EvaluationsTabProps> = ({ 
  employee, 
  isEditing, 
  onFinishEditing 
}) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, [employee.id]);

  const loadEvaluations = async () => {
    setIsLoading(true);
    try {
      // Récupération des évaluations depuis la collection hr_evaluations
      const evaluationsRef = collection(db, COLLECTIONS.HR.EVALUATIONS);
      const q = query(
        evaluationsRef, 
        where("employeeId", "==", employee.id),
        orderBy("date", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const evals: Evaluation[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        evals.push({
          id: doc.id,
          employeeId: data.employeeId,
          evaluatorId: data.evaluatorId,
          evaluatorName: data.evaluatorName || 'Non assigné',
          date: data.date,
          score: data.score,
          maxScore: data.maxScore || 100,
          status: data.status || 'Planifiée',
          comments: data.comments,
          goals: data.goals || [],
          strengths: data.strengths || [],
          improvements: data.improvements || []
        });
      });
      
      setEvaluations(evals);
    } catch (error) {
      console.error("Erreur lors du chargement des évaluations:", error);
      toast.error("Erreur lors du chargement des évaluations");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Complétée':
        return <Badge className="bg-green-100 text-green-800">Complétée</Badge>;
      case 'Annulée':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      case 'Planifiée':
      default:
        return <Badge className="bg-blue-100 text-blue-800">Planifiée</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      return dateStr;
    }
  };

  const calculateScorePercentage = (score?: number, maxScore?: number) => {
    if (!score || !maxScore) return 0;
    return Math.min(100, Math.round((score / maxScore) * 100));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Évaluations</CardTitle>
        <Button variant="outline" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Nouvelle évaluation
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : evaluations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune évaluation disponible</p>
            <p className="text-sm mt-1">Cliquez sur 'Nouvelle évaluation' pour commencer.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Évaluateur</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
                  <TableCell>{formatDate(evaluation.date)}</TableCell>
                  <TableCell>{evaluation.evaluatorName}</TableCell>
                  <TableCell>
                    {evaluation.score !== undefined && evaluation.status === 'Complétée' ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">
                            {evaluation.score}/{evaluation.maxScore}
                          </span>
                        </div>
                        <Progress 
                          value={calculateScorePercentage(evaluation.score, evaluation.maxScore)} 
                          className="h-2"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default EvaluationsTab;
