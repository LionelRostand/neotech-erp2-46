
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecruitmentStage } from '@/types/recruitment';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import RecruitmentStageActions from './RecruitmentStageActions';

interface StageProps {
  stage: RecruitmentStage;
  isActive: boolean;
  isCompleted: boolean;
}

const Stage: React.FC<StageProps> = ({ stage, isActive, isCompleted }) => {
  return (
    <div className="flex items-center mb-4">
      <div className={`rounded-full p-2 ${
        isCompleted ? 'bg-green-100' : 
        isActive ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        {isCompleted ? (
          <CheckCircle2 className="h-6 w-6 text-green-600" />
        ) : isActive ? (
          <Clock className="h-6 w-6 text-blue-600" />
        ) : (
          <Circle className="h-6 w-6 text-gray-400" />
        )}
      </div>
      <div className="ml-4">
        <h3 className="font-medium">{stage}</h3>
        {isActive && (
          <p className="text-sm text-gray-500">Étape en cours</p>
        )}
      </div>
      <Badge 
        variant={isCompleted ? "success" : isActive ? "default" : "secondary"}
        className="ml-auto"
      >
        {isCompleted ? "Terminé" : isActive ? "En cours" : "À venir"}
      </Badge>
    </div>
  );
};

interface TrackingViewProps {
  currentStage: RecruitmentStage;
  stageHistory: {
    stage: RecruitmentStage;
    date: string;
    comments?: string;
  }[];
  onStageUpdate?: (newStage: RecruitmentStage) => void;
  onRecruitmentFinalized?: (data: any) => void;
  candidateData?: any;
}

const CandidateTrackingView: React.FC<TrackingViewProps> = ({
  currentStage,
  stageHistory,
  onStageUpdate,
  onRecruitmentFinalized,
  candidateData
}) => {
  const stages: RecruitmentStage[] = [
    'Candidature déposée',
    'CV en cours d\'analyse',
    'Entretien RH',
    'Test technique',
    'Entretien technique',
    'Entretien final',
    'Proposition envoyée',
    'Recrutement finalisé'
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Suivi de votre candidature</h2>
      <div className="space-y-6">
        {stages.map((stage, index) => {
          const stageIndex = stages.indexOf(currentStage);
          const isActive = stage === currentStage;
          const isCompleted = stages.indexOf(stage) < stageIndex;
          
          return (
            <Stage
              key={stage}
              stage={stage}
              isActive={isActive}
              isCompleted={isCompleted}
            />
          );
        })}
      </div>

      {onStageUpdate && (
        <RecruitmentStageActions
          currentStage={currentStage}
          onUpdateStage={onStageUpdate}
          onRecruitmentFinalized={onRecruitmentFinalized}
          candidateData={candidateData}
        />
      )}
    </Card>
  );
};

export default CandidateTrackingView;
