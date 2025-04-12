
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import LeaveBalanceCards from './LeaveBalanceCards';
import { Download, Filter } from 'lucide-react';

export const LeaveBalances: React.FC = () => {
  const { employees } = useHrModuleData();
  const [year, setYear] = useState<Date>(new Date());
  
  // Données fictives pour les soldes de congés
  const employeeBalances = employees?.map(employee => {
    // Générer des données aléatoires pour la démonstration
    const randomPaidLeave = 25;
    const randomPaidLeaveUsed = Math.floor(Math.random() * randomPaidLeave);
    const randomRtt = 12;
    const randomRttUsed = Math.floor(Math.random() * randomRtt);
    
    return {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      paidLeave: randomPaidLeave,
      paidLeaveUsed: randomPaidLeaveUsed,
      paidLeaveRemaining: randomPaidLeave - randomPaidLeaveUsed,
      rtt: randomRtt,
      rttUsed: randomRttUsed,
      rttRemaining: randomRtt - randomRttUsed,
      sickLeave: 3,
      sickLeaveUsed: Math.floor(Math.random() * 2),
      otherLeave: 5,
      otherLeaveUsed: Math.floor(Math.random() * 3)
    };
  }) || [];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
        <div className="space-y-2">
          <Label>Année</Label>
          <DatePicker 
            date={year}
            onSelect={setYear}
            disabled={false}
            placeholder="Sélectionner une année"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>
      
      <LeaveBalanceCards />
      
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Département</TableHead>
                <TableHead className="text-center">Congés payés</TableHead>
                <TableHead className="text-center">RTT</TableHead>
                <TableHead className="text-center">Maladie</TableHead>
                <TableHead className="text-center">Autres</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeBalances.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col">
                      <span className="font-medium text-green-600">{employee.paidLeaveRemaining}</span>
                      <span className="text-xs text-gray-500">
                        {employee.paidLeaveUsed} utilisés / {employee.paidLeave} total
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col">
                      <span className="font-medium text-green-600">{employee.rttRemaining}</span>
                      <span className="text-xs text-gray-500">
                        {employee.rttUsed} utilisés / {employee.rtt} total
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col">
                      <span className="font-medium text-green-600">{employee.sickLeave - employee.sickLeaveUsed}</span>
                      <span className="text-xs text-gray-500">
                        {employee.sickLeaveUsed} utilisés / {employee.sickLeave} total
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col">
                      <span className="font-medium text-green-600">{employee.otherLeave - employee.otherLeaveUsed}</span>
                      <span className="text-xs text-gray-500">
                        {employee.otherLeaveUsed} utilisés / {employee.otherLeave} total
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
