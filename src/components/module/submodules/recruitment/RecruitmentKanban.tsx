
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

  // Initialize with empty array instead of John Doe
  const [candidates, setCandidates] = useState<CandidateApplication[]>([]);

  // Fetch candidates from related offers
  useEffect(() => {
    const fetchCandidates = () => {
      // Extract candidates from recruitment posts
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Check if dragging a candidate
    if (active.data?.current?.type === 'candidate' && active.id !== over.id) {
      // Update candidate stage
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

            // Update in Firebase
            updateCandidateInFirebase(updatedCandidate);
            return updatedCandidate;
          }
          return candidate;
        })
      );
    } 
    // Check if dragging an offer
    else if (active.data?.current?.type === 'offer' && active.id !== over.id) {
      // Update offer status based on the column
      const offerId = active.id as string;
      const newStatus = over.id === 'offres' ? 'Ouvert' : 'En cours';
      
      // Update the status in Firebase
      updateOfferStatusInFirebase(offerId, newStatus);
    }
  };

  // Function to update a candidate in Firebase
  const updateCandidateInFirebase = async (candidate: CandidateApplication) => {
    try {
      // Find the recruitment post
      const post = recruitmentPosts.find(p => p.id === candidate.recruitmentId);
      
      if (!post) {
        toast({
          title: "Erreur",
          description: "Offre de recrutement non trouvée",
          variant: "destructive",
        });
        return;
      }
      
      // Update the candidate in the candidates array
      const updatedCandidates = post.candidates?.map(c => 
        c.id === candidate.id ? candidate : c
      ) || [candidate];
      
      // Update the post in Firebase
      await updateDocument(COLLECTIONS.HR.RECRUITMENTS, post.id, {
        candidates: updatedCandidates,
        updated_at: new Date().toISOString(),
      });
      
      toast({
        title: "Candidat mis à jour",
        description: `${candidate.candidateName} est maintenant en phase "${candidate.currentStage}"`,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du candidat:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le candidat",
        variant: "destructive",
      });
    }
  };

  // Function to update an offer's status in Firebase
  const updateOfferStatusInFirebase = async (offerId: string, newStatus: string) => {
    try {
      await updateDocument(COLLECTIONS.HR.RECRUITMENTS, offerId, {
        status: newStatus,
        updated_at: new Date().toISOString(),
      });
      
      toast({
        title: "Statut de l'offre mis à jour",
        description: `L'offre est maintenant "${newStatus}"`,
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

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
      <div className="w-full overflow-x-auto">
        <div className="flex gap-3 p-3">
          {/* Offres Column */}
          <KanbanColumn key="offres" id="offres" title="Offres">
            <div className="space-y-2">
              {recruitmentPosts.map((post) => (
                <KanbanCard 
                  key={post.id} 
                  item={post} 
                  type="offer"
                />
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
                    <KanbanCard 
                      key={candidate.id} 
                      item={candidate} 
                      type="candidate"
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
