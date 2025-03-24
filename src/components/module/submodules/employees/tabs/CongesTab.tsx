
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types/employee';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, CalendarCheck, CalendarX } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'En attente' | 'Approuvé' | 'Refusé';
  days: number;
  reason?: string;
}

interface CongesTabProps {
  employee: Employee;
  isEditing: boolean;
  onFinishEditing: () => void;
}

const LEAVE_TYPES = [
  { value: 'congés payés', label: 'Congés payés' },
  { value: 'congés sans solde', label: 'Congés sans solde' },
  { value: 'RTT', label: 'RTT' },
  { value: 'maladie', label: 'Maladie' },
  { value: 'événement familial', label: 'Événement familial' },
];

// Exemple de données de congés
const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: '1',
    type: 'Congés payés',
    startDate: '15/07/2025',
    endDate: '30/07/2025',
    status: 'Approuvé',
    days: 12
  },
  {
    id: '2',
    type: 'RTT',
    startDate: '05/05/2025',
    endDate: '05/05/2025',
    status: 'Approuvé',
    days: 1
  },
  {
    id: '3',
    type: 'Maladie',
    startDate: '10/03/2025',
    endDate: '12/03/2025',
    status: 'Approuvé',
    days: 3
  }
];

const INITIAL_BALANCES = {
  'Congés payés': { total: 25, taken: 12, remaining: 13 },
  'RTT': { total: 12, taken: 1, remaining: 11 },
  'Maladie': { total: 0, taken: 3, remaining: 0 },
};

const CongesTab: React.FC<CongesTabProps> = ({ 
  employee, 
  isEditing,
  onFinishEditing
}) => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [balances, setBalances] = useState(INITIAL_BALANCES);
  const [selectedLeave, setSelectedLeave] = useState<string | null>(null);
  const [newLeaveType, setNewLeaveType] = useState<string>('');
  const [newLeaveReason, setNewLeaveReason] = useState<string>('');
  const [newLeaveDates, setNewLeaveDates] = useState<DateRange | undefined>();

  const handleAddLeave = () => {
    if (!newLeaveType || !newLeaveDates?.from) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const startDate = format(newLeaveDates.from, 'dd/MM/yyyy', { locale: fr });
    const endDate = newLeaveDates.to 
      ? format(newLeaveDates.to, 'dd/MM/yyyy', { locale: fr })
      : startDate;
    
    // Calcul simple des jours (à améliorer pour tenir compte des weekends/jours fériés)
    const days = newLeaveDates.to 
      ? Math.ceil((newLeaveDates.to.getTime() - newLeaveDates.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 1;

    const newLeave: LeaveRequest = {
      id: `${leaves.length + 1}`,
      type: newLeaveType,
      startDate,
      endDate,
      status: 'En attente',
      days,
      reason: newLeaveReason || undefined
    };

    setLeaves([...leaves, newLeave]);
    
    // Mettre à jour les soldes (simplifié)
    if (balances[newLeaveType]) {
      const updatedBalance = { ...balances[newLeaveType] };
      updatedBalance.taken += days;
      updatedBalance.remaining = updatedBalance.total - updatedBalance.taken;
      
      setBalances({
        ...balances,
        [newLeaveType]: updatedBalance
      });
    }

    toast.success("Demande de congé ajoutée");
    resetForm();
  };

  const resetForm = () => {
    setNewLeaveType('');
    setNewLeaveReason('');
    setNewLeaveDates(undefined);
    setSelectedLeave(null);
    onFinishEditing();
  };

  const updateLeaveStatus = (id: string, status: 'Approuvé' | 'Refusé') => {
    const updatedLeaves = leaves.map(leave => 
      leave.id === id ? { ...leave, status } : leave
    );
    setLeaves(updatedLeaves);
    toast.success(`Demande de congé ${status.toLowerCase()}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Congés et absences</CardTitle>
        {!isEditing && (
          <Button onClick={() => setSelectedLeave('new')}>
            Nouvelle demande
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {selectedLeave === 'new' || isEditing ? (
          <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Nouvelle demande de congé</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de congé</label>
                <Select onValueChange={setNewLeaveType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.label}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Raison (optionnel)</label>
                <Input 
                  placeholder="Motif de la demande" 
                  value={newLeaveReason}
                  onChange={(e) => setNewLeaveReason(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">Date de début</span>
                  <Input 
                    type="date" 
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setNewLeaveDates(prev => ({
                        from: date,
                        to: prev?.to
                      }));
                    }}
                    value={newLeaveDates?.from ? format(newLeaveDates.from, 'yyyy-MM-dd') : ''}
                  />
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs text-gray-500">Date de fin</span>
                  <Input 
                    type="date" 
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setNewLeaveDates(prev => ({
                        from: prev?.from || date,
                        to: date
                      }));
                    }}
                    value={newLeaveDates?.to ? format(newLeaveDates.to, 'yyyy-MM-dd') : ''}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={resetForm}>Annuler</Button>
              <Button onClick={handleAddLeave}>Enregistrer</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Solde de congés</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(balances).map(([type, { total, taken, remaining }]) => (
                  <div key={type} className="p-4 border rounded-md bg-gray-50">
                    <div className="text-sm text-gray-500">{type}</div>
                    <div className="text-2xl font-bold">{remaining} jours</div>
                    <div className="text-xs text-gray-500">
                      {taken} pris / {total} acquis
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-3">Historique des demandes</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Début</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead>Jours</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.length > 0 ? (
                    leaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>{leave.type}</TableCell>
                        <TableCell>{leave.startDate}</TableCell>
                        <TableCell>{leave.endDate}</TableCell>
                        <TableCell>{leave.days}</TableCell>
                        <TableCell>
                          <Badge className={`
                            ${leave.status === 'Approuvé' ? 'bg-green-100 text-green-800' : ''} 
                            ${leave.status === 'Refusé' ? 'bg-red-100 text-red-800' : ''}
                            ${leave.status === 'En attente' ? 'bg-amber-100 text-amber-800' : ''}
                          `}>
                            {leave.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        Aucune demande de congé enregistrée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CongesTab;
