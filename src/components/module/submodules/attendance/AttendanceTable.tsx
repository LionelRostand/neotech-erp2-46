
import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmployeeAttendance } from '@/types/attendance';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface AttendanceTableProps {
  data: EmployeeAttendance[];
  onValidate: (id: string, validated: boolean) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ data, onValidate }) => {
  const formatDate = (dateString: string) => {
    // Format date as YYYY-MM-DD
    return dateString;
  };

  return (
    <div className="w-full overflow-auto">
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
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                Aucune donnée de présence disponible
              </TableCell>
            </TableRow>
          ) : (
            data.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.employeeName}</TableCell>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>{record.startTime}</TableCell>
                <TableCell>{record.endTime}</TableCell>
                <TableCell>{record.hoursWorked}</TableCell>
                <TableCell>
                  <StatusBadge status={record.status} />
                </TableCell>
                <TableCell>
                  {record.validated === true ? (
                    <span className="text-green-500 font-medium">Validé</span>
                  ) : record.validated === false ? (
                    <span className="text-red-500 font-medium">Rejeté</span>
                  ) : (
                    <span className="text-gray-500 font-medium">En attente</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-500 hover:text-green-600 hover:bg-green-50"
                      onClick={() => onValidate(record.id, true)}
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onValidate(record.id, false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const StatusBadge: React.FC<{ status: EmployeeAttendance['status'] }> = ({ status }) => {
  return (
    <Badge
      className={cn(
        "rounded-full px-3",
        status === 'Présent' && "bg-green-500 hover:bg-green-600",
        status === 'Absent' && "bg-red-500 hover:bg-red-600",
        status === 'Retard' && "bg-amber-500 hover:bg-amber-600"
      )}
    >
      {status}
    </Badge>
  );
};

export default AttendanceTable;
