
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TimeReport, TimeReportStatus } from '@/types/timesheet';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, FileEdit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface TimeReportsTableProps {
  reports: TimeReport[];
}

const TimeReportsTable: React.FC<TimeReportsTableProps> = ({ reports }) => {
  const getStatusBadgeColor = (status: TimeReportStatus) => {
    switch (status) {
      case "En cours":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Soumis":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Validé":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Rejeté":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Employé</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Heures</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dernière mise à jour</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.title}</TableCell>
              <TableCell>{report.employeeName}</TableCell>
              <TableCell>
                {formatDate(report.startDate)} - {formatDate(report.endDate)}
              </TableCell>
              <TableCell>{report.totalHours}h</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(report.status)}>
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(report.lastUpdated)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Visualiser</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center">
                      <FileEdit className="mr-2 h-4 w-4" />
                      <span>Modifier</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TimeReportsTable;
