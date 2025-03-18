
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { EmployeeAttendance } from '@/types/attendance';

interface AttendanceTableProps {
  attendances: EmployeeAttendance[];
  onValidate: (id: string) => void;
  onReject: (id: string) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ 
  attendances, 
  onValidate, 
  onReject 
}) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Heure d'arrivée</TableHead>
            <TableHead>Heure de départ</TableHead>
            <TableHead>Heures travaillées</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Validation</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((attendance) => (
            <TableRow key={attendance.id}>
              <TableCell className="font-medium">{attendance.employeeName}</TableCell>
              <TableCell>{attendance.date}</TableCell>
              <TableCell>{attendance.arrivalTime}</TableCell>
              <TableCell>{attendance.departureTime}</TableCell>
              <TableCell>{attendance.hoursWorked}</TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={`
                    ${attendance.status === 'Présent' ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                    ${attendance.status === 'Absent' ? 'bg-red-500 text-white hover:bg-red-600' : ''}
                    ${attendance.status === 'Retard' ? 'bg-yellow-500 text-white hover:bg-yellow-600' : ''}
                    ${attendance.status === 'Congé' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                  `}
                >
                  {attendance.status}
                </Badge>
              </TableCell>
              <TableCell>{attendance.validation}</TableCell>
              <TableCell className="space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-green-500 hover:text-green-700 hover:bg-green-50"
                  onClick={() => onValidate(attendance.id)}
                >
                  <Check size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onReject(attendance.id)}
                >
                  <X size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;
