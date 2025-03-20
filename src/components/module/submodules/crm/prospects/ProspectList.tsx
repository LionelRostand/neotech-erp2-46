
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
import { 
  Edit, 
  Trash2, 
  BellRing, 
  ArrowUpRight 
} from "lucide-react";
import { Prospect } from '../types/crm-types';

interface ProspectListProps {
  loading: boolean;
  filteredProspects: Prospect[];
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (status: string) => string;
  onViewDetails: (prospect: Prospect) => void;
  onEdit: (prospect: Prospect) => void;
  onDelete: (prospect: Prospect) => void;
  onReminder: (prospect: Prospect) => void;
  onConvert: (prospect: Prospect) => void;
}

const ProspectList: React.FC<ProspectListProps> = ({
  loading,
  filteredProspects,
  getStatusBadgeClass,
  getStatusText,
  onViewDetails,
  onEdit,
  onDelete,
  onReminder,
  onConvert
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Entreprise</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Dernier contact</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
              Chargement des prospects...
            </TableCell>
          </TableRow>
        ) : filteredProspects.length > 0 ? (
          filteredProspects.map(prospect => (
            <TableRow key={prospect.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewDetails(prospect)}>
              <TableCell className="font-medium">{prospect.name}</TableCell>
              <TableCell>{prospect.company}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs text-blue-600">{prospect.email}</span>
                  <span className="text-xs">{prospect.phone}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(prospect.status)}`}>
                  {getStatusText(prospect.status)}
                </span>
              </TableCell>
              <TableCell>{prospect.source}</TableCell>
              <TableCell>{prospect.lastContact ? new Date(prospect.lastContact).toLocaleDateString('fr-FR') : '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2" onClick={e => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(prospect);
                    }}
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReminder(prospect);
                    }}
                    title="Programmer une relance"
                  >
                    <BellRing className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(prospect);
                    }}
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConvert(prospect);
                    }}
                    title="Convertir en client"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
              Aucun prospect trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ProspectList;
