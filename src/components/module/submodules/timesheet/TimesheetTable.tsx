import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Eye, 
  FileEdit, 
  ThumbsUp, 
  ThumbsDown,
  SendHorizonal
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TimeReport, TimeReportStatus } from '@/types/timesheet';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import TimesheetDetailsDialog from './TimesheetDetailsDialog';

interface TimesheetTableProps {
  data: TimeReport[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onSubmit?: (id: string) => void;
  isLoading?: boolean;
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ 
  data, 
  onView, 
  onEdit, 
  onApprove, 
  onReject,
  onSubmit,
  isLoading
}) => {
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimeReport | null>(null);
  
  const getStatusBadge = (status: TimeReportStatus) => {
    switch (status) {
      case "En cours":
        return <Badge className="bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100">En cours</Badge>;
      case "Soumis":
        return <Badge className="bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100">Soumis</Badge>;
      case "Validé":
        return <Badge className="bg-green-50 text-green-800 border border-green-200 hover:bg-green-100">Validé</Badge>;
      case "Rejeté":
        return <Badge className="bg-red-50 text-red-800 border border-red-200 hover:bg-red-100">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateValue = (dateValue: any): string => {
    if (!dateValue) return '';
    
    if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
      return new Date(dateValue.seconds * 1000).toLocaleDateString('fr');
    }
    
    if (typeof dateValue === 'string') {
      try {
        return new Date(dateValue).toLocaleDateString('fr');
      } catch (e) {
        return dateValue;
      }
    }
    
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString('fr');
    }
    
    return String(dateValue);
  };

  const handleView = (timesheet: TimeReport) => {
    setSelectedTimesheet(timesheet);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-gray-600">Employé</TableHead>
              <TableHead className="text-gray-600">Période</TableHead>
              <TableHead className="hidden md:table-cell text-gray-600">Titre</TableHead>
              <TableHead className="text-center text-gray-600">Heures</TableHead>
              <TableHead className="text-center text-gray-600">Statut</TableHead>
              <TableHead className="hidden md:table-cell text-gray-600">Mise à jour</TableHead>
              <TableHead className="text-right text-gray-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Aucune feuille de temps trouvée.
                </TableCell>
              </TableRow>
            ) : (
              data.map((report) => (
                <TableRow key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 border">
                        <AvatarImage src={report.employeePhoto} alt={report.employeeName} />
                        <AvatarFallback className="bg-blue-100 text-blue-800">
                          {report.employeeName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-700">{report.employeeName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDateValue(report.startDate)} - {formatDateValue(report.endDate)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-gray-600">
                    {report.title}
                  </TableCell>
                  <TableCell className="text-center font-medium text-gray-700">
                    {report.totalHours}h
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(report.status)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-gray-500">
                    {report.lastUpdateText || formatDateValue(report.lastUpdated)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(report)} className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" /> Voir
                        </DropdownMenuItem>
                        {(onEdit && report.status !== "Validé") && (
                          <DropdownMenuItem onClick={() => onEdit(report.id)} className="cursor-pointer">
                            <FileEdit className="mr-2 h-4 w-4" /> Modifier
                          </DropdownMenuItem>
                        )}
                        {(onSubmit && report.status === "En cours") && (
                          <DropdownMenuItem onClick={() => onSubmit(report.id)} className="cursor-pointer">
                            <SendHorizonal className="mr-2 h-4 w-4" /> Soumettre
                          </DropdownMenuItem>
                        )}
                        {(onApprove && report.status === "Soumis") && (
                          <DropdownMenuItem onClick={() => onApprove(report.id)} className="cursor-pointer text-green-600 hover:text-green-700">
                            <ThumbsUp className="mr-2 h-4 w-4" /> Valider
                          </DropdownMenuItem>
                        )}
                        {(onReject && report.status === "Soumis") && (
                          <DropdownMenuItem onClick={() => onReject(report.id)} className="cursor-pointer text-red-600 hover:text-red-700">
                            <ThumbsDown className="mr-2 h-4 w-4" /> Rejeter
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TimesheetDetailsDialog
        timesheet={selectedTimesheet}
        open={!!selectedTimesheet}
        onClose={() => setSelectedTimesheet(null)}
      />
    </>
  );
};

export default TimesheetTable;
