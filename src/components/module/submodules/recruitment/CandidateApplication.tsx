
import React from 'react';
import { Card } from '@/components/ui/card';
import type { CandidateApplication as CandidateApplicationType } from '@/types/recruitment';
import CandidateTrackingView from './CandidateTrackingView';

interface CandidateApplicationProps {
  application: CandidateApplicationType;
  onStageUpdate: (applicationId: string, newStage: string) => void;
}

const CandidateApplication: React.FC<CandidateApplicationProps> = ({
  application,
  onStageUpdate
}) => {
  // Create candidateName from firstName and lastName if not provided
  const displayName = application.candidateName || 
    `${application.firstName} ${application.lastName}`;
  
  // Use email from candidateEmail or email property
  const displayEmail = application.candidateEmail || application.email;

  return (
    <Card className="p-6 mb-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{displayName}</h3>
        <p className="text-sm text-gray-500">{displayEmail}</p>
      </div>

      <CandidateTrackingView
        currentStage={application.currentStage || 'CV Reçu'}
        stageHistory={application.stageHistory || []}
        onStageUpdate={(newStage) => onStageUpdate(application.id, newStage)}
        candidateData={application}
      />
    </Card>
  );
};

export default CandidateApplication;
