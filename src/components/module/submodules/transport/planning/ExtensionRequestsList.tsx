
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, X, FileText, Eye } from "lucide-react";
import { ExtensionRequest } from '../types/transport-types';
import ExtensionDetailDialog from './ExtensionDetailDialog';
import { toast } from 'sonner';

interface ExtensionRequestsListProps {
  extensionRequests: ExtensionRequest[];
}

const ExtensionRequestsList: React.FC<ExtensionRequestsListProps> = ({
  extensionRequests
}) => {
  const [requests, setRequests] = useState(extensionRequests);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExtensionRequest | null>(null);
  
  // Format date from YYYY-MM-DD to local date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
  };
  
  // Get status badge based on request status
  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
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
  
  const handleViewDetails = (request: ExtensionRequest) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };
  
  const handleApprove = (id: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: "approved" as "approved" } : req
      )
    );
    setDetailDialogOpen(false);
    toast.success("Demande de prolongation approuvée");
  };
  
  const handleReject = (id: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: "rejected" as "rejected" } : req
      )
    );
    setDetailDialogOpen(false);
    toast.success("Demande de prolongation refusée");
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
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  Aucune demande de prolongation
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
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
                  <TableCell>
                    <div className="max-w-[150px] truncate" title={request.reason}>
                      {request.reason}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleViewDetails(request)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1 text-green-600"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1 text-destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
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
      
      <ExtensionDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        extension={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default ExtensionRequestsList;
