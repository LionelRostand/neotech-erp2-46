
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface LeaveRequest {
  id: string;
  employee: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'Approuvé' | 'En attente' | 'Refusé';
  requestDate: string;
}

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: '001',
    employee: 'Thomas Martin',
    department: 'Marketing',
    type: 'Congés payés',
    startDate: '15/07/2025',
    endDate: '30/07/2025',
    days: 12,
    status: 'Approuvé',
    requestDate: '05/06/2025'
  },
  {
    id: '002',
    employee: 'Sophie Dubois',
    department: 'Développement',
    type: 'RTT',
    startDate: '05/05/2025',
    endDate: '05/05/2025',
    days: 1,
    status: 'En attente',
    requestDate: '20/04/2025'
  },
  {
    id: '003',
    employee: 'Jean Dupont',
    department: 'Finance',
    type: 'Maladie',
    startDate: '10/03/2025',
    endDate: '12/03/2025',
    days: 3,
    status: 'Approuvé',
    requestDate: '10/03/2025'
  },
  {
    id: '004',
    employee: 'Marie Lambert',
    department: 'Ressources Humaines',
    type: 'Congés sans solde',
    startDate: '20/08/2025',
    endDate: '27/08/2025',
    days: 6,
    status: 'En attente',
    requestDate: '01/07/2025'
  },
  {
    id: '005',
    employee: 'Pierre Durand',
    department: 'Développement',
    type: 'Congés payés',
    startDate: '10/10/2025',
    endDate: '24/10/2025',
    days: 11,
    status: 'En attente',
    requestDate: '15/07/2025'
  }
];

interface LeaveRequestsListProps {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const LeaveRequestsList: React.FC<LeaveRequestsListProps> = ({ onApprove, onReject }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const handleStatusChange = (id: string, newStatus: 'Approuvé' | 'Refusé') => {
    const updatedRequests = leaveRequests.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    );
    
    setLeaveRequests(updatedRequests);
    
    // Call the parent handler
    if (newStatus === 'Approuvé') {
      onApprove(id);
    } else {
      onReject(id);
    }
    
    setIsConfirmOpen(false);
    setActionType(null);
  };

  const openConfirmDialog = (request: LeaveRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setIsConfirmOpen(true);
  };

  const viewRequestDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Demandes de congés</h3>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Jours</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.employee}</TableCell>
                <TableCell>{request.department}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>
                  {request.startDate} → {request.endDate}
                </TableCell>
                <TableCell>{request.days}</TableCell>
                <TableCell>
                  <Badge className={`
                    ${request.status === 'Approuvé' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''} 
                    ${request.status === 'Refusé' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                    ${request.status === 'En attente' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                  `}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => viewRequestDetails(request)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Voir</span>
                  </Button>
                  
                  {request.status === 'En attente' && (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => openConfirmDialog(request, 'approve')}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approuver</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => openConfirmDialog(request, 'reject')}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Refuser</span>
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            
            {leaveRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  Aucune demande de congé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for request details */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la demande de congé</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Employé</div>
                  <div className="font-medium">{selectedRequest.employee}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Département</div>
                  <div>{selectedRequest.department}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Type de congé</div>
                  <div>{selectedRequest.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Nombre de jours</div>
                  <div>{selectedRequest.days}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Date de début</div>
                  <div>{selectedRequest.startDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date de fin</div>
                  <div>{selectedRequest.endDate}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Date de la demande</div>
                  <div>{selectedRequest.requestDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Statut</div>
                  <Badge className={`
                    ${selectedRequest.status === 'Approuvé' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''} 
                    ${selectedRequest.status === 'Refusé' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                    ${selectedRequest.status === 'En attente' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                  `}>
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for approve/reject */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' ? 'Approuver cette demande ?' : 'Refuser cette demande ?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve' 
                ? "Cette action approuvera la demande de congé et notifiera l'employé."
                : "Cette action refusera la demande de congé et notifiera l'employé."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmOpen(false)}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedRequest && handleStatusChange(
                selectedRequest.id, 
                actionType === 'approve' ? 'Approuvé' : 'Refusé'
              )}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {actionType === 'approve' ? 'Approuver' : 'Refuser'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
