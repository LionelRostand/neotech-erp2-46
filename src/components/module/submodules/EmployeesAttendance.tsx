
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Plus } from 'lucide-react';
import { toast } from 'sonner';
import AttendanceTable from './attendance/AttendanceTable';
import AttendanceTerminal from './attendance/AttendanceTerminal';
import { EmployeeAttendance } from '@/types/attendance';
import { calculateHoursWorked } from './attendance/utils/attendanceUtils';
import * as XLSX from 'xlsx';

const EmployeesAttendance: React.FC = () => {
  const [attendances, setAttendances] = useState<EmployeeAttendance[]>([]);
  const [activeTab, setActiveTab] = useState('terminal');
  
  // Charger les présences depuis le stockage local
  useEffect(() => {
    const storedAttendances = localStorage.getItem('employee_attendances');
    if (storedAttendances) {
      setAttendances(JSON.parse(storedAttendances));
    }
  }, []);
  
  // Sauvegarder les présences dans le stockage local
  useEffect(() => {
    if (attendances.length > 0) {
      localStorage.setItem('employee_attendances', JSON.stringify(attendances));
    }
  }, [attendances]);
  
  // Gérer l'entrée d'un employé
  const handleCheckIn = (newAttendance: EmployeeAttendance) => {
    setAttendances(prev => [...prev, newAttendance]);
  };
  
  // Gérer la sortie d'un employé
  const handleCheckOut = (employeeId: string, departureTime: string) => {
    setAttendances(prev => {
      return prev.map(attendance => {
        if (attendance.employeeId === employeeId && !attendance.departureTime) {
          const hoursWorked = calculateHoursWorked(attendance.arrivalTime, departureTime);
          return {
            ...attendance,
            departureTime,
            hoursWorked
          };
        }
        return attendance;
      });
    });
  };

  // Valider une présence
  const handleValidateAttendance = (id: string) => {
    setAttendances(prev => {
      return prev.map(attendance => {
        if (attendance.id === id) {
          return {
            ...attendance,
            validation: 'Validé'
          };
        }
        return attendance;
      });
    });
    toast.success("Présence validée avec succès");
  };
  
  // Rejeter une présence
  const handleRejectAttendance = (id: string) => {
    setAttendances(prev => {
      return prev.map(attendance => {
        if (attendance.id === id) {
          return {
            ...attendance,
            validation: 'Rejeté'
          };
        }
        return attendance;
      });
    });
    toast.success("Présence rejetée");
  };
  
  // Exportation des données de présence vers Excel
  const handleExportToExcel = () => {
    // Préparer les données pour l'exportation
    const exportData = attendances.map(attendance => ({
      'Employé': attendance.employeeName,
      'Date': attendance.date,
      'Heure d\'arrivée': attendance.arrivalTime || 'N/A',
      'Heure de départ': attendance.departureTime || 'N/A',
      'Heures travaillées': attendance.hoursWorked || 'N/A',
      'Statut': attendance.status,
      'Validation': attendance.validation
    }));
    
    // Créer un classeur
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Présences");
    
    // Définir les largeurs de colonnes
    const colWidths = [
      { wch: 20 }, // Employé
      { wch: 12 }, // Date
      { wch: 15 }, // Heure d'arrivée
      { wch: 15 }, // Heure de départ
      { wch: 15 }, // Heures travaillées
      { wch: 12 }, // Statut
      { wch: 12 }  // Validation
    ];
    worksheet['!cols'] = colWidths;
    
    // Exporter le fichier
    XLSX.writeFile(workbook, `Registre_Presences_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success("Données de présence exportées avec succès");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Présences</h1>
          <p className="text-gray-500">Suivi des entrées et sorties des employés</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportToExcel}
          >
            <Download size={16} />
            Exporter
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="terminal">Borne de présence</TabsTrigger>
          <TabsTrigger value="register">Registre des présences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="terminal" className="p-0">
          <div className="mx-auto max-w-md">
            <AttendanceTerminal
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              attendances={attendances}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="register" className="p-0">
          <Card>
            <CardContent className="pt-6">
              <AttendanceTable
                attendances={attendances}
                onValidate={handleValidateAttendance}
                onReject={handleRejectAttendance}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesAttendance;
