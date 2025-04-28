
import React, { useState } from 'react';
import { Employee, LeaveRequest } from '@/types/employee';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CongesTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

const CongesTabEdit: React.FC<CongesTabEditProps> = ({ 
  employee, 
  onSave, 
  onCancel 
}) => {
  // Assurez-vous que conges est un objet avec les valeurs par défaut
  const initialConges = employee.conges || {
    acquired: 25,
    taken: 0,
    balance: 25
  };

  const initialRtt = employee.rtt || {
    acquired: 10,
    taken: 0,
    balance: 10
  };

  // Assurez-vous que leaveRequests est un tableau
  const initialLeaveRequests = Array.isArray(employee.leaveRequests) ? employee.leaveRequests : [];

  const [conges, setConges] = useState(initialConges);
  const [rtt, setRtt] = useState(initialRtt);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);

  const handleCongesChange = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    let newConges = { ...conges };
    
    if (field === 'acquired') {
      newConges.acquired = numValue;
      newConges.balance = numValue - newConges.taken;
    } else if (field === 'taken') {
      newConges.taken = numValue;
      newConges.balance = newConges.acquired - numValue;
    }
    
    setConges(newConges);
  };

  const handleRttChange = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    let newRtt = { ...rtt };
    
    if (field === 'acquired') {
      newRtt.acquired = numValue;
      newRtt.balance = numValue - newRtt.taken;
    } else if (field === 'taken') {
      newRtt.taken = numValue;
      newRtt.balance = newRtt.acquired - numValue;
    }
    
    setRtt(newRtt);
  };

  const handleLeaveRequestChange = (index: number, field: string, value: string) => {
    const updatedLeaveRequests = [...leaveRequests];
    updatedLeaveRequests[index] = {
      ...updatedLeaveRequests[index],
      [field]: value
    };
    setLeaveRequests(updatedLeaveRequests);
  };

  const handleLeaveStatusChange = (index: number, status: string) => {
    const updatedLeaveRequests = [...leaveRequests];
    updatedLeaveRequests[index] = {
      ...updatedLeaveRequests[index],
      status: status as 'pending' | 'approved' | 'rejected' | 'En attente' | 'Approuvé' | 'Refusé'
    };
    setLeaveRequests(updatedLeaveRequests);
  };

  const handleSubmit = () => {
    onSave({
      conges,
      rtt,
      leaveRequests
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-lg">Congés payés</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="congesAcquired">Acquis</Label>
              <Input 
                id="congesAcquired" 
                type="number" 
                value={conges.acquired} 
                onChange={(e) => handleCongesChange('acquired', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="congesTaken">Pris</Label>
              <Input 
                id="congesTaken" 
                type="number" 
                value={conges.taken} 
                onChange={(e) => handleCongesChange('taken', e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="congesBalance">Solde</Label>
              <Input 
                id="congesBalance" 
                type="number" 
                value={conges.balance} 
                disabled
              />
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-lg">RTT</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="rttAcquired">Acquis</Label>
              <Input 
                id="rttAcquired" 
                type="number" 
                value={rtt.acquired} 
                onChange={(e) => handleRttChange('acquired', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rttTaken">Pris</Label>
              <Input 
                id="rttTaken" 
                type="number" 
                value={rtt.taken} 
                onChange={(e) => handleRttChange('taken', e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="rttBalance">Solde</Label>
              <Input 
                id="rttBalance" 
                type="number" 
                value={rtt.balance} 
                disabled
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Demandes de congé</h3>
        
        {leaveRequests.length > 0 ? (
          <div className="space-y-4">
            {leaveRequests.map((request, index) => (
              <div key={request.id || index} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Date de début</Label>
                    <Input 
                      type="date" 
                      value={request.startDate.split('T')[0]} 
                      onChange={(e) => handleLeaveRequestChange(index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date de fin</Label>
                    <Input 
                      type="date" 
                      value={request.endDate.split('T')[0]} 
                      onChange={(e) => handleLeaveRequestChange(index, 'endDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select 
                      value={request.type} 
                      onValueChange={(value) => handleLeaveRequestChange(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type de congé" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="congés payés">Congés payés</SelectItem>
                        <SelectItem value="rtt">RTT</SelectItem>
                        <SelectItem value="maladie">Maladie</SelectItem>
                        <SelectItem value="sans solde">Sans solde</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Commentaire</Label>
                    <Input 
                      value={request.comments || ''} 
                      onChange={(e) => handleLeaveRequestChange(index, 'comments', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select 
                      value={request.status} 
                      onValueChange={(value) => handleLeaveStatusChange(index, value)}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">
              Aucune demande de congé n'a été enregistrée pour cet employé.
            </p>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default CongesTabEdit;
