
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, UserCheck, Bell } from "lucide-react";
import { Prospect } from '../types/crm-types';

interface ProspectListProps {
  prospects: Prospect[];
  isLoading: boolean;
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (status: string) => string;
  onViewDetails: (prospect: Prospect) => void;
  onEdit: (prospect: Prospect) => void;
  onDelete: (prospect: Prospect) => void;
  onReminder: (prospect: Prospect) => void;
  onConvert: (prospect: Prospect) => void;
}

const ProspectList: React.FC<ProspectListProps> = ({
  prospects,
  isLoading,
  getStatusBadgeClass,
  getStatusText,
  onViewDetails,
  onEdit,
  onDelete,
  onReminder,
  onConvert
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (prospects.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Aucun prospect trouvé.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Société</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email / Téléphone</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.map((prospect) => (
            <TableRow key={prospect.id}>
              <TableCell className="font-medium">{prospect.company}</TableCell>
              <TableCell>{prospect.contactName}</TableCell>
              <TableCell>
                <div>{prospect.contactEmail}</div>
                <div className="text-sm text-muted-foreground">{prospect.contactPhone}</div>
              </TableCell>
              <TableCell>{prospect.source}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeClass(prospect.status)}>
                  {getStatusText(prospect.status)}
                </Badge>
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onViewDetails(prospect)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(prospect)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onReminder(prospect)}>
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onConvert(prospect)}>
                  <UserCheck className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(prospect)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProspectList;
