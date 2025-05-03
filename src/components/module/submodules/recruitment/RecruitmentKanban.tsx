
import React, { useState } from 'react';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';
import { RecruitmentPost } from '@/types/recruitment';
import KanbanColumn from './KanbanColumn';
import { DndProvider } from '@dnd-kit/core';
import { DndContext, DragEndEvent, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import { updateRecruitmentStatus } from './services/recruitmentService';

const RecruitmentKanban = () => {
  const { recruitmentPosts, isLoading, refetch } = useRecruitmentFirebaseData();
  const [isDragging, setIsDragging] = useState(false);
  
  // Ensure recruitmentPosts is always an array and filter out nulls/undefined
  const safePosts = Array.isArray(recruitmentPosts) ? recruitmentPosts.filter(Boolean) : [];
  
  // Filter by status with additional null checks to prevent errors
  const openPosts = safePosts.filter(post => post && post.status === 'Ouverte');
  const inProgressPosts = safePosts.filter(post => post && post.status === 'En cours');
  const interviewPosts = safePosts.filter(post => post && post.status === 'Entretiens');
  const closedPosts = safePosts.filter(post => post && post.status === 'Fermée');

  // All columns in the kanban
  const columns = [
    { id: 'Ouverte', title: 'Postes ouverts', items: openPosts },
    { id: 'En cours', title: 'En cours', items: inProgressPosts },
    { id: 'Entretiens', title: 'Entretiens', items: interviewPosts },
    { id: 'Fermée', title: 'Fermés', items: closedPosts }
  ];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setIsDragging(false);
    
    if (!over) return;
    
    const postId = active.id as string;
    const targetColumnId = over.id as string;
    
    // Find the post being dragged
    const post = safePosts.find(post => post.id === postId);
    
    if (!post) return;
    
    // If the post is already in the target column, do nothing
    if (post.status === targetColumnId) return;
    
    try {
      // Update the status in Firebase
      await updateRecruitmentStatus(postId, targetColumnId);
      
      // Show success message
      toast.success(`Offre déplacée vers ${targetColumnId}`);
      
      // Refresh data to get the updated posts
      await refetch();
    } catch (error) {
      console.error("Error updating recruitment post status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {['Ouverte', 'En cours', 'Entretiens', 'Fermée'].map(status => (
          <div key={status} className="flex-shrink-0 w-72 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-4">{status}</h3>
            <div className="space-y-2">
              {[1, 2].map(i => (
                <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-md"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <KanbanColumn 
            key={column.id}
            id={column.id}
            title={column.title}
            items={column.items || []}
            isDragging={isDragging}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default RecruitmentKanban;
