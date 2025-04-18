import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecruitmentPost, CandidateApplication } from '@/types/recruitment';
import { Check, X } from 'lucide-react';

interface KanbanCardProps {
  item: RecruitmentPost;
  type: string;
}

export default function KanbanCard({ item }: KanbanCardProps) {
  const handleTechnicalInterviewResult = async (candidateId: string, passed: boolean) => {
    const candidate = item.candidates?.find(c => c.id === candidateId);
    if (!candidate) return;

    candidate.technicalInterviewStatus = passed ? 'passed' : 'failed';
    // Si l'entretien technique est échoué, on arrête le processus
    if (!passed) {
      candidate.currentStage = 'Fermée';
      item.status = 'Fermée';
    }
    // Si les deux entretiens sont validés, on passe à l'étape Offre
    else if (candidate.normalInterviewStatus === 'passed' && candidate.technicalInterviewStatus === 'passed') {
      candidate.currentStage = 'Offre';
      item.status = 'Offre';
    }
  };

  const handleNormalInterviewResult = async (candidateId: string, passed: boolean) => {
    const candidate = item.candidates?.find(c => c.id === candidateId);
    if (!candidate) return;

    candidate.normalInterviewStatus = passed ? 'passed' : 'failed';
    
    // Si l'entretien normal est échoué, on passe directement à Fermée
    if (!passed) {
      candidate.currentStage = 'Fermée';
      item.status = 'Fermée';
      candidate.status = 'rejected';
    }
    // Si l'entretien normal est validé et qu'il n'y a pas d'entretien technique,
    // on passe directement à l'étape Offre
    else {
      candidate.currentStage = 'Offre';
      item.status = 'Offre';
    }
  };

  const handleSalaryProposal = async (candidateId: string, salary: number) => {
    const candidate = item.candidates?.find(c => c.id === candidateId);
    if (!candidate) return;

    candidate.proposedSalary = salary;
    candidate.offerStatus = 'pending';
    // Simulons une réponse positive du candidat
    const accepted = true; // Dans un cas réel, cela viendrait de l'interaction avec le candidat
    
    if (accepted) {
      candidate.offerStatus = 'accepted';
      candidate.currentStage = 'Fermée';
      item.status = 'Fermée';
      
      // Création de l'employé
      const newEmployee = {
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        phone: candidate.phone || '',
        position: item.position,
        department: item.department,
        startDate: new Date().toISOString(),
        salary: candidate.proposedSalary,
        status: 'active'
      };
      
      // Ici, vous devriez avoir une fonction pour ajouter l'employé dans la base de données
      console.log('Nouvel employé créé:', newEmployee);
    } else {
      candidate.offerStatus = 'rejected';
      candidate.currentStage = 'Fermée';
      item.status = 'Fermée';
    }
  };

  return (
    <Card className="p-4 mb-2 bg-white">
      <h3 className="font-semibold mb-2">{item.position}</h3>
      <div className="text-sm text-gray-500 mb-2">{item.department}</div>
      
      {item.candidates && item.candidates.map((candidate) => (
        <div key={candidate.id} className="mt-4 border-t pt-2">
          <div className="font-medium">{candidate.firstName} {candidate.lastName}</div>
          <div className="text-sm text-gray-500">{candidate.email}</div>
          
          {item.status === 'Entretiens' && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span>Entretien normal:</span>
                {candidate.normalInterviewStatus === 'pending' ? (
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleNormalInterviewResult(candidate.id, true)}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleNormalInterviewResult(candidate.id, false)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <span className={candidate.normalInterviewStatus === 'passed' ? 'text-green-500' : 'text-red-500'}>
                    {candidate.normalInterviewStatus === 'passed' ? 'OK' : 'KO'}
                  </span>
                )}
              </div>
              
              {candidate.normalInterviewStatus === 'passed' && (
                <div className="flex items-center justify-between">
                  <span>Entretien technique:</span>
                  {candidate.technicalInterviewStatus === 'pending' ? (
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleTechnicalInterviewResult(candidate.id, true)}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleTechnicalInterviewResult(candidate.id, false)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <span className={candidate.technicalInterviewStatus === 'passed' ? 'text-green-500' : 'text-red-500'}>
                      {candidate.technicalInterviewStatus === 'passed' ? 'OK' : 'KO'}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {item.status === 'Offre' && candidate.technicalInterviewStatus === 'passed' && candidate.normalInterviewStatus === 'passed' && !candidate.proposedSalary && (
            <div className="mt-2">
              <Button 
                size="sm"
                onClick={() => handleSalaryProposal(candidate.id, 45000)} // Valeur exemple
              >
                Proposer salaire (45k€)
              </Button>
            </div>
          )}

          {candidate.proposedSalary && (
            <div className="mt-2 text-sm">
              Salaire proposé: {candidate.proposedSalary}€/an
              {candidate.offerStatus && (
                <span className={`ml-2 ${candidate.offerStatus === 'accepted' ? 'text-green-500' : 'text-red-500'}`}>
                  ({candidate.offerStatus})
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </Card>
  );
}
