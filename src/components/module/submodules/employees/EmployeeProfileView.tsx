import React from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, FileText, Mail, Phone, MapPin, Building, Briefcase, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

interface EmployeeProfileViewProps {
  employee: Employee;
  isLoading: boolean;
  onEmployeeUpdated?: () => Promise<void>;
}

const EmployeeProfileView: React.FC<EmployeeProfileViewProps> = ({
  employee,
  isLoading,
  onEmployeeUpdated
}) => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  
  // Check if user is admin
  const isAdmin = userData?.email === 'admin@neotech-consulting.com' || userData?.role === 'admin';
  
  const getStatusColor = (status: string) => {
    status = status?.toLowerCase() || 'active';
    switch (status) {
      case 'active':
      case 'actif':
        return 'bg-green-500';
      case 'inactive':
      case 'inactif':
        return 'bg-red-500';
      case 'on leave':
      case 'en congé':
        return 'bg-yellow-500';
      case 'suspended':
      case 'suspendu':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };
  
  const getFullName = () => {
    return `${employee.firstName || ''} ${employee.lastName || ''}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/modules/employees/profiles')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Profil de l'employé</h1>
        </div>
        
        {isAdmin && (
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        )}
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-32 w-32">
                <AvatarImage src={employee.photoURL || employee.photo} alt={getFullName()} />
                <AvatarFallback className="text-2xl">{getInitials(employee.firstName, employee.lastName)}</AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold">{getFullName()}</h2>
                <p className="text-gray-500">{employee.position}</p>
                <div className="mt-2">
                  <Badge className={getStatusColor(employee.status)}>
                    {employee.status || 'Actif'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations personnelles</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{employee.email || 'Non spécifié'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{employee.phone || 'Non spécifié'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{employee.address || 'Non spécifié'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Intégré le: {employee.startDate ? formatDate(employee.startDate) : 'Non spécifié'}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations professionnelles</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>Département: {employee.department || 'Non spécifié'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>Poste: {employee.position || 'Non spécifié'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Matricule: {employee.employeeNumber || 'Non spécifié'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Here you could add more sections like:
       * - Employee History
       * - Performance reviews
       * - Documents
       * - Leave history 
       * - etc.
       */}
    </div>
  );
};

export default EmployeeProfileView;
