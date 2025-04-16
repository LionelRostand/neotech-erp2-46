
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Employee } from '@/types/employee';
import InformationsTab from './tabs/InformationsTab';
import HorairesTab from './tabs/HorairesTab';
import CompetencesTab from './tabs/CompetencesTab';
import CongesTab from './tabs/CongesTab';
import { useEmployeePermissions } from './hooks/useEmployeePermissions';
import { Button } from '@/components/ui/button';
import { AlertCircle, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';

const EmployeeProfileView: React.FC<{ employee?: Employee; isLoading?: boolean; onEmployeeUpdated?: () => void }> = ({ 
  employee,
  isLoading = false,
  onEmployeeUpdated
}) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState<Employee | null>(null);
  
  const mockEmployee: Employee = {
    id: "EMP001",
    firstName: "Martin",
    lastName: "Dupont",
    email: "martin.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    department: "Marketing",
    departmentId: "MKT",
    position: "Chef de Projet Digital",
    photo: "",
    photoURL: "",
    hireDate: "15/03/2021",
    startDate: "15/03/2021",
    status: "active",
    address: {
      street: "15 Rue des Lilas",
      city: "Paris",
      postalCode: "75011",
      country: "France"
    },
    contract: "CDI",
    manager: "Sophie Martin",
    managerId: "EMP003",
    socialSecurityNumber: "",
    birthDate: "01/01/1990",
    documents: [],
    company: "",
    role: "Employé",
    title: "Chef de Projet Digital",
    professionalEmail: "martin.dupont@example.com",
    skills: [],
    education: [],
    workSchedule: {
      monday: "09:00 - 18:00",
      tuesday: "09:00 - 18:00",
      wednesday: "09:00 - 18:00",
      thursday: "09:00 - 18:00",
      friday: "09:00 - 17:00",
    },
    payslips: []
  };

  // Use the provided employee or fallback to the mock
  const displayedEmployee = employee || mockEmployee;
  
  // Get the employee ID from the displayed employee
  const employeeId = displayedEmployee?.id;
  
  // Use the useEmployeePermissions hook with the module ID and employee ID
  const { canView, canEdit, isOwnProfile, loading } = useEmployeePermissions('employees-profiles', employeeId);

  // Save all employee updates
  const saveEmployeeUpdates = async () => {
    if (!updatedEmployee || !employeeId) return;
    
    try {
      setIsUpdating(true);
      await updateDocument(COLLECTIONS.HR.EMPLOYEES, employeeId, updatedEmployee);
      toast.success("Profil employé mis à jour avec succès");
      setEditMode(false);
      
      // Call the parent update handler if provided
      if (onEmployeeUpdated) {
        onEmployeeUpdated();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setIsUpdating(false);
    }
  };

  // Update employee information
  const handleEmployeeUpdated = (field: string, value: any) => {
    setUpdatedEmployee(prev => {
      const baseEmployee = prev || displayedEmployee;
      return {
        ...baseEmployee,
        [field]: value
      };
    });
  };

  // Handle address updates
  const handleAddressUpdated = async (addressData: any) => {
    handleEmployeeUpdated('address', addressData);
  };

  // Handle schedule updates
  const handleScheduleUpdated = (scheduleData: any) => {
    handleEmployeeUpdated('workSchedule', scheduleData);
  };

  // Handle skills and competency updates
  const handleCompetencesUpdated = (skills: string[], education: any[]) => {
    setUpdatedEmployee(prev => {
      const baseEmployee = prev || displayedEmployee;
      return {
        ...baseEmployee,
        skills,
        education
      };
    });
  };

  // Handle leave updates
  const handleLeavesUpdated = (leaveRequests: any[]) => {
    handleEmployeeUpdated('leaveRequests', leaveRequests);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      // Initialize updatedEmployee with current data when entering edit mode
      setUpdatedEmployee(displayedEmployee);
    } else if (updatedEmployee) {
      // Prompt to save changes when exiting edit mode
      const hasChanges = JSON.stringify(updatedEmployee) !== JSON.stringify(displayedEmployee);
      if (hasChanges) {
        if (window.confirm("Vous avez des modifications non enregistrées. Voulez-vous les sauvegarder?")) {
          saveEmployeeUpdates();
        } else {
          setUpdatedEmployee(null);
        }
      }
    }
  };

  // If employee data is loading or permission check is in progress
  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user doesn't have permission to view this profile
  if (!canView && !isOwnProfile) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-amber-100 p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Accès limité</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md">
              Vous n'avez pas les permissions nécessaires pour consulter ce profil.
            </p>
            <Button variant="outline" onClick={() => navigate('/modules/employees/profiles')}>
              Retour à la liste
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full mr-4 bg-gray-200 overflow-hidden">
                {displayedEmployee.photoURL ? (
                  <img 
                    src={displayedEmployee.photoURL} 
                    alt={`${displayedEmployee.firstName} ${displayedEmployee.lastName}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-2xl">
                    {displayedEmployee.firstName[0]}{displayedEmployee.lastName[0]}
                  </div>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {displayedEmployee.firstName} {displayedEmployee.lastName}
                </CardTitle>
                <p className="text-gray-500">{displayedEmployee.position}</p>
              </div>
            </div>
            
            {(canEdit || isOwnProfile) && (
              <div className="flex space-x-2">
                <Button 
                  variant={editMode ? "default" : "outline"} 
                  onClick={toggleEditMode}
                >
                  {editMode ? "Quitter le mode édition" : "Modifier le profil"}
                </Button>
                
                {editMode && updatedEmployee && (
                  <Button 
                    variant="default" 
                    onClick={saveEmployeeUpdates}
                    disabled={isUpdating}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="informations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="horaires">Horaires et présence</TabsTrigger>
          <TabsTrigger value="competences">Compétences</TabsTrigger>
          <TabsTrigger value="conges">Congés</TabsTrigger>
        </TabsList>
        <TabsContent value="informations">
          <InformationsTab 
            employee={updatedEmployee || displayedEmployee} 
            onAddressUpdated={handleAddressUpdated}
            editMode={editMode}
          />
        </TabsContent>
        <TabsContent value="horaires">
          <HorairesTab 
            employee={updatedEmployee || displayedEmployee} 
            editMode={editMode}
            onScheduleUpdated={handleScheduleUpdated}
          />
        </TabsContent>
        <TabsContent value="competences">
          <CompetencesTab 
            employee={updatedEmployee || displayedEmployee} 
            onEmployeeUpdated={handleCompetencesUpdated}
            editMode={editMode}
          />
        </TabsContent>
        <TabsContent value="conges">
          <CongesTab 
            employee={updatedEmployee || displayedEmployee}
            editMode={editMode}
            onLeavesUpdated={handleLeavesUpdated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfileView;
