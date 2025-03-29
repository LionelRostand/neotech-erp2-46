
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, CheckCircle, XCircle } from "lucide-react";
import { usePlanning } from './context/PlanningContext';
import { ExtensionRequest } from '../types/map-types';

interface ExtensionRequestsListProps {
  extensionRequests: ExtensionRequest[];
}

const ExtensionRequestsList: React.FC<ExtensionRequestsListProps> = ({
  extensionRequests
}) => {
  const { 
    setSelectedExtensionRequest, 
    setShowExtensionDetailsDialog 
  } = usePlanning();

  // Format date from YYYY-MM-DD to local date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
  };

  const handleViewDetails = (request: ExtensionRequest) => {
    setSelectedExtensionRequest(request);
    setShowExtensionDetailsDialog(true);
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
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Date originale</TableHead>
              <TableHead>Date demandée</TableHead>
              <TableHead>Raison</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extensionRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Aucune demande de prolongation
                </TableCell>
              </TableRow>
            ) : (
              extensionRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.clientName}</TableCell>
                  <TableCell>{request.vehicleName}</TableCell>
                  <TableCell>{formatDate(request.originalEndDate)}</TableCell>
                  <TableCell>{formatDate(request.requestedEndDate)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetails(request)}
                      className="flex items-center gap-1"
                    >
                      <Eye size={16} />
                      <span>Détails</span>
                    </Button>
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
