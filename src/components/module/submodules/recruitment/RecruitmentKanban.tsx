import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { RecruitmentStage, CandidateApplication, RecruitmentPost } from '@/types/recruitment';
import KanbanCard from './KanbanCard';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';

interface KanbanColumnProps {
  title: string;
  children: React.ReactNode;
  id: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, children, id }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex-1 min-w-[250px] max-w-[300px]">
      <div className="bg-muted p-3 rounded-t-lg border-b">
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div ref={setNodeRef} className="p-2 bg-muted/50 rounded-b-lg min-h-[400px]">
        {children}
      </div>
    </div>
  );
};

const RecruitmentKanban = () => {
  const { recruitmentPosts } = useRecruitmentFirebaseData();
  
  const stages: RecruitmentStage[] = [
    'CV en cours d\'analyse',
    'Entretien RH',
    'Test technique',
    'Entretien final',
    'Recrutement finalisé'
  ];

  // Example candidate data - in real app this would come from a database
  const [candidates, setCandidates] = useState<CandidateApplication[]>([
    {
      id: '1',
      recruitmentId: '1',
      candidateId: '1',
      candidateName: 'John Doe',
      candidateEmail: 'john@example.com',
      currentStage: 'CV en cours d\'analyse',
      stageHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCandidates(prevCandidates => 
        prevCandidates.map(candidate => {
          if (candidate.id === active.id) {
            return {
              ...candidate,
              currentStage: over.id as RecruitmentStage,
              updatedAt: new Date().toISOString(),
              stageHistory: [
                ...candidate.stageHistory,
                {
                  stage: over.id as RecruitmentStage,
                  date: new Date().toISOString(),
                }
              ]
            };
          }
          return candidate;
        })
      );
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="w-full overflow-x-auto">
        <div className="flex gap-3 p-3">
          {/* Offres Column */}
          <KanbanColumn key="offres" id="offres" title="Offres">
            <div className="space-y-2">
              {recruitmentPosts.map((post) => (
                <Card key={post.id} className="p-3 bg-white">
                  <p className="font-medium text-sm">{post.position}</p>
                  <p className="text-xs text-muted-foreground">{post.department}</p>
                  <div className="text-xs mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded ${
                      post.status === 'Ouvert' ? 'bg-green-100 text-green-800' :
                      post.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </KanbanColumn>

          {/* Other stages */}
          {stages.map((stage) => (
            <KanbanColumn key={stage} id={stage} title={stage}>
              <div className="space-y-2">
                {candidates
                  .filter(candidate => candidate.currentStage === stage)
                  .map(candidate => (
                    <KanbanCard key={candidate.id} candidate={candidate} />
                  ))
                }
              </div>
            </KanbanColumn>
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default RecruitmentKanban;
