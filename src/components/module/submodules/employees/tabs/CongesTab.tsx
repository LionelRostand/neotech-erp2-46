import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, Plus, Save, Trash2 } from 'lucide-react';
import { Employee, LeaveRequest } from '@/types/employee';
import { Badge } from '@/components/ui/badge';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface CongesTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee, isEditing = false, onFinishEditing }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(employee.leaveRequests || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLeave, setNewLeave] = useState<Partial<LeaveRequest>>({
    type: 'Congés payés',
    status: 'pending'
  });
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setLeaveRequests(employee.leaveRequests || []);
  }, [employee]);

  const handleSaveLeaves = async () => {
    if (!employee.id) return;
    
    setIsSubmitting(true);
    try {
      await updateDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, {
        leaveRequests
      });
      
      toast.success('Congés mis à jour avec succès');
      if (onFinishEditing) {
        onFinishEditing();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des congés:', error);
      toast.error('Erreur lors de la mise à jour des congés');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddLeave = () => {
    if (!startDate || !endDate || !newLeave.type) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (endDate < startDate) {
      toast.error('La date de fin doit être postérieure à la date de début');
      return;
    }

    const newLeaveRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      type: newLeave.type,
      status: newLeave.status as 'pending' | 'approved' | 'rejected',
      comments: newLeave.comments
    };

    setLeaveRequests([...leaveRequests, newLeaveRequest]);
    
    setNewLeave({
      type: 'Congés payés',
      status: 'pending'
    });
    setStartDate(undefined);
    setEndDate(undefined);
    
    toast.success('Demande de congé ajoutée');
  };

  const handleRemoveLeave = (id: string) => {
    setLeaveRequests(leaveRequests.filter(leave => leave.id !== id));
    toast.success('Demande de congé supprimée');
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR');
    } catch (error) {
      return dateStr;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'rejected':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Refusé';
      default:
        return 'En attente';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Congés de l'employé</CardTitle>
        </CardHeader>
        <CardContent>
          {leaveRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Début</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Statut</TableHead>
                  {isEditing && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.type}</TableCell>
                    <TableCell>{formatDate(leave.startDate)}</TableCell>
                    <TableCell>{formatDate(leave.endDate)}</TableCell>
                    <TableCell>
                      <span className={getStatusBadgeClass(leave.status)}>
                        {getStatusLabel(leave.status)}
                      </span>
                    </TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveLeave(leave.id)}
                        >
                          Supprimer
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-6 text-muted-foreground">
              Aucune demande de congé n'a été enregistrée pour cet employé.
            </p>
          )}

          {isEditing && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-4">Ajouter une demande de congé</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="leave-type">Type de congé</Label>
                  <Input
                    id="leave-type"
                    value={newLeave.type || ''}
                    onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}
                    placeholder="Ex: Congés payés, RTT, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leave-status">Statut</Label>
                  <select
                    id="leave-status"
                    value={newLeave.status}
                    onChange={(e) => setNewLeave({...newLeave, status: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvé</option>
                    <option value="rejected">Refusé</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Date de début</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM/yyyy') : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Date de fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM/yyyy') : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <Label htmlFor="leave-comments">Commentaires (optionnel)</Label>
                <Input
                  id="leave-comments"
                  value={newLeave.comments || ''}
                  onChange={(e) => setNewLeave({...newLeave, comments: e.target.value})}
                  placeholder="Commentaires additionnels..."
                />
              </div>
              
              <Button onClick={handleAddLeave} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter la demande
              </Button>
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
                onClick={handleSaveLeaves}
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
    </div>
  );
};

export default CongesTab;
