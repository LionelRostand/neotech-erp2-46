import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { RecruitmentStage, CandidateApplication, RecruitmentPost } from '@/types/recruitment';
import KanbanCard from './KanbanCard';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';
import { useToast } from '@/components/ui/use-toast';
import { updateDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

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
  const { recruitmentPosts, isLoading } = useRecruitmentFirebaseData();
  const { toast } = useToast();
  
  const stages: RecruitmentStage[] = [
    'CV en cours d\'analyse',
    'Entretien RH',
    'Test technique',
    'Entretien final',
    'Recrutement finalisé'
  ];

  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);

  useEffect(() => {
    const fetchCandidates = () => {
      const allCandidates: CandidateApplication[] = [];
      
      recruitmentPosts.forEach(post => {
        if (post.candidates && Array.isArray(post.candidates)) {
          post.candidates.forEach(candidate => {
            allCandidates.push({
              ...candidate,
              recruitmentId: post.id
            });
          });
        }
      });
      
      setCandidates(allCandidates);
    };
    
    if (!isLoading && recruitmentPosts.length > 0) {
      fetchCandidates();
    }
  }, [recruitmentPosts, isLoading]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.data?.current?.type === 'candidate' && active.id !== over.id) {
      setCandidates(prevCandidates => 
        prevCandidates.map(candidate => {
          if (candidate.id === active.id) {
            const updatedCandidate = {
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

            updateCandidateInFirebase(updatedCandidate);
            return updatedCandidate;
          }
          return candidate;
        })
      );
    } 
    else if (active.data?.current?.type === 'offer' && active.id !== over.id) {
      const offerId = active.id as string;
      const targetStage = over.id as RecruitmentStage;
      let newStatus: 'Ouvert' | 'En cours' | 'Clôturé' = 'En cours';
      
      // Si l'offre est déplacée depuis la colonne "Offres" vers une autre étape
      if (targetStage !== 'offres') {
        if (targetStage === 'Recrutement finalisé') {
          newStatus = 'Clôturé';
        } else {
          newStatus = 'En cours';
        }
        
        await updateOfferStatusInFirebase(offerId, newStatus);
      }
    }
  };

  const updateOfferStatusInFirebase = async (offerId: string, newStatus: 'Ouvert' | 'En cours' | 'Clôturé') => {
    try {
      await updateDocument(COLLECTIONS.HR.RECRUITMENTS, offerId, {
        status: newStatus,
        currentStage: newStatus === 'Clôturé' ? 'Recrutement finalisé' : 'CV en cours d\'analyse',
        updated_at: new Date().toISOString(),
      });
      
      const statusMessages = {
        'Ouvert': 'ouverte',
        'En cours': 'en cours',
        'Clôturé': 'clôturée'
      };
      
      toast({
        title: "Statut de l'offre mis à jour",
        description: `L'offre est maintenant "${statusMessages[newStatus]}"`,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'offre:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'offre",
        variant: "destructive",
      });
    }
  };

  const handleCandidateStageUpdate = (candidateId: string, newStage: string) => {
    const candidateToUpdate = candidates.find(c => c.id === candidateId);
    
    if (candidateToUpdate) {
      const updatedCandidate = {
        ...candidateToUpdate,
        currentStage: newStage as RecruitmentStage,
        updatedAt: new Date().toISOString(),
        stageHistory: [
          ...candidateToUpdate.stageHistory,
          {
            stage: newStage as RecruitmentStage,
            date: new Date().toISOString(),
          }
        ]
      };
      
      updateCandidateInFirebase(updatedCandidate);
      
      setCandidates(prevCandidates => 
        prevCandidates.map(c => 
          c.id === candidateId ? updatedCandidate : c
        )
      );
    }
  };

  const getRecruitmentPost = (recruitmentId: string) => {
    return recruitmentPosts.find(post => post.id === recruitmentId);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="w-full overflow-x-auto">
        <div className="flex gap-3 p-3">
          <KanbanColumn key="offres" id="offres" title="Offres">
            <div className="space-y-2">
              {recruitmentPosts
                .filter(post => post.status === 'Ouvert')
                .map((post) => (
                  <KanbanCard 
                    key={post.id} 
                    item={post} 
                    type="offer"
                  />
                ))}
            </div>
          </KanbanColumn>

          {stages.map((stage) => (
            <KanbanColumn key={stage} id={stage} title={stage}>
              <div className="space-y-2">
                {stage !== 'Recrutement finalisé' && 
                  recruitmentPosts
                    .filter(post => post.status === 'En cours' && post.currentStage === stage)
                    .map(post => (
                      <KanbanCard 
                        key={post.id} 
                        item={post} 
                        type="offer"
                      />
                    ))
                }
                {candidates
                  .filter(candidate => candidate.currentStage === stage)
                  .map(candidate => (
                    <KanbanCard 
                      key={candidate.id} 
                      item={candidate} 
                      type="candidate"
                      onStageUpdate={handleCandidateStageUpdate}
                      getRecruitmentPost={getRecruitmentPost}
                    />
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
