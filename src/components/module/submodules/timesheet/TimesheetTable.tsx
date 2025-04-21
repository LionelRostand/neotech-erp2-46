
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
  Eye, 
  FileEdit, 
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TimeReport, TimeReportStatus } from '@/types/timesheet';
import { formatDate } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

interface TimesheetTableProps {
  data: TimeReport[];
  isLoading?: boolean;
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ 
  data,
  isLoading = false
}) => {
  const [sortColumn, setSortColumn] = useState<keyof TimeReport>('lastUpdated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getStatusIcon = (status: TimeReportStatus) => {
    switch (status) {
      case "En cours":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "Soumis":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "Validé":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Rejeté":
        return <Ban className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

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

  const handleSort = (column: keyof TimeReport) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let valueA = a[sortColumn];
    let valueB = b[sortColumn];

    // Handle date strings
    if (typeof valueA === 'string' && (
      sortColumn === 'lastUpdated' || 
      sortColumn === 'startDate' || 
      sortColumn === 'endDate'
    )) {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB as string).getTime();
    }

    if (valueA === valueB) return 0;
    
    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Function to get avatar colors based on employee name
  const getAvatarColors = (name?: string): string => {
    if (!name) return 'bg-gray-400'; // Default color for undefined names
    
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
    ];
    
    // Simple hash function to get consistent color for names
    const hash = name.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  if (isLoading) {
    return (
      <div className="rounded-md border p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
        <p className="text-center mt-4 text-gray-500">Chargement des feuilles de temps...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-md border p-8">
        <p className="text-center text-gray-500">Aucune feuille de temps disponible</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]"></TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('title')}
            >
              Titre {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('employeeName')}
            >
              Employé {sortColumn === 'employeeName' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('startDate')}
            >
              Période {sortColumn === 'startDate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('totalHours')}
            >
              Heures {sortColumn === 'totalHours' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('status')}
            >
              Statut {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('lastUpdated')}
            >
              Mise à jour {sortColumn === 'lastUpdated' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((report) => (
            <TableRow key={report.id} className="hover:bg-gray-50">
              <TableCell>
                <Avatar className="h-8 w-8">
                  {report.employeePhoto ? (
                    <AvatarImage src={report.employeePhoto} alt={report.employeeName || 'Employé'} />
                  ) : (
                    <AvatarFallback className={getAvatarColors(report.employeeName)}>
                      {getInitials(report.employeeName || '')}
                    </AvatarFallback>
                  )}
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{report.title}</TableCell>
              <TableCell>{report.employeeName || 'Employé inconnu'}</TableCell>
              <TableCell className="whitespace-nowrap">
                {formatDate(new Date(report.startDate))} - {formatDate(new Date(report.endDate))}
              </TableCell>
              <TableCell>{report.totalHours}h</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(report.status)}
                  <Badge className={getStatusBadgeColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {report.lastUpdateText || formatDate(new Date(report.lastUpdated))}
              </TableCell>
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

export default TimesheetTable;
