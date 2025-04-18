import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CandidateApplication, RecruitmentPost } from '@/types/recruitment';
import { useDraggable } from '@dnd-kit/core';
import { FileText, UserCheck, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CandidateTrackingView from './CandidateTrackingView';
import { useRecruitmentToEmployee } from '@/hooks/useRecruitmentToEmployee';
import { toast } from 'sonner';

interface KanbanCardProps {
  item: CandidateApplication | RecruitmentPost;
  type: 'candidate' | 'offer';
  onStageUpdate?: (id: string, newStage: string, updatedCandidate?: Partial<CandidateApplication>) => void;
  getRecruitmentPost?: (recruitmentId: string) => RecruitmentPost | undefined;
}

const KanbanCard = ({ item, type, onStageUpdate, getRecruitmentPost }: KanbanCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [proposedSalary, setProposedSalary] = useState('');
  const { convertCandidateToEmployee, loading: isConverting } = useRecruitmentToEmployee();

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { item, type },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  const handleAddCandidate = async () => {
    if (!candidateName || !candidateEmail) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    if (onStageUpdate && type === 'offer') {
      const newCandidate: Partial<CandidateApplication> = {
        candidateName,
        candidateEmail,
        cvUrl,
        currentStage: 'En cours',
        applicationDate: new Date().toISOString(),
        recruitmentId: item.id,
      };

      onStageUpdate(item.id, 'En cours', newCandidate);
      setIsDialogOpen(false);
      toast.success('Candidat ajouté avec succès');
    }
  };

  const handleInterviewValidation = (interviewType: 'normal' | 'technical') => {
    if (type === 'candidate' && onStageUpdate) {
      const candidate = item as CandidateApplication;
      const updatedCandidate = {
        ...candidate,
        [`${interviewType}InterviewStatus`]: 'passed'
      };

      // Si les deux entretiens sont validés, passer à l'étape Offre
      if (
        (interviewType === 'normal' && candidate.technicalInterviewStatus === 'passed') ||
        (interviewType === 'technical' && candidate.normalInterviewStatus === 'passed')
      ) {
        onStageUpdate(candidate.id, 'Offre', updatedCandidate);
      } else {
        onStageUpdate(candidate.id, 'Entretiens', updatedCandidate);
      }
    }
  };

  const handleSalaryOffer = async () => {
    if (!proposedSalary) {
      toast.error('Veuillez saisir un salaire');
      return;
    }

    if (type === 'candidate' && onStageUpdate) {
      const candidate = item as CandidateApplication;
      const recruitmentPost = getRecruitmentPost?.(candidate.recruitmentId || '');

      if (recruitmentPost) {
        const updatedCandidate = {
          ...candidate,
          proposedSalary: Number(proposedSalary),
          offerStatus: 'accepted'
        };

        await convertCandidateToEmployee(updatedCandidate, recruitmentPost);
        onStageUpdate(candidate.id, 'Fermée', updatedCandidate);
        setIsDialogOpen(false);
        toast.success('Candidat converti en employé avec succès');
      }
    }
  };

  // Render candidate card
  if (type === 'candidate') {
    const candidate = item as CandidateApplication;
    
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <Card className="p-3 bg-white cursor-move hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <p className="font-medium text-sm">{candidate.candidateName}</p>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
            <Mail className="h-3 w-3" />
            <span>{candidate.candidateEmail}</span>
          </div>
          
          {candidate.cvUrl && (
            <div className="mt-2 flex items-center text-xs text-blue-600">
              <FileText className="h-3 w-3 mr-1" />
              <span>CV joint</span>
            </div>
          )}

          <div className="mt-2 flex justify-end gap-2">
            {candidate.currentStage === 'Entretiens' && (
              <>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleInterviewValidation('normal')}
                  disabled={candidate.normalInterviewStatus === 'passed'}
                >
                  Valider entretien
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleInterviewValidation('technical')}
                  disabled={candidate.technicalInterviewStatus === 'passed'}
                >
                  Valider technique
                </Button>
              </>
            )}

            {candidate.currentStage === 'Offre' && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">Faire une offre</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Proposition salariale</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Salaire annuel proposé (€)</Label>
                      <Input
                        type="number"
                        value={proposedSalary}
                        onChange={(e) => setProposedSalary(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSalaryOffer} disabled={isConverting}>
                      Valider l'offre
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Render offer card with add candidate button
  const post = item as RecruitmentPost;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card className="p-3 bg-white cursor-move hover:shadow-md transition-shadow">
        <p className="font-medium text-sm">{post.position}</p>
        <p className="text-xs text-muted-foreground">{post.department}</p>
        
        {post.status === 'En cours' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="mt-2 w-full">
                Ajouter un candidat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un candidat</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nom du candidat</Label>
                  <Input
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL du CV</Label>
                  <Input
                    value={cvUrl}
                    onChange={(e) => setCvUrl(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCandidate}>
                  Ajouter le candidat
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </Card>
    </div>
  );
};

export default KanbanCard;
