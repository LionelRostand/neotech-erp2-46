
import React, { useState } from 'react';
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
import { useLeaveData } from '@/hooks/useLeaveData';
import { CreateLeaveRequestDialog } from './CreateLeaveRequestDialog';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const EmployeesLeaves: React.FC = () => {
  const { leaves, stats, isLoading, refetch } = useLeaveData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleApprove = async (id: string) => {
    try {
      const leaveRef = doc(db, COLLECTIONS.HR.LEAVES, id);
      await updateDoc(leaveRef, {
        status: 'Approuvé',
        approvedBy: 'Vous'
      });
      
      toast.success('Demande de congés approuvée');
      refetch();
    } catch (error) {
      console.error('Erreur lors de l\'approbation du congé:', error);
      toast.error('Erreur lors de l\'approbation de la demande');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const leaveRef = doc(db, COLLECTIONS.HR.LEAVES, id);
      await updateDoc(leaveRef, {
        status: 'Refusé',
        approvedBy: 'Vous'
      });
      
      toast.success('Demande de congés refusée');
      refetch();
    } catch (error) {
      console.error('Erreur lors du refus du congé:', error);
      toast.error('Erreur lors du refus de la demande');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success('Données actualisées');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation des données');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('approuvé')) {
      return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
    }
    if (statusLower.includes('rejected') || statusLower.includes('refusé')) {
      return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleSubmitRequest = (data: any) => {
    setIsCreateDialogOpen(false);
    // Le refetch sera déjà effectué par la fonction createLeaveRequest
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Congés</h2>
          <p className="text-gray-500">Gestion des demandes de congés</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
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
                {stats.pending}
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
                {stats.approved}
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
                {stats.rejected}
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
                {stats.total}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Aucune demande de congé</h3>
              <p className="text-gray-500 mt-1">
                Créez une nouvelle demande en cliquant sur "Nouvelle demande"
              </p>
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
                {leaves.map(leave => (
                  <TableRow key={leave.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {leave.employeePhoto ? (
                            <AvatarImage src={leave.employeePhoto} alt={leave.employeeName} />
                          ) : null}
                          <AvatarFallback>{getInitials(leave.employeeName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{leave.employeeName}</span>
                          <div className="text-xs text-gray-500">{leave.department}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{leave.type}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          {leave.startDate} au {leave.endDate}
                        </div>
                        <div className="text-xs text-gray-500">
                          {leave.days} jour{leave.days > 1 ? 's' : ''}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{leave.requestDate}</TableCell>
                    <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    <TableCell>{leave.approvedBy || '-'}</TableCell>
                    <TableCell className="text-right">
                      {leave.status.toLowerCase() === 'en attente' || leave.status.toLowerCase() === 'pending' ? (
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleApprove(leave.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4 mr-1" /> Approuver
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleReject(leave.id)}
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
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)} 
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
};

export default EmployeesLeaves;
