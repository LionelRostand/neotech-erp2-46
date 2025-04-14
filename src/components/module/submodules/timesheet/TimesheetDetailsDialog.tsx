
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TimeReport } from '@/types/timesheet';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TimesheetDetailsDialogProps {
  timesheet: TimeReport | null;
  open: boolean;
  onClose: () => void;
}

const TimesheetDetailsDialog: React.FC<TimesheetDetailsDialogProps> = ({
  timesheet,
  open,
  onClose
}) => {
  if (!timesheet) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails de la feuille de temps</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={timesheet.employeePhoto} />
                  <AvatarFallback>{timesheet.employeeName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{timesheet.employeeName}</h3>
                  <p className="text-sm text-gray-500">{timesheet.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <h4 className="font-medium mb-2">Période</h4>
                <p>Du {timesheet.startDate} au {timesheet.endDate}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <h4 className="font-medium mb-2">Heures totales</h4>
                <p className="text-2xl font-bold">{timesheet.totalHours}h</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">État</h4>
                <Badge 
                  variant="outline" 
                  className={`
                    ${timesheet.status === "En cours" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                    ${timesheet.status === "Soumis" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                    ${timesheet.status === "Validé" ? "bg-green-50 text-green-700 border-green-200" : ""}
                    ${timesheet.status === "Rejeté" ? "bg-red-50 text-red-700 border-red-200" : ""}
                  `}
                >
                  {timesheet.status}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-500">
                Dernière mise à jour: {timesheet.lastUpdateText}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimesheetDetailsDialog;
