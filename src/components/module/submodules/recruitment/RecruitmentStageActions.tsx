
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Check, X } from 'lucide-react';
import { RecruitmentStage } from '@/types/recruitment';

interface RecruitmentStageActionsProps {
  currentStage: string;
  onStageUpdate: (newStage: string) => void;
}

const RecruitmentStageActions: React.FC<RecruitmentStageActionsProps> = ({
  currentStage,
  onStageUpdate
}) => {
  const stages = [
    'CV Reçu',
    'CV Présélectionné',
    'Entretien planifié',
    'Entretien réalisé',
    'Test technique',
    'Entretien final',
    'Offre proposée',
    'Recrutement finalisé',
    'Candidature rejetée'
  ];

  const currentStageIndex = stages.indexOf(currentStage);
  
  // Cannot advance if already at final stages
  const canAdvance = currentStage !== 'Recrutement finalisé' && 
                    currentStage !== 'Candidature rejetée' &&
                    currentStageIndex < stages.length - 2;
                    
  const handleNextStage = () => {
    if (canAdvance) {
      onStageUpdate(stages[currentStageIndex + 1]);
    }
  };

  const handleReject = () => {
    onStageUpdate('Candidature rejetée');
  };

  const handleFinalize = () => {
    onStageUpdate('Recrutement finalisé');
  };

  return (
    <div className="flex justify-end space-x-2">
      {currentStage !== 'Candidature rejetée' && currentStage !== 'Recrutement finalisé' && (
        <>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600"
            onClick={handleReject}
          >
            <X className="h-4 w-4 mr-1" />
            Rejeter
          </Button>

          {currentStageIndex === 6 ? (
            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700" 
              onClick={handleFinalize}
            >
              <Check className="h-4 w-4 mr-1" />
              Finaliser
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={handleNextStage}
              disabled={!canAdvance}
            >
              Étape suivante
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default RecruitmentStageActions;
