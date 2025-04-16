
import React, { useState } from 'react';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  ClipboardIcon, 
  UserIcon, 
  Building2, 
  GraduationCap,
  Clock,
  FileText,
  Edit,
  ArrowLeft
} from 'lucide-react';
import { Employee } from '@/types/employee';
import { useNavigate } from 'react-router-dom';
import InformationsTab from './tabs/InformationsTab';
import CompetencesTab from './tabs/CompetencesTab';
import CongesTab from './tabs/CongesTab';
import HorairesTab from './tabs/HorairesTab';

interface EmployeeProfileViewProps {
  employee: Employee;
  onBackClick: () => void;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
}

const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({ 
  employee, 
  onBackClick,
  onEmployeeUpdated
}) => {
  const navigate = useNavigate();
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(employee);
  
  // Handle employee updates from tabs
  const handleEmployeeUpdated = (updatedEmployee: Employee) => {
    setCurrentEmployee(updatedEmployee);
    if (onEmployeeUpdated) {
      onEmployeeUpdated(updatedEmployee);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onBackClick}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <h2 className="text-2xl font-bold">
            {currentEmployee.firstName} {currentEmployee.lastName}
          </h2>
          
          <Badge 
            variant={
              currentEmployee.status === 'active' || currentEmployee.status === 'Actif' 
                ? 'success' 
                : 'destructive'
            }
          >
            {currentEmployee.status === 'active' || currentEmployee.status === 'Actif' 
              ? 'Actif' 
              : currentEmployee.status || 'Non spécifié'
            }
          </Badge>
        </div>
        
        <Button 
          onClick={() => navigate(`/modules/employees/edit/${currentEmployee.id}`)}
          variant="outline"
        >
          <Edit className="h-4 w-4 mr-2" />
          Éditer le profil
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted mb-4">
              {currentEmployee.photoURL ? (
                <img 
                  src={currentEmployee.photoURL} 
                  alt={`${currentEmployee.firstName} ${currentEmployee.lastName}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <UserIcon className="h-16 w-16 text-primary/40" />
                </div>
              )}
            </div>
            
            <h3 className="text-xl font-bold">
              {currentEmployee.firstName} {currentEmployee.lastName}
            </h3>
            
            <p className="text-muted-foreground">
              {currentEmployee.position || 'Poste non spécifié'}
            </p>
            
            <div className="w-full border-t my-4"></div>
            
            <div className="w-full space-y-3">
              <div className="flex items-start">
                <Building2 className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Département</p>
                  <p className="text-sm text-muted-foreground">
                    {currentEmployee.department || 'Non spécifié'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <ClipboardIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Contrat</p>
                  <p className="text-sm text-muted-foreground">
                    {currentEmployee.contract || 'Non spécifié'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date d'embauche</p>
                  <p className="text-sm text-muted-foreground">
                    {currentEmployee.hireDate || 'Non spécifiée'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="informations">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="informations">
                <UserIcon className="h-4 w-4 mr-2" />
                Informations
              </TabsTrigger>
              <TabsTrigger value="competences">
                <GraduationCap className="h-4 w-4 mr-2" />
                Compétences
              </TabsTrigger>
              <TabsTrigger value="conges">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Congés
              </TabsTrigger>
              <TabsTrigger value="horaires">
                <Clock className="h-4 w-4 mr-2" />
                Horaires
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="informations">
              <InformationsTab 
                employee={currentEmployee} 
                onEmployeeUpdated={handleEmployeeUpdated}
              />
            </TabsContent>
            
            <TabsContent value="competences">
              <CompetencesTab employee={currentEmployee} />
            </TabsContent>
            
            <TabsContent value="conges">
              <CongesTab employee={currentEmployee} />
            </TabsContent>
            
            <TabsContent value="horaires">
              <HorairesTab employee={currentEmployee} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileView;
