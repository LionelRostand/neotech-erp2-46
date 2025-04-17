
import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { collection, doc, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import KanbanColumn from './KanbanColumn';
import { RecruitmentPost } from '@/types/recruitment';

const statuses = ['Ouverte', 'En cours', 'Entretiens', 'Offre', 'Fermée'];

const RecruitmentKanban: React.FC = () => {
  const [recruitmentPosts, setRecruitmentPosts] = useState<RecruitmentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizingColumn, setOrganizingColumn] = useState('');

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
          posts.push({
            id: doc.id,
            ...data,
            // Ensure the status is one of the allowed values
            status: statuses.includes(data.status) ? data.status : 'Ouverte'
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
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
      
      const updatedPost = {
        ...recruitmentPosts[postIndex],
        status: overId
      };
      
      // Update in Firestore
      const postRef = doc(db, COLLECTIONS.HR.RECRUITMENT, activeId);
      await updateDoc(postRef, {
        status: overId,
        updatedAt: new Date()
      });
      
      // Update local state
      const updatedPosts = [...recruitmentPosts];
      updatedPosts[postIndex] = updatedPost;
      setRecruitmentPosts(updatedPosts);
      
      toast.success(`Offre déplacée vers "${overId}"`);
    } catch (error) {
      console.error('Error updating post status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
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
      'Normale': 2,
      'Basse': 3
    };
    
    columnPosts.sort((a, b) => {
      const priorityA = priorityOrder[a.priority];
      const priorityB = priorityOrder[b.priority];
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
          />
        ))}
      </div>
    </DndContext>
  );
};

export default RecruitmentKanban;
