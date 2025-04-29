
import React from 'react';
import { BadgeData } from './BadgeTypes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Building, Check, X, AlertCircle } from 'lucide-react';

interface BadgesTableProps {
  badgesList: BadgeData[];
  onBadgeClick: (badgeId: string) => void;
  loading: boolean;
}

const BadgesTable: React.FC<BadgesTableProps> = ({ badgesList, onBadgeClick, loading }) => {
  
  const renderStatus = (status: string) => {
    if (status === 'success') {
      return <Badge className="bg-green-100 text-green-800 border-green-300"><Check className="h-3 w-3 mr-1" /> Actif</Badge>;
    } else if (status === 'danger') {
      return <Badge className="bg-red-100 text-red-800 border-red-300"><X className="h-3 w-3 mr-1" /> Désactivé</Badge>;
    } else if (status === 'warning') {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-300"><AlertCircle className="h-3 w-3 mr-1" /> En attente</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };
  
  if (loading) {
    return (
      <div className="mt-6 space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-12 bg-gray-100 animate-pulse rounded-md" />
        ))}
      </div>
    );
  }
  
  if (badgesList.length === 0) {
    return (
      <div className="mt-6 text-center p-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">Aucun badge trouvé</p>
      </div>
    );
  }
  
  return (
    <div className="mt-6 border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">N° Badge</TableHead>
            <TableHead>Employé</TableHead>
            <TableHead>Département</TableHead>
            <TableHead>Entreprise</TableHead>
            <TableHead>Niveau d'accès</TableHead>
            <TableHead>Date de création</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {badgesList.map((badge) => (
            <TableRow 
              key={badge.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onBadgeClick(badge.id)}
            >
              <TableCell className="font-medium">{badge.id}</TableCell>
              <TableCell>{badge.employeeName}</TableCell>
              <TableCell>{badge.department}</TableCell>
              <TableCell>
                {badge.company ? (
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                    {badge.company}
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Non spécifiée</span>
                )}
              </TableCell>
              <TableCell>{badge.accessLevel}</TableCell>
              <TableCell>{badge.date}</TableCell>
              <TableCell>{renderStatus(badge.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BadgesTable;
