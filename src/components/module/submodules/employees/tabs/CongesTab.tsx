
import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approver?: string;
  approverId?: string;
  notes?: string;
  durationDays?: number;
}

interface CongesTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee, isEditing, onFinishEditing }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaveRequests();
  }, [employee.id]);

  const loadLeaveRequests = async () => {
    setIsLoading(true);
    try {
      // Récupération des congés depuis la collection hr_leave_requests
      const leaveRequestsRef = collection(db, COLLECTIONS.HR.LEAVE_REQUESTS);
      const q = query(
        leaveRequestsRef, 
        where("employeeId", "==", employee.id),
        orderBy("startDate", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const requests: LeaveRequest[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        const diffTime = endDate.getTime() - startDate.getTime();
        const durationDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        requests.push({
          id: doc.id,
          employeeId: data.employeeId,
          startDate: data.startDate,
          endDate: data.endDate,
          type: data.type || 'congés payés',
          status: data.status || 'pending',
          requestDate: data.requestDate || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          approver: data.approver || '',
          approverId: data.approverId || '',
          notes: data.notes || '',
          durationDays
        });
      });
      
      setLeaveRequests(requests);
    } catch (error) {
      console.error("Erreur lors du chargement des congés:", error);
      toast.error("Erreur lors du chargement des congés");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
    }
  };

  const getLeaveTypeName = (type: string) => {
    switch (type) {
      case 'congés payés':
      case 'paidLeave':
        return 'Congés payés';
      case 'rtt':
      case 'RTT':
        return 'RTT';
      case 'maladie':
      case 'sickLeave':
        return 'Congé maladie';
      case 'sans solde':
      case 'unpaidLeave':
        return 'Congé sans solde';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Congés</CardTitle>
        <Button variant="outline" className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Demander un congé
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : leaveRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune demande de congé</p>
            <p className="text-sm mt-1">Cliquez sur 'Demander un congé' pour faire une demande.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Demandé le</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{getLeaveTypeName(leave.type)}</TableCell>
                  <TableCell>
                    {new Date(leave.startDate).toLocaleDateString()} au {new Date(leave.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{leave.durationDays} jour{leave.durationDays > 1 ? 's' : ''}</TableCell>
                  <TableCell>{new Date(leave.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(leave.status)}</TableCell>
                  <TableCell>
                    {leave.notes ? (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <AlertCircle className="h-3 w-3" />
                        {leave.notes}
                      </div>
                    ) : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default CongesTab;
