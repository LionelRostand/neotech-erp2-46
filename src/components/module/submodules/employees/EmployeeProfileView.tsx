
import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Mail, MapPin, Building, FileEdit, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DocumentsTab from './tabs/DocumentsTab';
import AbsencesTab from './tabs/AbsencesTab';
import FormationsTab from './tabs/FormationsTab';
import EvaluationsTab from './tabs/EvaluationsTab';
import HorairesTab from './tabs/HorairesTab';
import { toast } from 'sonner';
import { useEmployeePermissions } from './hooks/useEmployeePermissions';

interface EmployeeProfileViewProps {
  employee: Employee;
  isLoading?: boolean;
  onEmployeeUpdated?: () => void;
}

const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  employee,
  isLoading = false,
  onEmployeeUpdated
}) => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const { canEdit, isAdmin } = useEmployeePermissions('employees-profiles', employee.id);
  
  // Function to handle the edit button click
  const handleEditClick = () => {
    navigate(`/modules/employees/profiles/edit/${employee.id}`);
    toast.info("Mode édition activé");
  };
  
  const getStatusBadge = (status: string) => {
    const lowerStatus = status?.toLowerCase?.() || '';
    
    if (lowerStatus.includes('actif') || lowerStatus === 'active') {
      return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    } else if (lowerStatus.includes('inactif') || lowerStatus === 'inactive') {
      return <Badge className="bg-red-100 text-red-800">Inactif</Badge>;
    } else if (lowerStatus.includes('congé') || lowerStatus === 'onleave') {
      return <Badge className="bg-blue-100 text-blue-800">En congé</Badge>;
    } else if (lowerStatus.includes('suspendu') || lowerStatus === 'suspended') {
      return <Badge className="bg-yellow-100 text-yellow-800">Suspendu</Badge>;
    } else {
      return <Badge variant="outline">{status || 'Non défini'}</Badge>;
    }
  };
  
  // Function to get user initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Profil de {employee.firstName} {employee.lastName}</h2>
        
        {/* Edit button - Now enabled based on permissions */}
        <Button 
          onClick={handleEditClick} 
          variant="outline"
          disabled={!canEdit && !isAdmin}
        >
          <FileEdit className="mr-2 h-4 w-4" /> Modifier
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employee.photoURL} alt={`${employee.firstName} ${employee.lastName}`} />
                <AvatarFallback className="text-lg">
                  {getInitials(employee.firstName || '', employee.lastName || '')}
                </AvatarFallback>
              </Avatar>
              {getStatusBadge(employee.status || '')}
              <span className="text-sm text-muted-foreground">
                {employee.position || 'Poste non spécifié'}
              </span>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-medium flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" /> Nom complet
                </span>
                <span className="text-base">{employee.firstName} {employee.lastName}</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-sm font-medium flex items-center text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" /> Email
                </span>
                <span className="text-base">{employee.email || 'Non spécifié'}</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-sm font-medium flex items-center text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" /> Téléphone
                </span>
                <span className="text-base">{employee.phone || 'Non spécifié'}</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-sm font-medium flex items-center text-muted-foreground">
                  <Building className="mr-2 h-4 w-4" /> Département
                </span>
                <span className="text-base">{employee.department || 'Non spécifié'}</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-sm font-medium flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" /> Adresse
                </span>
                <span className="text-base">
                  {employee.address ? 
                    typeof employee.address === 'string' ? 
                      employee.address : 
                      `${employee.address.street || ''}, ${employee.address.city || ''}, ${employee.address.zipCode || ''}` 
                    : 'Non spécifiée'
                  }
                </span>
              </div>
              
              <div className="space-y-1">
                <span className="text-sm font-medium flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" /> Numéro d'employé
                </span>
                <span className="text-base">{employee.employeeNumber || 'Non spécifié'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="absences">Absences</TabsTrigger>
          <TabsTrigger value="formations">Formations</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations</TabsTrigger>
          <TabsTrigger value="horaires">Horaires</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ajoutez ici plus d'informations détaillées si nécessaire */}
                <p className="text-gray-500">Informations supplémentaires non disponibles</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <DocumentsTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="absences" className="mt-6">
          <AbsencesTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="formations" className="mt-6">
          <FormationsTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="evaluations" className="mt-6">
          <EvaluationsTab employee={employee} />
        </TabsContent>
        
        <TabsContent value="horaires" className="mt-6">
          <HorairesTab employee={employee} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfileView;
