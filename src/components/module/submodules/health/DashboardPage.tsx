
import React from 'react';
import { LayoutDashboard, UserCheck, Calendar, Clipboard, CreditCard, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardPage: React.FC = () => {
  const { 
    patients, 
    appointments, 
    consultations, 
    prescriptions, 
    billing,
    staff,
    isLoading 
  } = useHealthData();

  // Generate mock activity data for the last 7 days
  const activityData = React.useMemo(() => {
    const today = new Date();
    const lastWeek = eachDayOfInterval({
      start: subDays(today, 6),
      end: today
    });

    return lastWeek.map(day => {
      // Find appointments/consultations for this day
      const dateStr = format(day, 'yyyy-MM-dd');
      const appts = appointments?.filter(a => a.date.startsWith(dateStr)).length || 0;
      const consults = consultations?.filter(c => c.date.startsWith(dateStr)).length || 0;
      
      return {
        date: format(day, 'dd/MM', { locale: fr }),
        appointments: appts,
        consultations: consults
      };
    });
  }, [appointments, consultations]);

  // Calculate pending appointments
  const pendingAppointments = appointments?.filter(a => 
    a.status === 'scheduled' || a.status === 'confirmed'
  ).length || 0;

  // Calculate today's appointments
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments?.filter(a => 
    a.date.startsWith(today)
  ).length || 0;

  // Calculate total revenue
  const totalRevenue = billing?.reduce((sum, inv) => sum + inv.total, 0).toFixed(2) || "0.00";

  // Patient distribution by gender
  const patientsByGender = [
    { name: 'Hommes', count: patients?.filter(p => p.gender === 'male').length || 0 },
    { name: 'Femmes', count: patients?.filter(p => p.gender === 'female').length || 0 },
    { name: 'Autre', count: patients?.filter(p => p.gender && p.gender !== 'male' && p.gender !== 'female').length || 0 },
    { name: 'Non spécifié', count: patients?.filter(p => !p.gender).length || 0 },
  ];

  // Recent activity - appointments and consultations
  const recentActivity = [
    ...(appointments?.slice(0, 5).map(a => ({
      id: a.id,
      type: 'appointment',
      date: a.date,
      time: a.time,
      patientId: a.patientId,
      doctorId: a.doctorId,
      status: a.status
    })) || []),
    ...(consultations?.slice(0, 5).map(c => ({
      id: c.id,
      type: 'consultation',
      date: c.date,
      time: c.time,
      patientId: c.patientId,
      doctorId: c.doctorId,
      status: c.status
    })) || [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 5);

  // Get patient and doctor names
  const getPatientName = (patientId: string) => {
    const patient = patients?.find(p => p.id === patientId);
    return patient ? `${patient.lastName} ${patient.firstName}` : 'Patient inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = staff?.find(s => s.id === doctorId);
    return doctor ? `Dr. ${doctor.lastName} ${doctor.firstName}` : 'Médecin inconnu';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          Dashboard Médical
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{patients?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total patients</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rendez-vous</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{pendingAppointments}</div>
                <p className="text-xs text-muted-foreground">En attente ({todayAppointments} aujourd'hui)</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Clipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{consultations?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Total consultations</p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalRevenue} €</div>
                <p className="text-xs text-muted-foreground">Revenu total</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Activity Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Activité (7 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 w-full flex items-center justify-center">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="appointments" 
                      stroke="#10b981" 
                      activeDot={{ r: 8 }} 
                      name="Rendez-vous" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="consultations" 
                      stroke="#8884d8" 
                      name="Consultations" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gender distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Répartition des patients</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 w-full flex items-center justify-center">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={patientsByGender}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" name="Patients" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-center border-b pb-2">
                      {activity.type === 'appointment' ? (
                        <Calendar className="h-5 w-5 text-blue-500 mr-3" />
                      ) : (
                        <Clipboard className="h-5 w-5 text-indigo-500 mr-3" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.type === 'appointment' ? 'Rendez-vous' : 'Consultation'}: {getPatientName(activity.patientId)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(activity.date), 'dd/MM/yyyy')} à {activity.time} • Dr. {getDoctorName(activity.doctorId)}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activity.status === 'completed' ? 'Terminé' :
                         activity.status === 'cancelled' ? 'Annulé' :
                         activity.status === 'scheduled' ? 'Prévu' :
                         activity.status === 'in-progress' ? 'En cours' : 
                         activity.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Aucune activité récente</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              Alertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm font-medium text-amber-800">
                    Stock bas de médicaments
                  </p>
                  <p className="text-xs text-amber-700">
                    3 médicaments en stock critique
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm font-medium text-blue-800">
                    Rappel de rendez-vous
                  </p>
                  <p className="text-xs text-blue-700">
                    {todayAppointments} rendez-vous prévus aujourd'hui
                  </p>
                </div>
                
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800">
                    Factures impayées
                  </p>
                  <p className="text-xs text-red-700">
                    {billing?.filter(b => b.status === 'overdue').length || 0} factures en retard de paiement
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
