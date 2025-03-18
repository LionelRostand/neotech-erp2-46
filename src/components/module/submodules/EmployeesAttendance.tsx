
import React, { useState } from 'react';
import AttendanceSearch from './attendance/AttendanceSearch';
import AttendanceTable from './attendance/AttendanceTable';
import { EmployeeAttendance } from '@/types/attendance';
import { useToast } from '@/hooks/use-toast';

// Données fictives pour l'exemple
const mockAttendances: EmployeeAttendance[] = [
  {
    id: '1',
    employeeName: 'LIONEL DJOSSA',
    date: '2025-03-18',
    arrivalTime: '09:00',
    departureTime: '18:00',
    hoursWorked: 8,
    status: 'Présent',
    validation: 'En attente'
  },
  {
    id: '2',
    employeeName: 'MARIE DUPONT',
    date: '2025-03-18',
    arrivalTime: '08:30',
    departureTime: '17:30',
    hoursWorked: 8,
    status: 'Présent',
    validation: 'En attente'
  },
  {
    id: '3',
    employeeName: 'JEAN MARTIN',
    date: '2025-03-18',
    arrivalTime: '10:15',
    departureTime: '18:30',
    hoursWorked: 7.25,
    status: 'Retard',
    validation: 'En attente'
  },
  {
    id: '4',
    employeeName: 'SOPHIE LAURENT',
    date: '2025-03-18',
    arrivalTime: '',
    departureTime: '',
    hoursWorked: 0,
    status: 'Absent',
    validation: 'Validé'
  }
];

const EmployeesAttendance: React.FC = () => {
  const [attendances, setAttendances] = useState<EmployeeAttendance[]>(mockAttendances);
  const [filteredAttendances, setFilteredAttendances] = useState<EmployeeAttendance[]>(mockAttendances);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredAttendances(attendances);
      return;
    }
    
    const filtered = attendances.filter(
      attendance => attendance.employeeName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAttendances(filtered);
  };

  const handleValidate = (id: string) => {
    const updatedAttendances = attendances.map(attendance => 
      attendance.id === id 
        ? { ...attendance, validation: 'Validé' as const } 
        : attendance
    );
    
    setAttendances(updatedAttendances);
    setFilteredAttendances(updatedAttendances);
    
    toast({
      title: "Présence validée",
      description: "La présence de l'employé a été validée avec succès",
    });
  };

  const handleReject = (id: string) => {
    const updatedAttendances = attendances.map(attendance => 
      attendance.id === id 
        ? { ...attendance, validation: 'Rejeté' as const } 
        : attendance
    );
    
    setAttendances(updatedAttendances);
    setFilteredAttendances(updatedAttendances);
    
    toast({
      title: "Présence rejetée",
      description: "La présence de l'employé a été rejetée",
      variant: "destructive"
    });
  };

  return (
    <div>
      <AttendanceSearch onSearch={handleSearch} />
      <AttendanceTable 
        attendances={filteredAttendances} 
        onValidate={handleValidate}
        onReject={handleReject}
      />
    </div>
  );
};

export default EmployeesAttendance;
