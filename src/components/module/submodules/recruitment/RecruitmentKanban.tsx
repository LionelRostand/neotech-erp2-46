
import React from 'react';
import { useRecruitmentFirebaseData } from '@/hooks/useRecruitmentFirebaseData';
import KanbanColumn from './KanbanColumn';

const RecruitmentKanban = () => {
  const { recruitmentPosts, isLoading } = useRecruitmentFirebaseData();
  
  // Ensure recruitmentPosts is always an array and filter out nulls/undefined
  const safePosts = Array.isArray(recruitmentPosts) ? recruitmentPosts.filter(Boolean) : [];
  
  // Filter by status with additional null checks to prevent errors
  const openPosts = safePosts.filter(post => post && post.status === 'Ouverte');
  const inProgressPosts = safePosts.filter(post => post && post.status === 'En cours');
  const interviewPosts = safePosts.filter(post => post && post.status === 'Entretiens');
  const closedPosts = safePosts.filter(post => post && post.status === 'Fermée');

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
    <div className="flex gap-4 overflow-x-auto pb-4">
      <KanbanColumn 
        id="Ouverte"
        title="Postes ouverts"
        items={openPosts || []}
      />
      <KanbanColumn 
        id="En cours"
        title="En cours"
        items={inProgressPosts || []}
      />
      <KanbanColumn 
        id="Entretiens"
        title="Entretiens"
        items={interviewPosts || []}
      />
      <KanbanColumn 
        id="Fermée"
        title="Fermés"
        items={closedPosts || []}
      />
    </div>
  );
};

export default RecruitmentKanban;
