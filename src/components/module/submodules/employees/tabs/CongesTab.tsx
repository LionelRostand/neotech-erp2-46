
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee, LeaveRequest } from '@/types/employee';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Save } from 'lucide-react';

interface CongesTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const CongesTab: React.FC<CongesTabProps> = ({ 
  employee, 
  isEditing = false, 
  onFinishEditing 
}) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(employee.leaveRequests || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLeaveRequest, setNewLeaveRequest] = useState<Partial<LeaveRequest>>({
    startDate: '',
    endDate: '',
    type: 'paid',
    status: 'pending',
    comments: ''
  });
  
  // Update leave requests when employee data changes
  useEffect(() => {
    setLeaveRequests(employee.leaveRequests || []);
  }, [employee]);

  const handleSaveLeaveRequests = async () => {
    if (!employee.id) return;
    
    setIsSubmitting(true);
    try {
      await updateDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, {
        leaveRequests
      });
      
      toast.success('Demandes de congés mises à jour avec succès');
      if (onFinishEditing) {
        onFinishEditing();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des demandes de congés:', error);
      toast.error('Erreur lors de la mise à jour des demandes de congés');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  // Fonction pour déterminer la classe CSS en fonction du statut
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'approuvé':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full';
      case 'pending':
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full';
      case 'rejected':
      case 'refusé':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Congés</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {leaveRequests && leaveRequests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Commentaires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((leave, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(leave.startDate)}</TableCell>
                  <TableCell>{formatDate(leave.endDate)}</TableCell>
                  <TableCell>{leave.type}</TableCell>
                  <TableCell>
                    <span className={getStatusClass(leave.status)}>
                      {leave.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {leave.comments || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Aucune demande de congés enregistrée
          </div>
        )}
        
        {isEditing && (
          <div className="mt-8 space-y-6 border-t pt-6">
            <h3 className="text-lg font-medium">Ajouter une demande de congés</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="leave-start-date">Date de début</Label>
                <div className="border rounded-md p-4">
                  <Calendar 
                    mode="single" 
                    selected={newLeaveRequest.startDate ? new Date(newLeaveRequest.startDate) : undefined}
                    onSelect={(date) => setNewLeaveRequest({...newLeaveRequest, startDate: date ? date.toISOString() : ''})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leave-end-date">Date de fin</Label>
                <div className="border rounded-md p-4">
                  <Calendar 
                    mode="single" 
                    selected={newLeaveRequest.endDate ? new Date(newLeaveRequest.endDate) : undefined}
                    onSelect={(date) => setNewLeaveRequest({...newLeaveRequest, endDate: date ? date.toISOString() : ''})}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leave-type">Type de congés</Label>
              <select 
                id="leave-type"
                className="w-full p-2 border rounded-md"
                value={newLeaveRequest.type}
                onChange={(e) => setNewLeaveRequest({...newLeaveRequest, type: e.target.value})}
              >
                <option value="paid">Congés payés</option>
                <option value="unpaid">Congés sans solde</option>
                <option value="sick">Congé maladie</option>
                <option value="other">Autre</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leave-comments">Commentaires</Label>
              <textarea 
                id="leave-comments"
                className="w-full p-2 border rounded-md h-24"
                value={newLeaveRequest.comments}
                onChange={(e) => setNewLeaveRequest({...newLeaveRequest, comments: e.target.value})}
              />
            </div>
            
            <div>
              <Button 
                onClick={() => {
                  if (!newLeaveRequest.startDate || !newLeaveRequest.endDate) {
                    toast.error('Veuillez sélectionner les dates de début et de fin');
                    return;
                  }
                  
                  const newLeave = {
                    id: `leave-${Date.now()}`,
                    startDate: newLeaveRequest.startDate,
                    endDate: newLeaveRequest.endDate,
                    type: newLeaveRequest.type || 'paid',
                    status: 'pending',
                    comments: newLeaveRequest.comments
                  } as LeaveRequest;
                  
                  setLeaveRequests([...leaveRequests, newLeave]);
                  setNewLeaveRequest({
                    startDate: '',
                    endDate: '',
                    type: 'paid',
                    status: 'pending',
                    comments: ''
                  });
                  
                  toast.success('Demande de congés ajoutée');
                }}
              >
                Ajouter
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      {isEditing && (
        <CardFooter className="border-t px-6 py-4 bg-muted/20">
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              onClick={onFinishEditing}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSaveLeaveRequests}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CongesTab;
