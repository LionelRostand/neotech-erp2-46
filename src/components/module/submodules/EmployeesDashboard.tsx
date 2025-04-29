
import React, { useMemo } from 'react';
import { Users, Clock, CalendarDays, Building } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DataTable, { Transaction } from '@/components/DataTable';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useEmployeeData } from '@/hooks/useEmployeeData';

const EmployeesDashboard: React.FC = () => {
  // Utiliser useEmployeeData pour avoir les employés dédupliqués
  const { 
    employees, 
    departments 
  } = useEmployeeData();
  
  const {
    attendance, 
    leaveRequests, 
    isLoading 
  } = useHrModuleData();

  // Log de debug pour vérifier le nombre d'employés
  useMemo(() => {
    console.log(`[EmployeesDashboard] - Nombre d'employés dédupliqués: ${employees?.length || 0}`);
    if (employees?.length > 0) {
      console.log("[EmployeesDashboard] - Liste des employés dédupliqués sur le tableau de bord:", 
        employees.map(e => `${e.firstName} ${e.lastName} (${e.id})`));
    }
  }, [employees]);

  // Calculer les statistiques en temps réel
  const stats = useMemo(() => {
    if (isLoading) return null;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Total des employés actifs (dédupliqués)
    const totalEmployees = employees?.length || 0;
    
    // Employés présents aujourd'hui
    const presentToday = attendance?.filter(a => 
      a.date === today && a.status === 'present'
    ).length || 0;
    
    // Employés en congés
    const onLeave = leaveRequests?.filter(lr => {
      // Vérifier si la date d'aujourd'hui est entre la date de début et de fin
      const today = new Date();
      
      // Valider les dates avant conversion
      if (!lr.startDate || !lr.endDate) return false;
      
      try {
        const startDate = new Date(lr.startDate);
        const endDate = new Date(lr.endDate);
        
        // Vérifier que les dates sont valides
        if (!isValid(startDate) || !isValid(endDate)) return false;
        
        return today >= startDate && today <= endDate && lr.status === 'approved';
      } catch (error) {
        console.error('Date de congé invalide:', lr.startDate, lr.endDate, error);
        return false;
      }
    }).length || 0;
    
    // Total des départements
    const totalDepartments = departments?.length || 0;
    
    return {
      totalEmployees,
      presentToday,
      onLeave,
      totalDepartments
    };
  }, [employees, departments, attendance, leaveRequests, isLoading]);

  // Générer les données pour la table des activités récentes
  const recentActivities = useMemo(() => {
    if (isLoading) return [];
    
    const activities: Transaction[] = [];
    
    // Ajouter les entrées d'assiduité récentes
    if (attendance && attendance.length > 0) {
      attendance.slice(0, 5).forEach(item => {
        const employee = employees?.find(e => e.id === item.employeeId);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
        
        // Valider la date avant de la formatter
        let formattedDate = '';
        try {
          if (item.date) {
            const dateObj = new Date(item.date);
            if (isValid(dateObj)) {
              formattedDate = format(dateObj, 'yyyy-MM-dd');
            } else {
              formattedDate = 'Date invalide';
              console.warn('Date d\'assiduité invalide:', item.date);
            }
          } else {
            formattedDate = 'Date non spécifiée';
          }
        } catch (error) {
          console.error('Erreur lors du formatage de la date d\'assiduité:', error);
          formattedDate = 'Erreur de date';
        }
        
        activities.push({
          id: `ATT-${item.id}`,
          date: formattedDate,
          client: employeeName,
          amount: item.type === 'arrival' ? 'Arrivée' : 'Départ',
          status: 'success',
          statusText: item.time || 'Heure non spécifiée'
        });
      });
    }
    
    // Ajouter les demandes de congés récentes
    if (leaveRequests && leaveRequests.length > 0) {
      leaveRequests.slice(0, 3).forEach(item => {
        const employee = employees?.find(e => e.id === item.employeeId);
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
        
        let status: 'success' | 'warning' | 'danger' = 'warning';
        let statusText = 'En attente';
        
        if (item.status === 'approved') {
          status = 'success';
          statusText = 'Approuvé';
        } else if (item.status === 'rejected') {
          status = 'danger';
          statusText = 'Rejeté';
        }
        
        // Valider la date avant de la formatter
        let formattedDate = '';
        try {
          const dateValue = item.requestDate || item.createdAt;
          if (dateValue) {
            const dateObj = new Date(dateValue);
            if (isValid(dateObj)) {
              formattedDate = format(dateObj, 'yyyy-MM-dd');
            } else {
              formattedDate = 'Date invalide';
              console.warn('Date de demande de congé invalide:', dateValue);
            }
          } else {
            formattedDate = 'Date non spécifiée';
          }
        } catch (error) {
          console.error('Erreur lors du formatage de la date de demande de congé:', error);
          formattedDate = 'Erreur de date';
        }
        
        activities.push({
          id: `LEAVE-${item.id}`,
          date: formattedDate,
          client: employeeName,
          amount: 'Congé',
          status: status,
          statusText: statusText
        });
      });
    }
    
    // Trier par date décroissante (avec gestion des dates invalides)
    return activities
      .sort((a, b) => {
        try {
          // Vérifier si les dates sont valides
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          if (!isValid(dateA) && !isValid(dateB)) return 0;
          if (!isValid(dateA)) return 1; // Mettre les dates invalides en dernier
          if (!isValid(dateB)) return -1;
          
          return dateB.getTime() - dateA.getTime();
        } catch (error) {
          console.error('Erreur de tri des dates:', error);
          return 0;
        }
      })
      .slice(0, 5);
  }, [employees, attendance, leaveRequests, isLoading]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Données des cartes de statistiques
  const statsData = [
    {
      title: "Total Employés",
      value: stats?.totalEmployees.toString() || "0",
      icon: <Users className="h-8 w-8 text-neotech-primary" />,
      description: "Employés actifs dans l'entreprise"
    },
    {
      title: "Présences",
      value: stats?.presentToday.toString() || "0",
      icon: <Clock className="h-8 w-8 text-green-500" />,
      description: "Employés présents aujourd'hui"
    },
    {
      title: "Congés",
      value: stats?.onLeave.toString() || "0",
      icon: <CalendarDays className="h-8 w-8 text-amber-500" />,
      description: "Employés en congés"
    },
    {
      title: "Départements",
      value: stats?.totalDepartments.toString() || "0",
      icon: <Building className="h-8 w-8 text-blue-500" />,
      description: "Départements actifs"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>

      <div className="mb-8">
        <DataTable 
          title="Activités Récentes" 
          data={recentActivities} 
        />
      </div>
    </>
  );
};

const DashboardSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(index => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="h-10 w-48 mb-4" />
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(index => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeesDashboard;
