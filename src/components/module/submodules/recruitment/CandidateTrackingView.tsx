
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CandidateApplication, RecruitmentStage } from '@/types/recruitment';

interface CandidateTrackingViewProps {
  currentStage: string;
  stageHistory?: RecruitmentStage[];
  candidateData?: CandidateApplication;
  onStageUpdate: (newStage: string) => void;
  onRecruitmentFinalized?: (candidate: CandidateApplication) => void;
}

const CandidateTrackingView: React.FC<CandidateTrackingViewProps> = ({
  currentStage,
  stageHistory = [],
  candidateData,
  onStageUpdate,
  onRecruitmentFinalized
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

  const handleNextStage = () => {
    if (currentStageIndex < stages.length - 2) {
      onStageUpdate(stages[currentStageIndex + 1]);
    }
  };

  const handleReject = () => {
    onStageUpdate('Candidature rejetée');
  };

  const handleFinalize = () => {
    onStageUpdate('Recrutement finalisé');
    if (onRecruitmentFinalized && candidateData) {
      onRecruitmentFinalized(candidateData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-1 mb-6">
        {stages.filter(stage => stage !== 'Candidature rejetée').map((stage, index) => {
          const isCompleted = currentStageIndex >= index && currentStage !== 'Candidature rejetée';
          const isCurrent = currentStage === stage;
          
          return (
            <div key={stage} className="flex-1">
              <div 
                className={`h-2 rounded-full ${
                  isCompleted ? 'bg-green-500' : 
                  isCurrent ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              ></div>
              <p className={`text-xs mt-1 ${isCurrent ? 'font-medium' : 'text-gray-500'}`}>
                {stage.length > 15 ? `${stage.substring(0, 15)}...` : stage}
              </p>
            </div>
          );
        })}
      </div>

      {stageHistory && stageHistory.length > 0 && (
        <Card className="p-4 space-y-3">
          <h3 className="font-medium">Historique de suivi</h3>
          {stageHistory.map((item, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-3 py-1">
              <p className="text-sm font-medium">{item.stage}</p>
              <p className="text-xs text-gray-500">{item.date}</p>
              {item.note && <p className="text-xs mt-1 italic">{item.note}</p>}
            </div>
          ))}
        </Card>
      )}

      <div className="flex justify-between pt-4">
        {currentStage !== 'Recrutement finalisé' && currentStage !== 'Candidature rejetée' && (
          <>
            <Button 
              onClick={handleReject} 
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Rejeter
            </Button>
            
            {currentStageIndex === 6 ? (
              <Button onClick={handleFinalize} className="bg-green-600 hover:bg-green-700">
                Finaliser le recrutement
              </Button>
            ) : (
              <Button onClick={handleNextStage}>
                Étape suivante
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateTrackingView;
