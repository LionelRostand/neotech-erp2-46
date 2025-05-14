
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, Clock, Calendar, CheckCircle } from "lucide-react";
import { TimeReport } from '@/types/timesheet';

interface TimesheetStatsProps {
  timesheetsList: TimeReport[];
}

const TimesheetStats: React.FC<TimesheetStatsProps> = ({ timesheetsList = [] }) => {
  // Ensure we have a valid array of timesheets
  const safeTimesheets = Array.isArray(timesheetsList) ? timesheetsList : [];
  
  // Calculate stats using useMemo to avoid unnecessary recalculations
  const stats = useMemo(() => {
    const totalTimesheets = safeTimesheets.length;
    const inProgressTimesheets = safeTimesheets.filter(ts => ts?.status === 'En cours').length;
    const submittedTimesheets = safeTimesheets.filter(ts => ts?.status === 'Soumis').length;
    const validatedTimesheets = safeTimesheets.filter(ts => ts?.status === 'Validé').length;
    
    // Calculate total hours from all timesheets
    const totalHours = safeTimesheets.reduce((sum, timesheet) => {
      const hours = typeof timesheet?.totalHours === 'number' ? timesheet.totalHours : 0;
      return sum + hours;
    }, 0);
    
    return {
      totalTimesheets,
      inProgressTimesheets,
      submittedTimesheets,
      validatedTimesheets,
      totalHours
    };
  }, [safeTimesheets]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTimesheets}</div>
          <p className="text-xs text-muted-foreground">Feuilles de temps</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Heures déclarées</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHours}</div>
          <p className="text-xs text-muted-foreground">Heures au total</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En cours</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inProgressTimesheets}</div>
          <p className="text-xs text-muted-foreground">À compléter</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Validées</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.validatedTimesheets}</div>
          <p className="text-xs text-muted-foreground">Approuvées</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimesheetStats;
