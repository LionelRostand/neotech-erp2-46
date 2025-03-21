
import React from 'react';
import { TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const DriversTableSkeleton: React.FC = () => {
  return (
    <TableBody>
      {Array(5).fill(0).map((_, index) => (
        <TableRow key={`skeleton-row-${index}`}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
          <TableCell><Skeleton className="h-5 w-[90px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default DriversTableSkeleton;
