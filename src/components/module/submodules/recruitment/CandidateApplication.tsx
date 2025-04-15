
import React from 'react';
import { Card } from '@/components/ui/card';
import { CandidateApplication } from '@/types/recruitment';
import CandidateTrackingView from './CandidateTrackingView';

interface CandidateApplicationProps {
  application: CandidateApplication;
  onStageUpdate: (applicationId: string, newStage: string) => void;
}

const CandidateApplication: React.FC<CandidateApplicationProps> = ({
  application,
  onStageUpdate
}) => {
  return (
    <Card className="p-6 mb-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{application.candidateName}</h3>
        <p className="text-sm text-gray-500">{application.candidateEmail}</p>
      </div>

      <CandidateTrackingView
        currentStage={application.currentStage}
        stageHistory={application.stageHistory}
        onStageUpdate={(newStage) => onStageUpdate(application.id, newStage)}
      />
    </Card>
  );
};

export default CandidateApplication;
