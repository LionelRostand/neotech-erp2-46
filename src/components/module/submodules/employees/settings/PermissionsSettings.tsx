
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployeesPermissions } from '@/hooks/useEmployeesPermissions';
import { ScrollArea } from "@/components/ui/scroll-area";

const PermissionsSettings: React.FC = () => {
  const { employees } = useEmployeesPermissions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{employee.firstName} {employee.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{employee.email}</p>
                </div>
                <ManagePermissionsDialog 
                  employeeId={employee.id}
                  employeeName={`${employee.firstName} ${employee.lastName}`}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PermissionsSettings;
