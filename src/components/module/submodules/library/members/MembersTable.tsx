
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Member } from '../types/library-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MembersTableProps {
  members: Member[];
  isLoading: boolean;
  onViewDetails: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

const MembersTable: React.FC<MembersTableProps> = ({
  members,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Chargement des adhérents...</p>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="h-8 w-8 text-slate-400" />
          <h3 className="font-semibold text-lg">Aucun adhérent trouvé</h3>
          <p className="text-sm text-muted-foreground">
            Commencez par ajouter un nouvel adhérent ou modifiez vos critères de recherche.
          </p>
        </div>
      </div>
    );
  }

  const getMembershipStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Actif</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Expiré</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">En attente</Badge>;
      case 'suspended':
        return <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-200">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">N° Adhérent</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.membershipId}</TableCell>
              <TableCell>{member.firstName} {member.lastName}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.phone || "-"}</TableCell>
              <TableCell>
                {member.createdAt ? 
                  format(new Date(member.createdAt), 'dd MMM yyyy', { locale: fr }) : 
                  "-"
                }
              </TableCell>
              <TableCell>{getMembershipStatusBadge(member.status)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onViewDetails(member)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onEdit(member)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(member.id)}
                >
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

export default MembersTable;
