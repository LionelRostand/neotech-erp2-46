
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
import { Edit, Trash2 } from "lucide-react";

interface ClientTableProps {
  clients: any[];
  onViewDetails: (client: any) => void;
  onEdit: (client: any) => void;
  onDelete: (client: any) => void;
}

const ClientsTable: React.FC<ClientTableProps> = ({ 
  clients, 
  onViewDetails, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Secteur</TableHead>
          <TableHead>CA (€)</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.length > 0 ? (
          clients.map(client => (
            <TableRow key={client.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewDetails(client)}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.sector}</TableCell>
              <TableCell>{parseInt(client.revenue).toLocaleString('fr-FR')} €</TableCell>
              <TableCell>{client.contactName}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {client.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2" onClick={e => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(client);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(client);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
              Aucun client trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
