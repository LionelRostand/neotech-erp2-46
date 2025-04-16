
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
import { AlertCircle, Edit, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmployeeService } from '@/hooks/useEmployeeService';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { employeeFormSchema, EmployeeFormValues } from './form/employeeFormSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';

const EmployeeProfileView: React.FC<{ employee?: Employee; isLoading?: boolean }> = ({ 
  employee,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const { updateEmployee, isLoading: isUpdating } = useEmployeeService();
  
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

  // Initialize form with employee data
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: displayedEmployee.firstName,
      lastName: displayedEmployee.lastName,
      email: displayedEmployee.email,
      phone: displayedEmployee.phone || '',
      position: displayedEmployee.position || '',
      department: displayedEmployee.department || '',
      streetNumber: typeof displayedEmployee.address === 'object' ? displayedEmployee.address.street?.split(' ')[0] || '' : '',
      streetName: typeof displayedEmployee.address === 'object' ? displayedEmployee.address.street?.split(' ').slice(1).join(' ') || '' : '',
      city: typeof displayedEmployee.address === 'object' ? displayedEmployee.address.city || '' : '',
      zipCode: typeof displayedEmployee.address === 'object' ? displayedEmployee.address.postalCode || '' : '',
      region: typeof displayedEmployee.address === 'object' ? displayedEmployee.address.state || '' : '',
      contract: displayedEmployee.contract || '',
      status: displayedEmployee.status,
      managerId: displayedEmployee.managerId || '',
      forceManager: displayedEmployee.isManager || false,
    }
  });

  // Handle form submission
  const handleSubmit = async (values: EmployeeFormValues) => {
    try {
      // Create address object from form values
      const address = {
        street: `${values.streetNumber} ${values.streetName}`.trim(),
        city: values.city,
        postalCode: values.zipCode,
        country: 'France',
        state: values.region
      };

      // Prepare update data
      const updateData = {
        ...values,
        address
      };

      // Update employee
      if (employeeId) {
        await updateEmployee(employeeId, updateData);
        setIsEditing(false);
        toast.success('Informations de l\'employé mises à jour avec succès');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Erreur lors de la mise à jour des informations');
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
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
            {(canEdit || isOwnProfile) && (
              <Button 
                variant={isEditing ? "default" : "outline"} 
                className="ml-auto"
                onClick={toggleEditMode}
                disabled={isUpdating}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Terminer
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Tabs defaultValue="informations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="informations">Informations</TabsTrigger>
              <TabsTrigger value="horaires">Horaires et présence</TabsTrigger>
              <TabsTrigger value="competences">Compétences</TabsTrigger>
              <TabsTrigger value="conges">Congés</TabsTrigger>
            </TabsList>
            <TabsContent value="informations">
              <InformationsTab 
                employee={displayedEmployee} 
                isEditing={isEditing}
                onFinishEditing={() => setIsEditing(false)}
                form={form}
                showManagerOption={true}
              />
            </TabsContent>
            <TabsContent value="horaires">
              <HorairesTab employee={displayedEmployee} isEditing={false} onFinishEditing={() => {}} />
            </TabsContent>
            <TabsContent value="competences">
              <CompetencesTab employee={displayedEmployee} onEmployeeUpdated={() => {}} />
            </TabsContent>
            <TabsContent value="conges">
              <CongesTab employee={displayedEmployee} />
            </TabsContent>
          </Tabs>
          
          {isEditing && (
            <div className="flex justify-end mt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="mr-2"
                onClick={() => setIsEditing(false)}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isUpdating}
              >
                {isUpdating ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default EmployeeProfileView;
