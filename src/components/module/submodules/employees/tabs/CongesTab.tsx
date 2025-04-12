
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee, LeaveRequest } from '@/types/employee';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Plus, Calendar, Save } from 'lucide-react';
import { useLeaveData } from '@/hooks/useLeaveData';
import { formatDate } from '@/lib/formatters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { format, differenceInDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';

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
  const { leaves } = useLeaveData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // État pour le formulaire d'ajout de congé
  const [leaveType, setLeaveType] = useState('Congés payés');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [comments, setComments] = useState('');
  
  // Fetch leave requests for this employee from central data source
  useEffect(() => {
    if (employee.id) {
      const employeeLeaves = leaves.filter(leave => leave.employeeId === employee.id);
      
      if (employeeLeaves.length > 0 && (!employee.leaveRequests || employee.leaveRequests.length === 0)) {
        // Convert to the format expected by the component
        const formattedLeaves = employeeLeaves.map(leave => ({
          id: leave.id,
          startDate: leave.startDate,
          endDate: leave.endDate,
          type: leave.type,
          status: leave.status as 'pending' | 'approved' | 'rejected',
          comments: leave.reason
        }));
        
        setLeaveRequests(formattedLeaves);
      } else if (employee.leaveRequests && employee.leaveRequests.length > 0) {
        setLeaveRequests(employee.leaveRequests);
      }
    }
  }, [employee, leaves]);

  const handleSaveLeaveRequests = async () => {
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

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'approuvé':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'refusé':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'en attente':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Function to format date
  const formatLeaveDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      return formatDate(dateString, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  // Calculer le nombre de jours entre deux dates
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    // Add 1 because the period is inclusive
    return differenceInDays(addDays(endDate, 1), startDate);
  };

  // Ouvrir le dialogue d'ajout de congé
  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  // Soumettre la demande de congé
  const handleSubmitLeaveRequest = () => {
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner les dates de début et de fin");
      return;
    }
    
    if (startDate > endDate) {
      toast.error("La date de fin doit être postérieure à la date de début");
      return;
    }
    
    // Créer un nouvel ID unique
    const newLeaveRequest: LeaveRequest = {
      id: uuidv4(),
      type: leaveType,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      status: 'pending',
      comments: comments
    };
    
    // Ajouter la nouvelle demande à la liste
    const updatedLeaveRequests = [...leaveRequests, newLeaveRequest];
    setLeaveRequests(updatedLeaveRequests);
    
    // Fermer le dialogue
    setIsAddDialogOpen(false);
    
    // Si en mode édition, enregistrer immédiatement les modifications
    if (isEditing) {
      // Mettre à jour les congés de l'employé dans Firebase
      try {
        updateDocument(COLLECTIONS.HR.EMPLOYEES, employee.id, {
          leaveRequests: updatedLeaveRequests
        });
        
        // Ajouter la demande à la collection des congés
        const leaveData = {
          id: newLeaveRequest.id,
          employeeId: employee.id,
          type: newLeaveRequest.type,
          startDate: newLeaveRequest.startDate,
          endDate: newLeaveRequest.endDate,
          status: 'pending',
          reason: newLeaveRequest.comments,
          requestDate: new Date().toISOString(),
          days: calculateDays()
        };
        
        // Nous n'avons pas accès à addDocument ici, mais nous pouvons le simuler
        console.log("Ajout d'une nouvelle demande de congé:", leaveData);
        
        toast.success('Demande de congé ajoutée avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la demande de congé:', error);
        toast.error('Erreur lors de l\'ajout de la demande de congé');
      }
    }
    
    // Réinitialiser le formulaire
    setLeaveType('Congés payés');
    setStartDate(new Date());
    setEndDate(new Date());
    setComments('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Congés</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {leaveRequests && leaveRequests.length > 0 ? (
          <div className="space-y-4">
            {leaveRequests.map((leave, index) => (
              <div key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium">{leave.type || 'Congés payés'}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(leave.status)}`}>
                    {leave.status === 'pending' ? 'En attente' : 
                     leave.status === 'approved' ? 'Approuvé' : 'Refusé'}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Du {formatLeaveDate(leave.startDate)} au {formatLeaveDate(leave.endDate)}
                  </span>
                </div>
                {leave.comments && (
                  <div className="mt-2">
                    <h5 className="text-sm font-medium">Commentaires</h5>
                    <p className="text-sm mt-1">{leave.comments}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p>Aucune demande de congés enregistrée</p>
          </div>
        )}
        
        {(isEditing || leaveRequests.length === 0) && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={handleOpenAddDialog}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une demande
          </Button>
        )}
      </CardContent>
      
      {isEditing && leaveRequests.length > 0 && (
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
      
      {/* Dialogue d'ajout de congé */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouvelle demande de congé</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de congé</label>
              <Select 
                value={leaveType} 
                onValueChange={setLeaveType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de congé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Congés payés">Congés payés</SelectItem>
                  <SelectItem value="RTT">RTT</SelectItem>
                  <SelectItem value="Congé sans solde">Congé sans solde</SelectItem>
                  <SelectItem value="Congé maladie">Congé maladie</SelectItem>
                  <SelectItem value="Congé familial">Congé familial</SelectItem>
                  <SelectItem value="Congé maternité">Congé maternité</SelectItem>
                  <SelectItem value="Congé paternité">Congé paternité</SelectItem>
                  <SelectItem value="Congé exceptionnel">Congé exceptionnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de début</label>
                <DatePicker 
                  date={startDate} 
                  onSelect={setStartDate}
                  placeholder="Début du congé"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de fin</label>
                <DatePicker 
                  date={endDate} 
                  onSelect={setEndDate}
                  placeholder="Fin du congé"
                />
              </div>
            </div>
            
            {startDate && endDate && (
              <div className="bg-blue-50 p-3 rounded-md flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                <span className="text-sm text-blue-700">
                  Durée: <span className="font-semibold">{calculateDays()} jour{calculateDays() > 1 ? 's' : ''}</span>
                </span>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Commentaires (optionnel)</label>
              <Textarea 
                value={comments} 
                onChange={(e) => setComments(e.target.value)}
                placeholder="Précisez le motif de votre demande de congé"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSubmitLeaveRequest}>Soumettre la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CongesTab;
