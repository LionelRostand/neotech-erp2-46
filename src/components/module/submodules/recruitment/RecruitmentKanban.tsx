import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter, DragStartEvent } from '@dnd-kit/core';
import { collection, doc, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import KanbanColumn from './KanbanColumn';
import { RecruitmentPost } from '@/types/recruitment';

// Define the valid statuses for recruitment posts
const statuses = ['Ouverte', 'En cours', 'Entretiens', 'Offre', 'Fermée'] as const;
type StatusType = typeof statuses[number];

const RecruitmentKanban: React.FC = () => {
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizingColumn, setOrganizingColumn] = useState('');
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecruitmentPosts = async () => {
      try {
        setLoading(true);
        
        // Make sure the collection path is valid and not empty
        if (!COLLECTIONS.HR.RECRUITMENT) {
          console.error('Invalid collection path: COLLECTIONS.HR.RECRUITMENT is undefined or empty');
          toast.error('Erreur de configuration des collections Firebase');
          setLoading(false);
          return;
        }
        
        const q = query(
          collection(db, COLLECTIONS.HR.RECRUITMENT),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        const posts: RecruitmentPost[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Ensure the status is one of the allowed values or default to 'Ouverte'
          let validStatus: StatusType = 'Ouverte';
          if (data.status && typeof data.status === 'string' && 
              (statuses as readonly string[]).includes(data.status)) {
            validStatus = data.status as StatusType;
          }
          
          posts.push({
            id: doc.id,
            ...data,
            status: validStatus
          } as RecruitmentPost);
        });
        
        setRecruitmentPosts(posts);
      } catch (error) {
        console.error('Error fetching recruitment posts:', error);
        toast.error('Erreur lors du chargement des offres d\'emploi');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecruitmentPosts();
  }, []);

  const getPostsByStatus = (status: string) => {
    return recruitmentPosts.filter(post => post.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const draggedId = String(event.active.id);
    setDraggingId(draggedId);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Clear dragging state
    setDraggingId(null);
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    if (activeId === overId) return;
    
    const postIndex = recruitmentPosts.findIndex(post => post.id === activeId);
    
    if (postIndex === -1) return;
    
    try {
      // Make sure we have a valid collection path
      if (!COLLECTIONS.HR.RECRUITMENT) {
        toast.error('Erreur de configuration des collections Firebase');
        return;
      }
      
      // Ensure overId is a valid status
      if (!(statuses as readonly string[]).includes(overId)) {
        toast.error(`Statut invalide: ${overId}`);
        return;
      }
      
      const validStatus = overId as StatusType;
      
      // Create a copy of the post with the updated status
      const updatedPost = {
        ...recruitmentPosts[postIndex],
        status: validStatus
      };
      
      // Update local state first for immediate feedback
      const updatedPosts = [...recruitmentPosts];
      updatedPosts[postIndex] = updatedPost;
      setRecruitmentPosts(updatedPosts);
      
      // Then update in Firestore
      const postRef = doc(db, COLLECTIONS.HR.RECRUITMENT, activeId);
      await updateDoc(postRef, {
        status: validStatus,
        updatedAt: new Date()
      });
      
      toast.success(`Offre déplacée vers "${validStatus}"`);
    } catch (error) {
      // Revert local state if Firebase update fails
      console.error('Error updating post status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      
      // Reload the data to ensure consistency
      const fetchRecruitmentPosts = async () => {
        try {
          const q = query(
            collection(db, COLLECTIONS.HR.RECRUITMENT),
            orderBy('createdAt', 'desc')
          );
          
          const querySnapshot = await getDocs(q);
          
          const posts: RecruitmentPost[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            let validStatus: StatusType = 'Ouverte';
            if (data.status && typeof data.status === 'string' && 
                (statuses as readonly string[]).includes(data.status)) {
              validStatus = data.status as StatusType;
            }
            
            posts.push({
              id: doc.id,
              ...data,
              status: validStatus
            } as RecruitmentPost);
          });
          
          setRecruitmentPosts(posts);
        } catch (fetchError) {
          console.error('Error reloading recruitment posts:', fetchError);
        }
      };
      
      fetchRecruitmentPosts();
    }
  };

  const sortColumn = (columnId: string) => {
    setOrganizingColumn(columnId);
    
    const updatedPosts = [...recruitmentPosts];
    const columnPosts = updatedPosts.filter(post => post.status === columnId);
    
    // Sort by priority (Urgente > Haute > Normale > Basse)
    const priorityOrder: Record<string, number> = {
      'Urgente': 0,
      'Haute': 1,
      'Moyenne': 2,
      'Basse': 3,
      'High': 0,
      'Medium': 2,
      'Low': 3
    };
    
    columnPosts.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] ?? 99;
      const priorityB = priorityOrder[b.priority] ?? 99;
      return priorityA - priorityB;
    });
    
    // Replace the posts in the original array
    let currentIndex = 0;
    for (let i = 0; i < updatedPosts.length; i++) {
      if (updatedPosts[i].status === columnId) {
        updatedPosts[i] = columnPosts[currentIndex];
        currentIndex++;
      }
    }
    
    setRecruitmentPosts(updatedPosts);
    toast.success(`Colonne "${columnId}" organisée par priorité`);
    setOrganizingColumn('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex overflow-x-auto pb-4 gap-4">
        {statuses.map(status => (
          <KanbanColumn
            key={status}
            id={status}
            title={status}
            items={getPostsByStatus(status)}
            onSort={() => sortColumn(status)}
            isOrganizing={organizingColumn === status}
            currentlyDraggingId={draggingId}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default RecruitmentKanban;
