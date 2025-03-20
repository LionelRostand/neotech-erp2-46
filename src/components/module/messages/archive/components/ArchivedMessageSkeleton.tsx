
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ArchivedMessageSkeletonProps {
  count?: number;
}

const ArchivedMessageSkeleton: React.FC<ArchivedMessageSkeletonProps> = ({ count = 5 }) => {
  return (
    <div className="divide-y">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-start p-4 gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-3 w-10" />
        </div>
      ))}
    </div>
  );
};

export default ArchivedMessageSkeleton;
