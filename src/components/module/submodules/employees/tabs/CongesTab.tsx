
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
            {isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une demande
              </Button>
            )}
          </div>
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
    </Card>
  );
};

export default CongesTab;
