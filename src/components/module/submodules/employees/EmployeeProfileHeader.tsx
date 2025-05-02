
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PencilIcon, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Employee } from '@/types/employee';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InformationsTab from './tabs/InformationsTab';
import CompetencesTab from './tabs/CompetencesTab';
import AbsencesTab from './tabs/AbsencesTab';
import HorairesTab from './tabs/HorairesTab';
import CongesTab from './tabs/CongesTab';
import EvaluationsTab from './tabs/EvaluationsTab';
import ExportEmployeePdfButton from './components/ExportEmployeePdfButton';
import { StatusBadge } from '@/components/module/submodules/StatusBadge';
import EditEmployeeInfoDialog from './dialogs/EditEmployeeInfoDialog';

interface EmployeeProfileHeaderProps {
  employee: Employee;
  onEdit?: () => void;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ employee, onEdit }) => {
  const [activeTab, setActiveTab] = useState("informations");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(employee);
  
  const getStatusVariant = () => {
    const status = employee.status?.toLowerCase() || '';
    if (status.includes('active') || status.includes('actif')) return "success";
    if (status.includes('leave') || status.includes('congé')) return "warning";
    return "default";
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEmployeeUpdate = (updatedEmployee: Employee) => {
    setCurrentEmployee(updatedEmployee);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Employee header with back button */}
      <div className="flex justify-between items-center">
        <Link to="/modules/employees/profiles">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour à la liste
          </Button>
        </Link>
        
        <div className="flex items-center space-x-2">
          <ExportEmployeePdfButton employee={currentEmployee} />
          
          <Button size="sm" onClick={handleEditClick}>
            <PencilIcon className="h-4 w-4 mr-1" />
            Modifier
          </Button>
        </div>
      </div>
      
      {/* Employee profile banner */}
      <div className="bg-white rounded-lg border p-6 flex flex-col md:flex-row gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={currentEmployee.photoURL || currentEmployee.photo || ''} alt={`${currentEmployee.firstName} ${currentEmployee.lastName}`} />
          <AvatarFallback className="text-lg">{currentEmployee.firstName?.[0]}{currentEmployee.lastName?.[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-grow space-y-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h1 className="text-2xl font-bold">
              {currentEmployee.firstName} {currentEmployee.lastName}
            </h1>
            <StatusBadge 
              status={currentEmployee.status || 'Actif'}
              variant={getStatusVariant()}
            >
              {currentEmployee.status || 'Actif'}
            </StatusBadge>
          </div>
          <p className="text-gray-500">{currentEmployee.position || currentEmployee.role || 'Non spécifié'}</p>
          <p className="text-gray-500">{currentEmployee.department || 'Département non spécifié'}</p>
          <div className="pt-2 flex flex-wrap gap-2">
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-1" />
              <span>ID: {currentEmployee.id?.substring(0, 8) || 'Non disponible'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="competences">Compétences</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
          <TabsTrigger value="absences">Absences</TabsTrigger>
          <TabsTrigger value="conges">Congés</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="informations">
            <InformationsTab employee={currentEmployee} />
          </TabsContent>
          
          <TabsContent value="competences">
            <CompetencesTab employee={currentEmployee} />
          </TabsContent>
          
          <TabsContent value="horaires">
            <HorairesTab employee={currentEmployee} />
          </TabsContent>
          
          <TabsContent value="absences">
            <AbsencesTab employee={currentEmployee} />
          </TabsContent>
          
          <TabsContent value="conges">
            <CongesTab employee={currentEmployee} />
          </TabsContent>
          
          <TabsContent value="evaluations">
            <EvaluationsTab employee={currentEmployee} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Dialog d'édition */}
      <EditEmployeeInfoDialog 
        employee={currentEmployee}
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEmployeeUpdate}
      />
    </div>
  );
};

export default EmployeeProfileHeader;
