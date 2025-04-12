
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Filter,
  Plus,
  Check,
  X,
  Clock,
  FileText,
  UserCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLeaveData } from '@/hooks/useLeaveData';
import { formatDate } from '@/lib/formatters';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateLeaveRequestDialog } from './CreateLeaveRequestDialog';
import { addDocument } from '@/hooks/firestore/add-operations';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

const EmployeesLeaves: React.FC = () => {
  const { leaves, stats, isLoading, error } = useLeaveData();
  const [leaveRequests, setLeaveRequests] = useState(leaves || []);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Quand les données du hook sont mises à jour, mettre à jour l'état local
  useEffect(() => {
    if (leaves && leaves.length > 0) {
      setLeaveRequests(leaves);
    }
  }, [leaves]);
  
  const handleApprove = async (id: string) => {
    try {
      // Mettre à jour le statut dans la collection LEAVE_REQUESTS
      await updateDocument(COLLECTIONS.HR.LEAVE_REQUESTS, id, {
        status: 'approved',
        approvedBy: 'CurrentUser', // Idéalement, utiliser l'ID de l'utilisateur connecté
        approvedAt: new Date().toISOString()
      });
      
      // Mettre à jour l'état local
      setLeaveRequests(leaveRequests.map(request => 
        request.id === id ? { ...request, status: 'Approuvé', approverName: 'Vous' } : request
      ));
      
      // Déclencher un rafraîchissement des données
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('Demande de congés approuvée');
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la demande:', error);
      toast.error('Erreur lors de l\'approbation de la demande');
    }
  };

  const handleReject = async (id: string) => {
    try {
      // Mettre à jour le statut dans la collection LEAVE_REQUESTS
      await updateDocument(COLLECTIONS.HR.LEAVE_REQUESTS, id, {
        status: 'rejected',
        approvedBy: 'CurrentUser', // Idéalement, utiliser l'ID de l'utilisateur connecté
        approvedAt: new Date().toISOString()
      });
      
      // Mettre à jour l'état local
      setLeaveRequests(leaveRequests.map(request => 
        request.id === id ? { ...request, status: 'Refusé', approverName: 'Vous' } : request
      ));
      
      // Déclencher un rafraîchissement des données
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('Demande de congés refusée');
    } catch (error) {
      console.error('Erreur lors du refus de la demande:', error);
      toast.error('Erreur lors du refus de la demande');
    }
  };

  const handleAddLeaveRequest = async (data: any) => {
    try {
      // Ajouter la demande à la collection LEAVE_REQUESTS
      const docId = await addDocument(COLLECTIONS.HR.LEAVE_REQUESTS, {
        ...data,
        requestDate: new Date().toISOString(),
        status: 'pending'
      });
      
      // Mettre à jour l'état local avec la nouvelle demande
      const newRequest = {
        id: docId,
        employeeName: data.employeeName,
        employeeId: data.employeeId,
        type: data.type,
        startDate: formatDate(new Date(data.startDate), { day: '2-digit', month: '2-digit', year: 'numeric' }),
        endDate: formatDate(new Date(data.endDate), { day: '2-digit', month: '2-digit', year: 'numeric' }),
        days: data.days,
        status: 'En attente',
        reason: data.reason,
        requestDate: formatDate(new Date(), { day: '2-digit', month: '2-digit', year: 'numeric' }),
        approverName: '',
        employeePhoto: data.employeePhoto || ''
      };
      
      setLeaveRequests([...leaveRequests, newRequest]);
      
      // Déclencher un rafraîchissement des données
      setRefreshTrigger(prev => prev + 1);
      
      toast.success('Demande de congés ajoutée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la demande:', error);
      toast.error('Erreur lors de l\'ajout de la demande');
    }
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes('approuv') || normalizedStatus.includes('valid')) {
      return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
    } else if (normalizedStatus.includes('refus') || normalizedStatus.includes('rejet')) {
      return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
    } else {
      return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Congés</h2>
          <p className="text-gray-500">Gestion des demandes de congés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button size="sm" onClick={() => setIsRequestDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">En attente</h3>
              <p className="text-2xl font-bold text-blue-700">
                {stats?.pending || 0}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Approuvés</h3>
              <p className="text-2xl font-bold text-green-700">
                {stats?.approved || 0}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-900">Refusés</h3>
              <p className="text-2xl font-bold text-red-700">
                {stats?.rejected || 0}
              </p>
            </div>
            <X className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total</h3>
              <p className="text-2xl font-bold text-gray-700">
                {stats?.total || 0}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              <p className="ml-2">Chargement des demandes de congés...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>Erreur lors du chargement des données</p>
              <p className="text-sm">{error.message}</p>
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Aucune demande de congés enregistrée</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setIsRequestDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une demande
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Type de congé</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Jours</TableHead>
                  <TableHead>Date de la demande</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Approuvé par</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {request.employeePhoto ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={request.employeePhoto} alt={request.employeeName} />
                            <AvatarFallback>
                              <UserCircle className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <UserCircle className="h-6 w-6 text-gray-400" />
                        )}
                        <span>{request.employeeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{request.type}</span>
                    </TableCell>
                    <TableCell>
                      {request.startDate} au {request.endDate}
                    </TableCell>
                    <TableCell>
                      {request.days} jour{request.days > 1 ? 's' : ''}
                    </TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.approverName || '-'}</TableCell>
                    <TableCell className="text-right">
                      {(request.status.toLowerCase() === 'en attente' || request.status.toLowerCase() === 'pending') ? (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4 mr-1" /> Approuver
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" /> Refuser
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4 mr-1" /> Détails
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <CreateLeaveRequestDialog 
        isOpen={isRequestDialogOpen} 
        onClose={() => setIsRequestDialogOpen(false)}
        onSubmit={handleAddLeaveRequest}
      />
    </div>
  );
};

export default EmployeesLeaves;
