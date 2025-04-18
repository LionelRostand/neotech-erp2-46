
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecruitmentPost, CandidateApplication } from '@/types/recruitment';
import { Check, X, GripHorizontal } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface KanbanCardProps {
  item: RecruitmentPost;
  type: string;
  isDragging?: boolean;
}

export default function KanbanCard({ item, isDragging }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
    // Only allow dragging if both interviews are passed
    disabled: item.status === 'Entretiens' && item.candidates?.some(c => 
      c.technicalInterviewStatus !== 'passed' || c.normalInterviewStatus !== 'passed'
    )
  });
  
  const handleTechnicalInterviewResult = async (candidateId: string, passed: boolean) => {
    try {
      const candidate = item.candidates?.find(c => c.id === candidateId);
      if (!candidate) return;
      
      candidate.technicalInterviewStatus = passed ? 'passed' : 'failed';
      
      // Update in Firestore
      const postRef = doc(db, COLLECTIONS.HR.RECRUITMENT, item.id);
      await updateDoc(postRef, {
        candidates: item.candidates,
        updatedAt: new Date()
      });
      
      toast.success(`Entretien technique ${passed ? 'validé' : 'refusé'}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'entretien technique:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleNormalInterviewResult = async (candidateId: string, passed: boolean) => {
    try {
      const candidate = item.candidates?.find(c => c.id === candidateId);
      if (!candidate) return;
      
      candidate.normalInterviewStatus = passed ? 'passed' : 'failed';
      
      // Update in Firestore
      const postRef = doc(db, COLLECTIONS.HR.RECRUITMENT, item.id);
      await updateDoc(postRef, {
        candidates: item.candidates,
        updatedAt: new Date()
      });
      
      toast.success(`Entretien normal ${passed ? 'validé' : 'refusé'}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de l\'entretien normal:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
    opacity: 0.8,
    cursor: 'grabbing',
  } : undefined;

  return (
    <Card 
      className={`p-4 mb-2 ${isDragging ? 'border-2 border-blue-500 shadow-lg' : 'bg-white'}`}
      ref={setNodeRef} 
      style={style}
      {...attributes}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{item.position}</h3>
        <div 
          className="cursor-grab p-1 rounded hover:bg-gray-100"
          {...listeners}
        >
          <GripHorizontal size={16} className="text-gray-400" />
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-2">{item.department}</div>
      
      {item.candidates && item.candidates.map((candidate) => (
        <div key={candidate.id} className="mt-4 border-t pt-2">
          <div className="font-medium">{candidate.firstName} {candidate.lastName}</div>
          <div className="text-sm text-gray-500">{candidate.email}</div>
          
          {item.status === 'Entretiens' && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span>Entretien normal:</span>
                {candidate.normalInterviewStatus === 'pending' ? (
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleNormalInterviewResult(candidate.id, true)}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleNormalInterviewResult(candidate.id, false)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <span className={candidate.normalInterviewStatus === 'passed' ? 'text-green-500' : 'text-red-500'}>
                    {candidate.normalInterviewStatus === 'passed' ? 'OK' : 'KO'}
                  </span>
                )}
              </div>
              
              {candidate.normalInterviewStatus === 'passed' && (
                <div className="flex items-center justify-between">
                  <span>Entretien technique:</span>
                  {candidate.technicalInterviewStatus === 'pending' ? (
                    <div className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleTechnicalInterviewResult(candidate.id, true)}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleTechnicalInterviewResult(candidate.id, false)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <span className={candidate.technicalInterviewStatus === 'passed' ? 'text-green-500' : 'text-red-500'}>
                      {candidate.technicalInterviewStatus === 'passed' ? 'OK' : 'KO'}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </Card>
  );
}
