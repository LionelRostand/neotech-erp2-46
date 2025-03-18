import React, { useState } from 'react';
import { Badge, BadgeCheck, User, Plus } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DataTable, { Transaction } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { employees } from '@/data/employees';
import { toast } from 'sonner';

const EmployeesBadges: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<string>('');
  
  // Sample data for the stats cards
  const statsData = [
    {
      title: "Badges Actifs",
      value: "214",
      icon: <Badge className="h-8 w-8 text-neotech-primary" />,
      description: "Total des badges actuellement actifs"
    },
    {
      title: "Badges Attribués",
      value: "187",
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
      description: "Badges assignés à des employés"
    },
    {
      title: "Badges En Attente",
      value: "27",
      icon: <Badge className="h-8 w-8 text-amber-500" />,
      description: "Badges prêts à être attribués"
    },
    {
      title: "Employés",
      value: "175",
      icon: <User className="h-8 w-8 text-blue-500" />,
      description: "Employés avec accès au système"
    }
  ];

  // Sample data for the transactions table
  const badgesData: Transaction[] = [
    {
      id: "B-2458",
      date: "2023-10-15",
      client: "Martin Dupont",
      amount: "Sécurité Niveau 3",
      status: "success",
      statusText: "Actif"
    },
    {
      id: "B-2457",
      date: "2023-10-14",
      client: "Sophie Martin",
      amount: "Administration",
      status: "success",
      statusText: "Actif"
    },
    {
      id: "B-2456",
      date: "2023-10-12",
      client: "Jean Lefebvre",
      amount: "IT",
      status: "warning",
      statusText: "En attente"
    },
    {
      id: "B-2455",
      date: "2023-10-10",
      client: "Emma Bernard",
      amount: "RH",
      status: "success",
      statusText: "Actif"
    },
    {
      id: "B-2454",
      date: "2023-10-09",
      client: "Thomas Petit",
      amount: "Marketing",
      status: "danger",
      statusText: "Désactivé"
    }
  ];
  
  const handleCreateBadge = () => {
    if (!selectedEmployee || !accessLevel) {
      toast.error("Veuillez sélectionner un employé et un niveau d'accès");
      return;
    }
    
    // In a real app, this would call an API to create the badge
    toast.success(`Badge créé avec succès pour l'employé: ${selectedEmployee}`);
    setIsDialogOpen(false);
    setSelectedEmployee('');
    setAccessLevel('');
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
        />
      </div>
      
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
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.firstName + ' ' + employee.lastName}>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="badge-number" className="text-right">
                Numéro de badge
              </Label>
              <Input id="badge-number" className="col-span-3" value={`B-${Math.floor(2460 + Math.random() * 100)}`} disabled />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleCreateBadge}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeesBadges;
