
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, X, FileEdit } from 'lucide-react';
import { TimeReport } from '@/types/timesheet';
import { Skeleton } from '@/components/ui/skeleton';

interface TimesheetTableProps {
  timesheets: TimeReport[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading?: boolean;
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ 
  timesheets, 
  onApprove, 
  onReject,
  isLoading = false 
}) => {
  if (isLoading) {
    return <TimesheetTableSkeleton />;
  }

  if (!timesheets.length) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center">
          <FileEdit className="h-12 w-12 text-gray-300" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Aucune feuille de temps</h3>
        <p className="text-muted-foreground mt-2">
          Il n'y a pas encore de feuilles de temps pour cette catégorie
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left font-medium py-3 pl-4">Employé</th>
            <th className="text-left font-medium py-3">Titre</th>
            <th className="text-left font-medium py-3">Période</th>
            <th className="text-left font-medium py-3">Heures</th>
            <th className="text-left font-medium py-3">Statut</th>
            <th className="text-left font-medium py-3">Mise à jour</th>
            <th className="text-right font-medium py-3 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map((timesheet) => (
            <tr key={timesheet.id} className="border-b hover:bg-gray-50">
              <td className="py-3 pl-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {timesheet.employeePhoto ? (
                      <AvatarImage src={timesheet.employeePhoto} alt={timesheet.employeeName} />
                    ) : null}
                    <AvatarFallback>
                      {timesheet.employeeName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{timesheet.employeeName}</span>
                </div>
              </td>
              <td className="py-3">{timesheet.title}</td>
              <td className="py-3 whitespace-nowrap">
                {timesheet.startDate} - {timesheet.endDate}
              </td>
              <td className="py-3">{timesheet.totalHours}h</td>
              <td className="py-3">
                <StatusBadge status={timesheet.status} />
              </td>
              <td className="py-3 text-muted-foreground">{timesheet.lastUpdateText || timesheet.lastUpdated}</td>
              <td className="py-3 pr-4 text-right">
                <div className="flex justify-end gap-2">
                  {timesheet.status === 'Soumis' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 border-green-500 text-green-500 hover:bg-green-50"
                        onClick={() => onApprove(timesheet.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => onReject(timesheet.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8"
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'Validé':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Validé</Badge>;
    case 'Rejeté':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeté</Badge>;
    case 'Soumis':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Soumis</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">En cours</Badge>;
  }
};

const TimesheetTableSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-1/4" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
      
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center justify-between border-b py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimesheetTable;
