
import React, { useState } from 'react';
import { Badge as BadgeIcon, BadgeCheck, User, Plus, Eye, Download } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DataTable, { Transaction } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { employees } from '@/data/employees';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { Card } from '@/components/ui/card';

// Interface for Badge data
interface BadgeData {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department: string;
  accessLevel: string;
  status: "success" | "warning" | "danger";
  statusText: string;
}

const EmployeesBadges: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string>('');
  const [badgeNumber, setBadgeNumber] = useState(`B-${Math.floor(2460 + Math.random() * 100)}`);
  const [badgesList, setBadgesList] = useState<BadgeData[]>([
    {
      id: "B-2458",
      date: "2023-10-15",
      employeeId: "EMP001",
      employeeName: "Martin Dupont",
      department: "Sécurité",
      accessLevel: "Sécurité Niveau 3",
      status: "success",
      statusText: "Actif"
    },
    {
      id: "B-2457",
      date: "2023-10-14",
      employeeId: "EMP002",
      employeeName: "Sophie Martin",
      department: "Administration",
      accessLevel: "Administration",
      status: "success",
      statusText: "Actif"
    },
    {
      id: "B-2456",
      date: "2023-10-12",
      employeeId: "EMP003",
      employeeName: "Jean Lefebvre",
      department: "IT",
      accessLevel: "IT",
      status: "warning",
      statusText: "En attente"
    },
    {
      id: "B-2455",
      date: "2023-10-10",
      employeeId: "EMP004",
      employeeName: "Emma Bernard",
      department: "RH",
      accessLevel: "RH",
      status: "success",
      statusText: "Actif"
    },
    {
      id: "B-2454",
      date: "2023-10-09",
      employeeId: "EMP005",
      employeeName: "Thomas Petit",
      department: "Marketing",
      accessLevel: "Marketing",
      status: "danger",
      statusText: "Désactivé"
    }
  ]);
  
  const [isBadgePreviewOpen, setIsBadgePreviewOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [selectedBadgeEmployee, setSelectedBadgeEmployee] = useState<Employee | null>(null);
  
  // Stats data based on the badges list
  const statsData = [
    {
      title: "Badges Actifs",
      value: badgesList.filter(badge => badge.status === "success").length.toString(),
      icon: <BadgeIcon className="h-8 w-8 text-neotech-primary" />,
      description: "Total des badges actuellement actifs"
    },
    {
      title: "Badges Attribués",
      value: badgesList.filter(badge => badge.status === "success").length.toString(),
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
      description: "Badges assignés à des employés"
    },
    {
      title: "Badges En Attente",
      value: badgesList.filter(badge => badge.status === "warning").length.toString(),
      icon: <BadgeIcon className="h-8 w-8 text-amber-500" />,
      description: "Badges prêts à être attribués"
    },
    {
      title: "Employés",
      value: employees.length.toString(),
      icon: <User className="h-8 w-8 text-blue-500" />,
      description: "Employés avec accès au système"
    }
  ];

  // Convert badges data to table format
  const badgesData: Transaction[] = badgesList.map(badge => ({
    id: badge.id,
    date: badge.date,
    client: badge.employeeName,
    amount: badge.accessLevel,
    status: badge.status,
    statusText: badge.statusText
  }));
  
  const handleCreateBadge = () => {
    if (!selectedEmployee || !accessLevel) {
      toast.error("Veuillez sélectionner un employé et un niveau d'accès");
      return;
    }
    
    // Find the employee in the employees array
    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) {
      toast.error("Employé non trouvé");
      return;
    }
    
    // Create a new badge
    const newBadge: BadgeData = {
      id: badgeNumber,
      date: new Date().toISOString().split('T')[0],
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      department: employee.department,
      accessLevel: accessLevel,
      status: "success",
      statusText: "Actif"
    };
    
    // Add the new badge to the badges list
    setBadgesList(prev => [newBadge, ...prev]);
    
    // Show success toast
    toast.success(`Badge créé avec succès pour l'employé: ${selectedEmployee}`);
    
    // Reset form and close dialog
    setIsDialogOpen(false);
    setSelectedEmployee('');
    setSelectedEmployeeId('');
    setAccessLevel('');
    setBadgeNumber(`B-${Math.floor(2460 + Math.random() * 100)}`);
  };
  
  const handleViewBadge = (badgeId: string) => {
    const badge = badgesList.find(b => b.id === badgeId);
    if (badge) {
      setSelectedBadge(badge);
      
      // Find the corresponding employee
      const employee = employees.find(emp => emp.id === badge.employeeId) || 
                       employees.find(emp => `${emp.firstName} ${emp.lastName}` === badge.employeeName);
                       
      setSelectedBadgeEmployee(employee || null);
      setIsBadgePreviewOpen(true);
    }
  };
  
  const getInitials = (firstName: string, lastName: string) => {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Badges et accès</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Créer un badge
        </Button>
      </div>
      
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
          title="Registre des Badges" 
          data={badgesData}
          className="cursor-pointer"
          onRowClick={(row) => handleViewBadge(row.id.replace('#', ''))}
        />
      </div>
      
      {/* Create Badge Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouveau badge</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Employé
              </Label>
              <div className="col-span-3">
                <Select 
                  value={selectedEmployee} 
                  onValueChange={(value) => {
                    setSelectedEmployee(value);
                    const empId = value.split('|')[1];
                    setSelectedEmployeeId(empId);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem 
                        key={employee.id} 
                        value={`${employee.firstName} ${employee.lastName}|${employee.id}`}
                      >
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="access" className="text-right">
                Niveau d'accès
              </Label>
              <div className="col-span-3">
                <Select value={accessLevel} onValueChange={setAccessLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un niveau d'accès" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sécurité Niveau 1">Sécurité Niveau 1</SelectItem>
                    <SelectItem value="Sécurité Niveau 2">Sécurité Niveau 2</SelectItem>
                    <SelectItem value="Sécurité Niveau 3">Sécurité Niveau 3</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="DIRECTION">DIRECTION</SelectItem>
                    <SelectItem value="PDG">PDG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="badge-number" className="text-right">
                Numéro de badge
              </Label>
              <Input id="badge-number" className="col-span-3" value={badgeNumber} disabled />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateBadge}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Badge Preview Dialog */}
      <Dialog open={isBadgePreviewOpen} onOpenChange={setIsBadgePreviewOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <div className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <BadgeIcon className="h-5 w-5" /> Badge Employé
            </DialogTitle>
          </div>
          
          {selectedBadge && selectedBadgeEmployee && (
            <div className="p-6">
              <div className="flex flex-col items-center">
                <Card className="w-full max-w-md bg-green-600 text-white p-6 rounded-lg shadow-md mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-full bg-white text-green-600 flex items-center justify-center text-xl font-bold">
                        {getInitials(selectedBadgeEmployee.firstName, selectedBadgeEmployee.lastName)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedBadgeEmployee.firstName}</h3>
                        <h3 className="text-xl font-bold">{selectedBadgeEmployee.lastName}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <BadgeIcon className="h-4 w-4" /> {selectedBadge.accessLevel}
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-white text-gray-700 rounded-md text-xs font-medium">
                      NEOTECH-CORP
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="bg-green-500 bg-opacity-50 p-4 rounded-md">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" /> Département
                      </div>
                      <div className="text-lg font-bold mt-1">{selectedBadgeEmployee.department.toUpperCase()}</div>
                    </div>
                  </div>
                </Card>
                
                <Button className="w-full" onClick={() => toast.success("Badge téléchargé")}>
                  <Download className="h-4 w-4 mr-2" /> Télécharger le badge
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeesBadges;
