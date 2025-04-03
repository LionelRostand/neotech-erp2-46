
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Eye, Search } from 'lucide-react';
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
import { useLeaveData, Leave } from '@/hooks/useLeaveData';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface LeaveRequestsListProps {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const LeaveRequestsList: React.FC<LeaveRequestsListProps> = ({ onApprove, onReject }) => {
  const { leaves, isLoading, error } = useLeaveData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // Filtrer les congés en fonction de la recherche
  const filteredLeaves = leaves.filter(leave => 
    leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leave.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leave.requestDate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openConfirmDialog = (leave: Leave, action: 'approve' | 'reject') => {
    setSelectedLeave(leave);
    setActionType(action);
    setIsConfirmOpen(true);
  };

  const viewLeaveDetails = (leave: Leave) => {
    setSelectedLeave(leave);
    setIsDetailsOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedLeave && actionType) {
      if (actionType === 'approve') {
        onApprove(selectedLeave.id);
      } else {
        onReject(selectedLeave.id);
      }
    }
    setIsConfirmOpen(false);
    setActionType(null);
    setSelectedLeave(null);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2 mb-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Erreur lors du chargement des données: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Demandes de congés</h3>
      
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher une demande de congé..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
      
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
            {filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">{leave.employeeName}</TableCell>
                  <TableCell>{leave.department || 'Non spécifié'}</TableCell>
                  <TableCell>{leave.type}</TableCell>
                  <TableCell>
                    {leave.startDate} → {leave.endDate}
                  </TableCell>
                  <TableCell>{leave.days}</TableCell>
                  <TableCell>
                    <Badge className={`
                      ${leave.status === 'Approuvé' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''} 
                      ${leave.status === 'Refusé' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                      ${leave.status === 'En attente' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                    `}>
                      {leave.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => viewLeaveDetails(leave)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Voir</span>
                    </Button>
                    
                    {leave.status === 'En attente' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => openConfirmDialog(leave, 'approve')}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Approuver</span>
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openConfirmDialog(leave, 'reject')}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Refuser</span>
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  Aucune demande de congé trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for leave details */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la demande de congé</DialogTitle>
          </DialogHeader>
          
          {selectedLeave && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Employé</div>
                  <div className="font-medium">{selectedLeave.employeeName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Département</div>
                  <div>{selectedLeave.department || 'Non spécifié'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Type de congé</div>
                  <div>{selectedLeave.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Nombre de jours</div>
                  <div>{selectedLeave.days}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Date de début</div>
                  <div>{selectedLeave.startDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date de fin</div>
                  <div>{selectedLeave.endDate}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Date de la demande</div>
                  <div>{selectedLeave.requestDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Statut</div>
                  <Badge className={`
                    ${selectedLeave.status === 'Approuvé' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''} 
                    ${selectedLeave.status === 'Refusé' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}
                    ${selectedLeave.status === 'En attente' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                  `}>
                    {selectedLeave.status}
                  </Badge>
                </div>
              </div>
              
              {selectedLeave.reason && (
                <div>
                  <div className="text-sm text-gray-500">Motif</div>
                  <div>{selectedLeave.reason}</div>
                </div>
              )}
              
              {selectedLeave.approverName && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Approuvé par</div>
                    <div>{selectedLeave.approverName}</div>
                  </div>
                  {selectedLeave.approvedDate && (
                    <div>
                      <div className="text-sm text-gray-500">Date d'approbation</div>
                      <div>{selectedLeave.approvedDate}</div>
                    </div>
                  )}
                </div>
              )}
              
              {selectedLeave.comments && (
                <div>
                  <div className="text-sm text-gray-500">Commentaires</div>
                  <div>{selectedLeave.comments}</div>
                </div>
              )}
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
              onClick={handleConfirmAction}
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
