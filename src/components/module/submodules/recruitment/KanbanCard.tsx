
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CandidateApplication, RecruitmentPost } from '@/types/recruitment';
import { useDraggable } from '@dnd-kit/core';
import { FileText, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CandidateTrackingView from './CandidateTrackingView';
import { useRecruitmentToEmployee } from '@/hooks/useRecruitmentToEmployee';

interface KanbanCardProps {
  item: CandidateApplication | RecruitmentPost;
  type: 'candidate' | 'offer';
  onStageUpdate?: (id: string, newStage: string) => void;
  getRecruitmentPost?: (recruitmentId: string) => RecruitmentPost | undefined;
}

const KanbanCard = ({ item, type, onStageUpdate, getRecruitmentPost }: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: {
      item,
      type,
    },
  });
  
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const { convertCandidateToEmployee, isConverting } = useRecruitmentToEmployee();

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  // Handler for stage updates
  const handleStageUpdate = (newStage: string) => {
    if (onStageUpdate && item.id) {
      onStageUpdate(item.id, newStage);
    }
  };

  // Handler for recruitment finalization
  const handleRecruitmentFinalized = async (candidateData: CandidateApplication) => {
    if (type === 'candidate' && getRecruitmentPost) {
      const candidate = item as CandidateApplication;
      const recruitmentPost = getRecruitmentPost(candidate.recruitmentId);
      
      if (recruitmentPost) {
        await convertCandidateToEmployee(candidate, recruitmentPost);
        setIsTrackingOpen(false);
      }
    }
  };

  // Render candidate card
  if (type === 'candidate') {
    const candidate = item as CandidateApplication;
    const isHired = candidate.currentStage === 'Recrutement finalisé';
    
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <Card className="p-3 bg-white cursor-move hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <p className="font-medium text-sm">{candidate.candidateName}</p>
            {isHired && (
              <Badge variant="success" className="ml-2">
                <UserCheck className="h-3 w-3 mr-1" />
                Embauché
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{candidate.candidateEmail}</p>
          
          <div className="mt-2 flex items-center justify-between">
            {candidate.resume && (
              <div className="text-xs flex items-center text-blue-600">
                <FileText className="h-3 w-3 mr-1" />
                <span>CV joint</span>
              </div>
            )}
            
            <Dialog open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs py-1 h-7">
                  Suivi
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Suivi de candidature</DialogTitle>
                </DialogHeader>
                <CandidateTrackingView 
                  currentStage={candidate.currentStage}
                  stageHistory={candidate.stageHistory}
                  onStageUpdate={handleStageUpdate}
                  onRecruitmentFinalized={handleRecruitmentFinalized}
                  candidateData={candidate}
                />
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>
    );
  }

  // Render offer card
  const post = item as RecruitmentPost;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card className="p-3 bg-white cursor-move hover:shadow-md transition-shadow">
        <p className="font-medium text-sm">{post.position}</p>
        <p className="text-xs text-muted-foreground">{post.department}</p>
        <div className="flex justify-between items-center mt-1">
          <Badge className={`text-xs ${
            post.status === 'Ouvert' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
            post.status === 'En cours' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
            'bg-gray-100 text-gray-800 hover:bg-gray-100'
          }`}>
            {post.status}
          </Badge>
          {post.candidates && post.candidates.length > 0 && (
            <span className="text-xs text-gray-500">
              {post.candidates.length} candidat{post.candidates.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </Card>
    </div>
  );
};

export default KanbanCard;
