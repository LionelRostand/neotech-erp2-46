
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee, LeaveRequest } from '@/types/employee';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, PenLine, Plus, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface CongesTabProps {
  employee: Employee;
  editMode?: boolean;
  onLeavesUpdated?: (leaves: LeaveRequest[]) => void;
}

const CongesTab: React.FC<CongesTabProps> = ({ 
  employee,
  editMode = false,
  onLeavesUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(employee.leaveRequests || []);
  const [newLeave, setNewLeave] = useState<Partial<LeaveRequest>>({
    id: '',
    startDate: '',
    endDate: '',
    type: 'Congés payés',
    status: 'pending'
  });

  const leaveTypes = [
    'Congés payés',
    'RTT',
    'Maladie',
    'Sans solde',
    'Événement familial',
    'Formation'
  ];

  const statusMap: {[key: string]: string} = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Refusé',
    'En attente': 'En attente',
    'Approuvé': 'Approuvé',
    'Refusé': 'Refusé'
  };

  const getStatusBadgeVariant = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'pending' || statusLower === 'en attente') return 'outline';
    if (statusLower === 'approved' || statusLower === 'approuvé') return 'success';
    if (statusLower === 'rejected' || statusLower === 'refusé') return 'destructive';
    return 'secondary';
  };

  const handleLeaveChange = (field: keyof LeaveRequest, value: string) => {
    setNewLeave({ ...newLeave, [field]: value });
  };

  const handleAddLeave = () => {
    if (newLeave.startDate && newLeave.endDate && newLeave.type) {
      const id = `leave-${Date.now()}`; // Generate a unique ID
      const newLeaveWithId = { ...newLeave, id } as LeaveRequest;
      setLeaves([...leaves, newLeaveWithId]);
      setNewLeave({
        id: '',
        startDate: '',
        endDate: '',
        type: 'Congés payés',
        status: 'pending'
      });
    }
  };

  const handleRemoveLeave = (id: string) => {
    setLeaves(leaves.filter(leave => leave.id !== id));
  };

  const handleSaveLeaves = () => {
    if (onLeavesUpdated) {
      onLeavesUpdated(leaves);
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Solde de congés */}
      <Card>
        <CardHeader>
          <CardTitle>Solde de congés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Congés payés</p>
              <p className="text-2xl font-bold">{employee.conges?.balance || 25}</p>
              <p className="text-xs text-gray-500">
                Acquis: {employee.conges?.acquired || 25} | Pris: {employee.conges?.taken || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">RTT</p>
              <p className="text-2xl font-bold">{employee.rtt?.balance || 11}</p>
              <p className="text-xs text-gray-500">
                Acquis: {employee.rtt?.acquired || 11} | Pris: {employee.rtt?.taken || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Autres congés</p>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-gray-500">
                Acquis: 0 | Pris: 0
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demandes de congés */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Demandes de congés</CardTitle>
          {editMode && !isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              <PenLine className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {editMode && isEditing && (
            <div className="flex space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSaveLeaves}
              >
                <Check className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
              >
                Annuler
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date de début</TableHead>
                <TableHead>Date de fin</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                {isEditing && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.startDate}</TableCell>
                    <TableCell>{leave.endDate}</TableCell>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(leave.status)}>
                        {statusMap[leave.status] || leave.status}
                      </Badge>
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveLeave(leave.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isEditing ? 5 : 4} className="text-center py-4 text-gray-500">
                    Aucune demande de congés
                  </TableCell>
                </TableRow>
              )}

              {isEditing && (
                <TableRow>
                  <TableCell>
                    <Input 
                      type="date" 
                      value={newLeave.startDate} 
                      onChange={(e) => handleLeaveChange('startDate', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="date" 
                      value={newLeave.endDate} 
                      onChange={(e) => handleLeaveChange('endDate', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={newLeave.type} 
                      onValueChange={(value) => handleLeaveChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type de congé" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={newLeave.status as string} 
                      onValueChange={(value) => handleLeaveChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="approved">Approuvé</SelectItem>
                        <SelectItem value="rejected">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={handleAddLeave}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CongesTab;
