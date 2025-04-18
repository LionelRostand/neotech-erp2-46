
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecruitmentPost, CandidateApplication } from '@/types/recruitment';
import { Check, X, GripHorizontal } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

interface KanbanCardProps {
  item: RecruitmentPost;
  type: string;
  isDragging?: boolean;
}

export default function KanbanCard({ item, isDragging }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
  });
  
  const handleTechnicalInterviewResult = async (candidateId: string, passed: boolean) => {
    const candidate = item.candidates?.find(c => c.id === candidateId);
    if (!candidate) return;

    candidate.technicalInterviewStatus = passed ? 'passed' : 'failed';
    
    // Nous ne modifions pas le statut de l'offre ici pour permettre le drag and drop
    // Le changement de statut se fera via drag and drop
  };

  const handleNormalInterviewResult = async (candidateId: string, passed: boolean) => {
    const candidate = item.candidates?.find(c => c.id === candidateId);
    if (!candidate) return;

    candidate.normalInterviewStatus = passed ? 'passed' : 'failed';
    
    // Nous ne modifions pas le statut de l'offre ici pour permettre le drag and drop
    // Le changement de statut se fera via drag and drop
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
    }
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
    opacity: 0.8,
    cursor: 'grabbing',
  } : undefined;

  return (
    <Card 
      className={`p-4 mb-2 ${isDragging ? 'border-2 border-blue-500 shadow-lg' : 'bg-white'}`}
      ref={setNodeRef} 
      style={style}
      {...attributes}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{item.position}</h3>
        <div 
          className="cursor-grab p-1 rounded hover:bg-gray-100"
          {...listeners}
        >
          <GripHorizontal size={16} className="text-gray-400" />
        </div>
      </div>
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
