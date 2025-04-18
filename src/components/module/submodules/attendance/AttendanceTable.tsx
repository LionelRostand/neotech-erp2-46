
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Search, FileText, FileCheck, FileX } from 'lucide-react';
import { EmployeeAttendance } from '@/types/attendance';
import { Badge } from '@/components/ui/badge';
import { format, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAttendances = attendances
    .filter(attendance => {
      if (!searchTerm.trim()) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        attendance.employeeName.toLowerCase().includes(searchLower) ||
        attendance.date.toLowerCase().includes(searchLower) ||
        (attendance.employeeId && attendance.employeeId.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      // Tri par date (récent au plus ancien) puis par heure d'arrivée
      const dateComparison = new Date(b.date.split('/').reverse().join('-')).getTime() - 
                            new Date(a.date.split('/').reverse().join('-')).getTime();
      
      if (dateComparison !== 0) return dateComparison;
      
      // Si même date, trier par heure d'arrivée
      return a.arrivalTime.localeCompare(b.arrivalTime);
    });

  const formatDate = (dateStr: string) => {
    try {
      // Si c'est au format JJ/MM/AAAA
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        const date = new Date(`${year}-${month}-${day}`);
        
        if (isToday(date)) {
          return "Aujourd'hui";
        }
        
        return format(date, 'dd MMM yyyy', { locale: fr });
      }
      
      // Si c'est au format ISO
      const date = parseISO(dateStr);
      if (isToday(date)) {
        return "Aujourd'hui";
      }
      return format(date, 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return dateStr;
    }
  };

  const getStatusColor = (status: string, validation: string) => {
    if (validation === 'Rejeté') return "bg-red-100 text-red-800";
    if (validation === 'En attente') return "bg-yellow-100 text-yellow-800";
    if (status === 'Présent') return "bg-green-100 text-green-800";
    if (status === 'Retard') return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un employé..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Employé</TableHead>
              <TableHead className="hidden md:table-cell">Identifiant</TableHead>
              <TableHead>Horaires</TableHead>
              <TableHead className="hidden md:table-cell">Durée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucun enregistrement trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredAttendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell className="font-medium">
                    {formatDate(attendance.date)}
                  </TableCell>
                  <TableCell>{attendance.employeeName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">{attendance.employeeId.slice(0, 8)}...</span>
                      {attendance.employeeId.startsWith('B-') && (
                        <Badge variant="outline" className="mt-1 text-xs">Badge</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-medium text-green-700">Entrée:</span>
                        <span>{attendance.arrivalTime}</span>
                      </div>
                      {attendance.departureTime && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-medium text-red-700">Sortie:</span>
                          <span>{attendance.departureTime}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {attendance.hoursWorked || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(attendance.status, attendance.validation)}
                    >
                      {attendance.validation === 'En attente' 
                        ? 'En attente' 
                        : attendance.validation === 'Rejeté'
                          ? 'Rejeté'
                          : attendance.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {attendance.validation === 'En attente' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onValidate(attendance.id)}
                            title="Valider"
                          >
                            <FileCheck className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button 
                            variant="ghost"
                            size="icon" 
                            onClick={() => onReject(attendance.id)}
                            title="Rejeter"
                          >
                            <FileX className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      {attendance.validation === 'Validé' && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                      {attendance.validation === 'Rejeté' && (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceTable;
