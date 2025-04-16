
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee } from '@/types/employee';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Phone, MapPin, Building, Calendar, Briefcase, Clock, FileText, Award, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatPhoneNumber } from '@/lib/utils';
import { usePermissions } from '@/hooks/usePermissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import EmployeeDocuments from './tabs/EmployeeDocuments';
import EmployeeAbsences from './tabs/EmployeeAbsences';
import EmployeeTrainings from './tabs/EmployeeTrainings';
import EmployeeEvaluations from './tabs/EmployeeEvaluations';
import EmployeeTimesheet from './tabs/EmployeeTimesheet';

interface EmployeeProfileViewProps {
  employee: Employee;
}

interface EmployeeAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({ employee }) => {
  const { checkPermission, isAdmin } = usePermissions('employees-profiles');
  const [canEdit, setCanEdit] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkEditPermission = async () => {
      const hasPermission = await checkPermission('employees-profiles', 'edit');
      setCanEdit(hasPermission || isAdmin);
    };
    
    checkEditPermission();
  }, [checkPermission, isAdmin]);

  const handleEditEmployee = () => {
    navigate(`/modules/employees/profiles/edit/${employee.id}`);
  };

  // Format the address from employee
  const formatAddress = (address?: string | EmployeeAddress) => {
    if (!address) return '—';
    
    if (typeof address === 'string') {
      return address;
    }
    
    const addressObj = address as EmployeeAddress;
    const parts = [
      addressObj.street,
      addressObj.city,
      addressObj.state,
      addressObj.postalCode,
      addressObj.country
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : '—';
  };

  // Determine status badge color
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'actif':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
      case 'inactif':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      case 'onleave':
      case 'en congé':
        return <Badge className="bg-blue-100 text-blue-800">En congé</Badge>;
      case 'suspended':
      case 'suspendu':
        return <Badge className="bg-red-100 text-red-800">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status || 'Inconnu'}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={employee.photoURL || employee.photo} alt={`${employee.firstName} ${employee.lastName}`} />
            <AvatarFallback>{employee.firstName?.charAt(0)}{employee.lastName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {employee.lastName} {employee.firstName}
            </h1>
            <p className="text-gray-500">
              {employee.position || employee.title || 'Poste non spécifié'}
              {employee.department && ` · ${employee.department}`}
            </p>
          </div>
        </div>
        
        {canEdit && (
          <Button onClick={handleEditEmployee} size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{employee.email || '—'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Téléphone</p>
                  <p>{formatPhoneNumber(employee.phone) || '—'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Adresse</p>
                  <p>{formatAddress(employee.address)}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                  <p>{formatDate(employee.birthDate) || '—'}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <Hash className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Matricule</p>
                  <p>{employee.id || '—'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Building className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Département</p>
                  <p>{employee.department || '—'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Briefcase className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Poste</p>
                  <p>{employee.position || employee.title || '—'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <div>{getStatusBadge(employee.status || '')}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="absences">
            <Calendar className="h-4 w-4 mr-2" />
            Absences
          </TabsTrigger>
          <TabsTrigger value="trainings">
            <Award className="h-4 w-4 mr-2" />
            Formations
          </TabsTrigger>
          <TabsTrigger value="evaluations">
            <Award className="h-4 w-4 mr-2" />
            Évaluations
          </TabsTrigger>
          <TabsTrigger value="timesheet">
            <Clock className="h-4 w-4 mr-2" />
            Horaires
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <EmployeeDocuments employeeId={employee.id} />
        </TabsContent>
        
        <TabsContent value="absences">
          <EmployeeAbsences employeeId={employee.id} />
        </TabsContent>
        
        <TabsContent value="trainings">
          <EmployeeTrainings employeeId={employee.id} />
        </TabsContent>
        
        <TabsContent value="evaluations">
          <EmployeeEvaluations employeeId={employee.id} />
        </TabsContent>
        
        <TabsContent value="timesheet">
          <EmployeeTimesheet employeeId={employee.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfileView;
