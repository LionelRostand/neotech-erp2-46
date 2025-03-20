
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentsLoadingProps {
  view: 'grid' | 'list';
}

export const DocumentsLoading: React.FC<DocumentsLoadingProps> = ({ view }) => {
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="border rounded-md p-4 space-y-3">
            <div className="flex justify-center">
              <Skeleton className="h-8 w-8" />
            </div>
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-3 w-1/2 mx-auto" />
            <div className="flex justify-center mt-2">
              <Skeleton className="h-6 w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="border rounded-md p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8" />
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
