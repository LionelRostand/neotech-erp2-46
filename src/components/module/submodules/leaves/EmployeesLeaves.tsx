
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
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateLeaveRequestDialog } from './CreateLeaveRequestDialog';
import { useLeaveData } from '@/hooks/useLeaveData';
import { formatDate } from '@/lib/formatters';

const EmployeesLeaves: React.FC = () => {
  const { leaves, stats, isLoading, error, refetch } = useLeaveData();
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    if (leaves && leaves.length > 0) {
      setLeaveRequests(leaves);
    }
  }, [leaves]);
  
  const handleApprove = (id: string) => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: 'Approuvé', approvedBy: 'Vous' } : request
    ));
    toast.success('Demande de congés approuvée');
  };

  const handleReject = (id: string) => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: 'Refusé', approvedBy: 'Vous' } : request
    ));
    toast.success('Demande de congés refusée');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approuvé':
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'Refusé':
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
      case 'En attente':
      case 'pending':
      default:
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
    }
  };

  const handleCreateLeave = async (newLeave: any) => {
    // Ajouter la nouvelle demande à la liste
    setLeaveRequests(prev => [...prev, newLeave]);
    // Fermer le dialogue
    setShowCreateDialog(false);
    // Rafraîchir les données
    setRefreshKey(prev => prev + 1);
    await refetch?.();
  };

  const handleRefresh = async () => {
    try {
      await refetch?.();
      toast.success("Données actualisées");
    } catch (error) {
      toast.error("Erreur lors de l'actualisation des données");
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
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
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
            <div className="flex items-center justify-center h-40">
              <div className="h-8 w-8 border-4 border-blue-500 border-r-transparent rounded-full animate-spin"></div>
              <span className="ml-3">Chargement des demandes de congés...</span>
            </div>
          ) : leaveRequests.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune demande de congé</h3>
              <p className="mt-1 text-gray-500">Commencez par créer une nouvelle demande de congé.</p>
              <div className="mt-6">
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle demande
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Type de congé</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Date de la demande</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Approuvé par</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={request.employeePhoto} alt={request.employeeName} />
                          <AvatarFallback>{request.employeeName?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <span>{request.employeeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{request.type}</span>
                    </TableCell>
                    <TableCell>
                      {request.startDate} au {request.endDate}
                      <div className="text-xs text-gray-500">{request.days} jour{request.days > 1 ? 's' : ''}</div>
                    </TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{request.approvedBy || '-'}</TableCell>
                    <TableCell className="text-right">
                      {(request.status === 'En attente' || request.status === 'pending') ? (
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
        isOpen={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)} 
        onSubmit={handleCreateLeave} 
      />
    </div>
  );
};

export default EmployeesLeaves;
