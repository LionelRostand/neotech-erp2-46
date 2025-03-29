
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapExtensionRequest as ExtensionRequest } from '../types';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarRange } from "lucide-react";

interface ExtensionRequestsListProps {
  extensionRequests: ExtensionRequest[];
  onViewDetails: (requestId: string) => void;
}

const ExtensionRequestsList: React.FC<ExtensionRequestsListProps> = ({
  extensionRequests,
  onViewDetails
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: fr });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejetée</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Demandes de prolongation</h3>
      
      {extensionRequests.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <CalendarRange className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h4 className="text-lg font-medium mb-2">Aucune demande de prolongation</h4>
          <p className="text-muted-foreground mx-auto max-w-md">
            Il n'y a pas de demande de prolongation actuellement.
          </p>
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Référence</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Date originale</TableHead>
                <TableHead>Date demandée</TableHead>
                <TableHead className="w-24">Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extensionRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.requestId}</TableCell>
                  <TableCell>{request.clientName}</TableCell>
                  <TableCell>{request.vehicleName}</TableCell>
                  <TableCell>{formatDate(request.originalEndDate)}</TableCell>
                  <TableCell>{formatDate(request.requestedEndDate)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewDetails(request.id)}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ExtensionRequestsList;
