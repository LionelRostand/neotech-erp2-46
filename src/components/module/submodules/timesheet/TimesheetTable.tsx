
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DataTable } from '@/components/ui/data-table';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';
import { getInitials } from '@/lib/utils';
import { TimeReport } from '@/types/timesheet';
import TimeSheetDetails from './TimeSheetDetails';
import DeleteTimeSheetDialog from './DeleteTimeSheetDialog';

interface TimesheetTableProps {
  data: TimeReport[];
  isLoading: boolean;
  onRefresh?: () => void;
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ data = [], isLoading, onRefresh }) => {
  // Ensure we have a valid array of data
  const safeData = Array.isArray(data) ? data : [];
  
  const { isAdmin } = useEmployeePermissions('employees-timesheet');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTimeSheet, setSelectedTimeSheet] = useState<TimeReport | null>(null);

  const handleView = (timesheet: TimeReport) => {
    setSelectedTimeSheet(timesheet);
    setDetailsDialogOpen(true);
  };

  const handleDelete = (timesheet: TimeReport) => {
    setSelectedTimeSheet(timesheet);
    setDeleteDialogOpen(true);
  };

  // Format date safely
  const formatDateSafely = (dateStr: string) => {
    if (!dateStr) return "Date invalide";
    try {
      return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: fr });
    } catch (err) {
      console.error("Date parsing error:", err);
      return "Date invalide";
    }
  };

  // Status badge colors
  const statusColors: Record<string, string> = {
    'En cours': 'bg-blue-100 text-blue-800',
    'Soumis': 'bg-amber-100 text-amber-800',
    'Validé': 'bg-green-100 text-green-800',
    'Rejeté': 'bg-red-100 text-red-800'
  };

  const columns = [
    {
      header: "Employé",
      accessorKey: "employeeId",
      cell: ({ row }: any) => {
        const timesheet = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {timesheet.employeePhoto ? (
                <AvatarImage src={timesheet.employeePhoto} alt={timesheet.employeeName || ''} />
              ) : (
                <AvatarFallback>{getInitials(timesheet.employeeName || 'Employé')}</AvatarFallback>
              )}
            </Avatar>
            <span>{timesheet.employeeName || 'Employé'}</span>
          </div>
        );
      }
    },
    {
      header: "Titre",
      accessorKey: "title"
    },
    {
      header: "Période",
      cell: ({ row }: any) => {
        const timesheet = row.original;
        return (
          <div>
            {formatDateSafely(timesheet.startDate || '')} - {formatDateSafely(timesheet.endDate || '')}
          </div>
        );
      }
    },
    {
      header: "Heures",
      accessorKey: "totalHours",
      cell: ({ row }: any) => {
        const hours = row.original.totalHours || 0;
        return <span>{hours}h</span>;
      }
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }: any) => {
        const status = row.original.status || 'En cours';
        return (
          <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
            {status}
          </Badge>
        );
      }
    },
    {
      header: "Dernière mise à jour",
      accessorKey: "lastUpdateText"
    },
    {
      header: "Actions",
      cell: ({ row }: any) => {
        const timesheet = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(timesheet)}>
              <Eye className="h-4 w-4" />
            </Button>
            {isAdmin && (
              <Button variant="ghost" size="icon" onClick={() => handleDelete(timesheet)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <>
      <DataTable 
        columns={columns} 
        data={safeData} 
        isLoading={isLoading}
        emptyMessage="Aucune feuille de temps trouvée" 
      />

      {selectedTimeSheet && (
        <TimeSheetDetails
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          timeSheet={selectedTimeSheet}
          onSuccess={onRefresh || (() => {})}
        />
      )}

      {selectedTimeSheet && (
        <DeleteTimeSheetDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          timeSheet={selectedTimeSheet}
          onSuccess={onRefresh || (() => {})}
        />
      )}
    </>
  );
};

export default TimesheetTable;
