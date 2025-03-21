
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, X, FileText } from "lucide-react";

interface ExtensionRequest {
  id: string;
  reservationId: string;
  clientName: string;
  originalEndDate: string;
  requestedEndDate: string;
  vehicleName: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

interface ExtensionRequestsListProps {
  extensionRequests: ExtensionRequest[];
}

const ExtensionRequestsList: React.FC<ExtensionRequestsListProps> = ({
  extensionRequests
}) => {
  // Format date from YYYY-MM-DD to local date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
  };
  
  // Get status badge based on request status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approuvée</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Refusée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[130px]">Réservation</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Date fin initiale</TableHead>
              <TableHead>Date fin demandée</TableHead>
              <TableHead>Raison</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extensionRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  Aucune demande de prolongation
                </TableCell>
              </TableRow>
            ) : (
              extensionRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      <span>{request.reservationId}</span>
                    </div>
                  </TableCell>
                  <TableCell>{request.clientName}</TableCell>
                  <TableCell>{request.vehicleName}</TableCell>
                  <TableCell>{formatDate(request.originalEndDate)}</TableCell>
                  <TableCell>{formatDate(request.requestedEndDate)}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-green-600">
                          <Check size={16} />
                          <span>Approuver</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-destructive">
                          <X size={16} />
                          <span>Refuser</span>
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm">
                        Voir détails
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExtensionRequestsList;
