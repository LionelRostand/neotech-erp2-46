
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Building, Briefcase, Calendar } from 'lucide-react';
import { Employee } from '@/types/employee';

interface EmployeeProfileHeaderProps {
  employee: Employee;
}

const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({ employee }) => {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo et infos de base */}
          <div className="flex flex-col items-center md:items-start space-y-4 md:w-1/4">
            <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <User size={64} />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
              <p className="text-gray-500">{employee.position}</p>
              <Badge className={`mt-2 ${employee.status === 'Actif' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}`}>
                {employee.status}
              </Badge>
            </div>
          </div>
          
          {/* Coordonnées et informations professionnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:w-3/4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-400" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{employee.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-gray-400" />
              <span>{employee.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <span>{employee.contract}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span>Embauché le {employee.hireDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeProfileHeader;
