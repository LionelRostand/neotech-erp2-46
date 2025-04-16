
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Users, UserCheck, Clock, Calendar } from 'lucide-react';

const EmployeesDashboardCards = () => {
  const { employees, leaveRequests, absenceRequests } = useHrModuleData();
  
  // Calculate active employees
  const activeEmployees = employees.filter(emp => emp.status === 'active' || emp.status === 'Actif').length;
  
  // Calculate employees on leave
  const onLeaveEmployees = employees.filter(emp => emp.status === 'onLeave' || emp.status === 'En congé').length;
  
  // Calculate pending leave requests
  const pendingLeaveRequests = Array.isArray(leaveRequests) 
    ? leaveRequests.filter(req => req.status === 'pending').length
    : 0;
  
  // Calculate pending absence requests
  const pendingAbsenceRequests = Array.isArray(absenceRequests)
    ? absenceRequests.filter(req => req.status === 'pending').length
    : 0;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Employés actifs</p>
              <h3 className="text-2xl font-bold">{activeEmployees}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">En congé</p>
              <h3 className="text-2xl font-bold">{onLeaveEmployees}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Demandes de congés</p>
              <h3 className="text-2xl font-bold">{pendingLeaveRequests}</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-full">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Demandes d'absence</p>
              <h3 className="text-2xl font-bold">{pendingAbsenceRequests}</h3>
            </div>
            <div className="p-2 bg-orange-100 rounded-full">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesDashboardCards;
