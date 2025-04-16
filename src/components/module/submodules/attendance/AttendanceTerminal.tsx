
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, UserCheck, UserX, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { EmployeeAttendance } from '@/types/attendance';

interface AttendanceTerminalProps {
  onCheckIn: (attendance: EmployeeAttendance) => void;
  onCheckOut: (employeeId: string, departureTime: string) => void;
  attendances: EmployeeAttendance[];
  employees: Employee[];
}

const AttendanceTerminal: React.FC<AttendanceTerminalProps> = ({ 
  onCheckIn, 
  onCheckOut,
  attendances,
  employees
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Mettre à jour l'heure et la date actuelle
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const dateString = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Recherche en temps réel
  useEffect(() => {
    if (employeeId && employeeId.length > 1) {
      // Recherche par ID, badge, nom ou prénom
      const results = employees.filter(emp => 
        emp.id.toLowerCase().includes(employeeId.toLowerCase()) ||
        (emp.badgeNumber && emp.badgeNumber.toLowerCase().includes(employeeId.toLowerCase())) ||
        emp.firstName.toLowerCase().includes(employeeId.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(employeeId.toLowerCase()) ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(employeeId.toLowerCase()) ||
        `${emp.lastName} ${emp.firstName}`.toLowerCase().includes(employeeId.toLowerCase())
      );

      setSearchResults(results.slice(0, 5)); // Limiter à 5 résultats
      setShowResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [employeeId, employees]);
  
  // Rechercher un employé par ID (accepte ID direct ou badge ID)
  const findEmployee = (id: string) => {
    // Chercher par ID, badge ou nom
    let employee = employees.find(emp => emp.id === id);
    
    if (!employee) {
      // Essayer avec badgeNumber s'il existe
      employee = employees.find(emp => emp.badgeNumber === id);
    }
    
    // Essayer par B-XXXX (format des badges)
    if (!employee && id.startsWith('B-')) {
      employee = employees.find(emp => emp.badgeNumber === id);
    }
    
    // Chercher par le nom complet ou partiel
    if (!employee) {
      employee = employees.find(emp => 
        `${emp.firstName} ${emp.lastName}`.toLowerCase() === id.toLowerCase() ||
        `${emp.lastName} ${emp.firstName}`.toLowerCase() === id.toLowerCase()
      );
    }
    
    return employee;
  };

  // Vérifier si l'employé est déjà présent aujourd'hui
  const isEmployeeCheckedInToday = (id: string) => {
    const today = new Date().toLocaleDateString('fr-FR');
    return attendances.some(
      attendance => attendance.employeeId === id && 
      attendance.date === today && 
      !attendance.departureTime
    );
  };

  // Sélectionner un employé dans les résultats
  const selectEmployee = (employee: Employee) => {
    setEmployeeId(employee.id);
    setShowResults(false);
  };

  // Gérer la validation d'entrée
  const handleCheckIn = () => {
    if (!employeeId) {
      toast.error("Veuillez entrer votre identifiant d'employé.");
      return;
    }
    
    const employee = findEmployee(employeeId);
    if (!employee) {
      toast.error("Employé non trouvé. Veuillez vérifier votre identifiant.");
      return;
    }
    
    if (isEmployeeCheckedInToday(employee.id)) {
      toast.error("Vous êtes déjà enregistré comme présent aujourd'hui.");
      return;
    }
    
    const attendanceRecord: EmployeeAttendance = {
      id: `att-${Date.now()}`,
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      date: new Date().toLocaleDateString('fr-FR'),
      arrivalTime: currentTime,
      departureTime: null,
      hoursWorked: '0h',
      status: 'Présent',
      validation: 'En attente'
    };
    
    onCheckIn(attendanceRecord);
    toast.success(`Bonjour ${employee.firstName} ${employee.lastName}, votre entrée a été enregistrée à ${currentTime}`);
    setEmployeeId('');
  };
  
  // Gérer la validation de sortie
  const handleCheckOut = () => {
    if (!employeeId) {
      toast.error("Veuillez entrer votre identifiant d'employé.");
      return;
    }
    
    const employee = findEmployee(employeeId);
    if (!employee) {
      toast.error("Employé non trouvé. Veuillez vérifier votre identifiant.");
      return;
    }
    
    if (!isEmployeeCheckedInToday(employee.id)) {
      toast.error("Vous n'avez pas encore enregistré votre entrée aujourd'hui.");
      return;
    }
    
    onCheckOut(employee.id, currentTime);
    toast.success(`Au revoir ${employee.firstName} ${employee.lastName}, votre sortie a été enregistrée à ${currentTime}`);
    setEmployeeId('');
  };
  
  return (
    <Card className="border shadow-lg mx-auto max-w-md">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Borne de Présence</CardTitle>
            <CardDescription className="text-blue-100">Validation des entrées et sorties</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-lg">
              <Clock size={20} />
              <span>{currentTime}</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-sm text-blue-100">
              <Calendar size={16} />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="employee-id" className="text-sm font-medium">
              Identifiant employé
            </label>
            <div className="relative">
              <Input
                id="employee-id"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="ID, Badge ou Nom"
                className="text-lg pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              
              {showResults && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  {searchResults.map(emp => (
                    <div 
                      key={emp.id} 
                      className="p-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 border-b border-gray-100"
                      onClick={() => selectEmployee(emp)}
                    >
                      {emp.photoURL && (
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img src={emp.photoURL} alt={emp.firstName} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                        <div className="text-xs text-gray-500">{emp.department || 'Non spécifié'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              onClick={handleCheckIn}
              className="flex items-center gap-2 py-6 bg-green-600 hover:bg-green-700"
            >
              <UserCheck size={24} />
              <span className="text-lg">Entrée</span>
            </Button>
            
            <Button 
              onClick={handleCheckOut}
              className="flex items-center gap-2 py-6 bg-red-600 hover:bg-red-700"
            >
              <UserX size={24} />
              <span className="text-lg">Sortie</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTerminal;
