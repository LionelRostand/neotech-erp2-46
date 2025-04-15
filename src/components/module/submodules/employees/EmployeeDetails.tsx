import React, { useState } from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, File, Download, User, Mail, Phone, Briefcase, Building2, Calendar, Badge as BadgeIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { EditEmployeeDialog } from './EditEmployeeDialog';
import { Badge } from '@/components/ui/badge';

interface EmployeeDetailsProps {
  employee: Employee;
  onExportPdf: () => void;
  onEdit?: () => void;
  onEmployeeUpdate?: (updatedEmployee: Employee) => void;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employee, onExportPdf, onEdit, onEmployeeUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
      case 'Actif':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'onLeave':
      case 'En congé':
        return <Badge className="bg-blue-500">En congé</Badge>;
      case 'inactive':
      case 'Inactif':
        return <Badge className="bg-gray-500">Inactif</Badge>;
      case 'Suspendu':
        return <Badge className="bg-yellow-500">Suspendu</Badge>;
      default:
        return <Badge className="bg-gray-500">Non défini</Badge>;
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Profil de l'employé</CardTitle>
          <div className="space-x-2">
            <Button variant="ghost" onClick={onExportPdf}>
              <File className="mr-2 h-4 w-4" />
              Exporter PDF
            </Button>
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="md:flex gap-4">
            <div className="md:w-1/3 flex flex-col items-center md:items-start">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={employee.photoURL || employee.photo} alt={`${employee.firstName} ${employee.lastName}`} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-semibold">{employee.firstName} {employee.lastName}</CardTitle>
              <CardDescription className="text-gray-500">{employee.position || employee.title}</CardDescription>
              {getStatusBadge(employee.status)}
            </div>
            <div className="md:w-2/3">
              <div className="grid gap-4">
                <div className="border p-4 rounded-md">
                  <h4 className="text-lg font-semibold mb-2">Informations personnelles</h4>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>{employee.position || employee.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Date d'embauche: {employee.hireDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeIcon className="h-4 w-4 text-gray-500" />
                    <span>Statut: {employee.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditEmployeeDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        employee={employee}
        onEmployeeUpdate={onEmployeeUpdate}
      />
    </>
  );
};

export default EmployeeDetails;
