
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BadgesTableProps } from './BadgeTypes';

const BadgesTable: React.FC<BadgesTableProps> = ({ badgesList, onBadgeClick, loading = false }) => {
  if (loading) {
    return (
      <div className="mt-6 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Employé</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Niveau d'accès</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!badgesList || badgesList.length === 0) {
    return (
      <div className="mt-6 border rounded-md p-8 text-center">
        <p className="text-gray-500">Aucun badge n'a été créé</p>
      </div>
    );
  }

  return (
    <div className="mt-6 border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Employé</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Niveau d'accès</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {badgesList.map((badge) => (
            <TableRow 
              key={badge.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onBadgeClick(badge.id)}
            >
              <TableCell className="font-medium">{badge.id}</TableCell>
              <TableCell>{badge.employeeName}</TableCell>
              <TableCell>{badge.department || "Non assigné"}</TableCell>
              <TableCell>{badge.accessLevel}</TableCell>
              <TableCell>{badge.date}</TableCell>
              <TableCell>
                <Badge
                  variant={badge.status === 'success' ? 'default' : 
                         badge.status === 'warning' ? 'outline' : 
                         badge.status === 'error' ? 'destructive' : 'secondary'}
                >
                  {badge.statusText}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BadgesTable;
