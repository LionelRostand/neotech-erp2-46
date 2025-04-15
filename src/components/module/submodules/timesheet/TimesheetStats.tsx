
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { TimeReport } from '@/types/timesheet';

interface TimesheetStatsProps {
  timesheetsList: TimeReport[];
}

const TimesheetStats: React.FC<TimesheetStatsProps> = ({ timesheetsList }) => {
  const activeTimesheets = timesheetsList.filter(timesheet => timesheet.status === "En cours").length;
  const submittedTimesheets = timesheetsList.filter(timesheet => timesheet.status === "Soumis").length;
  const validatedTimesheets = timesheetsList.filter(timesheet => timesheet.status === "Validé").length;
  const rejectedTimesheets = timesheetsList.filter(timesheet => timesheet.status === "Rejeté").length;
  
  const totalHours = timesheetsList.reduce((acc, timesheet) => acc + timesheet.totalHours, 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="bg-blue-50 border-blue-200 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">En cours</CardTitle>
          <Clock className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">{activeTimesheets}</div>
          <p className="text-xs text-blue-700">
            {activeTimesheets > 0 
              ? `${((activeTimesheets / timesheetsList.length) * 100).toFixed(1)}% du total`
              : "Aucune feuille en cours"}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50 border-amber-200 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-800">Soumises</CardTitle>
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-900">{submittedTimesheets}</div>
          <p className="text-xs text-amber-700">
            {submittedTimesheets} feuille{submittedTimesheets > 1 ? 's' : ''} en attente
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 border-green-200 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Validées</CardTitle>
          <CheckCircle className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">{validatedTimesheets}</div>
          <p className="text-xs text-green-700">
            {validatedTimesheets} feuille{validatedTimesheets > 1 ? 's' : ''} approuvée{validatedTimesheets > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50 border-red-200 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">Rejetées</CardTitle>
          <XCircle className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-900">{rejectedTimesheets}</div>
          <p className="text-xs text-red-700">
            Total: {totalHours} heures
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimesheetStats;
