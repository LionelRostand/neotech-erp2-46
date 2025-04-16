
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getEmployee } from './services/employeeService';
import { Employee } from '@/types/employee';
import EmployeeProfileHeader from './EmployeeProfileHeader';
import InformationsTab from './tabs/InformationsTab';
import DocumentsTab from './tabs/DocumentsTab';
import CompetencesTab from './tabs/CompetencesTab';
import AbsencesTab from './tabs/AbsencesTab';
import CongesTab from './tabs/CongesTab';
import HorairesTab from './tabs/HorairesTab';
import EvaluationsTab from './tabs/EvaluationsTab';
import FormationsTab from './tabs/FormationsTab';
import { toast } from 'sonner';
import { updateEmployeeDoc } from '@/services/employeeService';

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('infos');
  const [updatedEmployee, setUpdatedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (id) {
      fetchEmployeeData(id);
    }
  }, [id]);

  // Update the component when updatedEmployee changes
  useEffect(() => {
    if (updatedEmployee) {
      setEmployee(updatedEmployee);
    }
  }, [updatedEmployee]);

  const fetchEmployeeData = async (employeeId: string) => {
    try {
      setLoading(true);
      const data = await getEmployee(employeeId);
      if (data) {
        console.log('Employee data fetched:', data);
        setEmployee(data);
      } else {
        toast.error("Impossible de trouver cet employé");
        navigate('/modules/employees/profiles');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      toast.error("Une erreur s'est produite lors de la récupération des données de l'employé");
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeUpdated = async () => {
    if (id) {
      await fetchEmployeeData(id);
    }
  };

  const handleSaveAddress = async (addressData: any) => {
    if (!employee || !id) return;

    try {
      // Update employee with new address data
      const updatedData = {
        ...employee,
        address: addressData
      };

      const updated = await updateEmployeeDoc(id, updatedData);
      
      if (updated) {
        console.log('Address updated successfully:', updated);
        setUpdatedEmployee(updated);
        toast.success("Adresse mise à jour avec succès");
      } else {
        toast.error("Impossible de mettre à jour l'adresse");
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error("Une erreur s'est produite lors de la mise à jour de l'adresse");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500">
          Employé non trouvé
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <EmployeeProfileHeader employee={employee} />
      
      <Card className="overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 border-b rounded-none">
            <TabsTrigger value="infos">Informations</TabsTrigger>
            <TabsTrigger value="docs">Documents</TabsTrigger>
            <TabsTrigger value="competences">Compétences</TabsTrigger>
            <TabsTrigger value="absences">Absences</TabsTrigger>
            <TabsTrigger value="conges">Congés</TabsTrigger>
            <TabsTrigger value="horaires">Horaires</TabsTrigger>
            <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
            <TabsTrigger value="formations">Formations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="infos">
            <InformationsTab 
              employee={employee} 
              onAddressUpdated={handleSaveAddress}
            />
          </TabsContent>
          
          <TabsContent value="docs">
            <DocumentsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="competences">
            <CompetencesTab 
              employee={employee} 
              onEmployeeUpdated={handleEmployeeUpdated} 
            />
          </TabsContent>
          
          <TabsContent value="absences">
            <AbsencesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="conges">
            <CongesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="horaires">
            <HorairesTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="evaluations">
            <EvaluationsTab employee={employee} />
          </TabsContent>
          
          <TabsContent value="formations">
            <FormationsTab employee={employee} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default EmployeeDetails;
