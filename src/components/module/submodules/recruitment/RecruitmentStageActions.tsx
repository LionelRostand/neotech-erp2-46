
import React from 'react';
import { Button } from "@/components/ui/button";
import { RecruitmentStage } from '@/types/recruitment';
import { ChevronRight, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface StageActionsProps {
  currentStage: RecruitmentStage;
  onUpdateStage: (newStage: RecruitmentStage) => void;
  onRecruitmentFinalized?: (data: any) => void;
  candidateData?: any;
}

const RecruitmentStageActions: React.FC<StageActionsProps> = ({
  currentStage,
  onUpdateStage,
  onRecruitmentFinalized,
  candidateData
}) => {
  const { toast } = useToast();
  
  const stages: RecruitmentStage[] = [
    'Candidature déposée',
    'CV en cours d\'analyse',
    'Entretien RH',
    'Test technique',
    'Entretien technique',
    'Entretien final',
    'Proposition envoyée',
    'Recrutement finalisé',
    'Candidature refusée'
  ];

  const handleMoveToNextStage = () => {
    const currentIndex = stages.indexOf(currentStage);
    if (currentIndex < stages.length - 2) { // -2 because 'Candidature refusée' is special
      const nextStage = stages[currentIndex + 1];
      onUpdateStage(nextStage);
      toast({
        title: "Étape mise à jour",
        description: `Le candidat passe à l'étape : ${nextStage}`
      });
    }
  };

  const handleRejectCandidate = () => {
    onUpdateStage('Candidature refusée');
    toast({
      title: "Candidature refusée",
      description: "Le statut du candidat a été mis à jour"
    });
  };

  const handleValidateStage = () => {
    if (currentStage === 'Proposition envoyée') {
      onUpdateStage('Recrutement finalisé');
      toast({
        title: "Recrutement finalisé",
        description: "Le processus de recrutement est terminé avec succès"
      });
      
      // If we have the finalize handler and candidate data, call it
      if (onRecruitmentFinalized && candidateData) {
        onRecruitmentFinalized(candidateData);
      }
    } else {
      handleMoveToNextStage();
    }
  };
  
  const handleConvertToEmployee = () => {
    if (onRecruitmentFinalized && candidateData) {
      onRecruitmentFinalized(candidateData);
      toast({
        title: "Conversion en employé",
        description: "Le candidat est converti en employé avec succès"
      });
    }
  };

  // Don't show actions if recruitment is rejected
  if (currentStage === 'Candidature refusée') {
    return null;
  }
  
  // Show "convert to employee" button when recruitment is finalized
  if (currentStage === 'Recrutement finalisé') {
    return (
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={handleConvertToEmployee}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Convertir en employé
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-4">
      <Button 
        onClick={handleValidateStage}
        className="flex items-center gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        Valider cette étape
      </Button>

      <Button 
        variant="destructive"
        onClick={handleRejectCandidate}
        className="flex items-center gap-2"
      >
        <XCircle className="w-4 h-4" />
        Refuser la candidature
      </Button>
    </div>
  );
};

export default RecruitmentStageActions;
