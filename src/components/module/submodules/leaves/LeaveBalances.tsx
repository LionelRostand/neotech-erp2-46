
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useHrModuleData } from '@/hooks/useHrModuleData';

export const LeaveBalances: React.FC = () => {
  const { employees, isLoading } = useHrModuleData();

  // Dans une application réelle, ces données viendraient de Firebase
  const leaveBalances = [
    { 
      employeeId: '1',
      type: 'Congés payés',
      total: 25,
      used: 10,
      remaining: 15
    },
    { 
      employeeId: '1',
      type: 'RTT',
      total: 12,
      used: 4,
      remaining: 8
    },
    { 
      employeeId: '2',
      type: 'Congés payés',
      total: 25,
      used: 18,
      remaining: 7
    },
    { 
      employeeId: '2',
      type: 'RTT',
      total: 12,
      used: 8,
      remaining: 4
    },
    { 
      employeeId: '3',
      type: 'Congés payés',
      total: 25,
      used: 5,
      remaining: 20
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        <p className="ml-2 text-gray-500">Chargement des soldes de congés...</p>
      </div>
    );
  }

  // Grouper les balances par employé
  const employeeBalances = employees?.map(employee => {
    // Trouver les soldes pour cet employé
    const balances = leaveBalances.filter(balance => balance.employeeId === employee.id);
    
    return {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      photo: employee.photoURL || employee.photo,
      department: employee.department || 'Non spécifié',
      position: employee.position || employee.title || 'Non spécifié',
      balances
    };
  }) || [];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Employé</TableHead>
            <TableHead>Type de congé</TableHead>
            <TableHead>Acquis</TableHead>
            <TableHead>Pris</TableHead>
            <TableHead>Restant</TableHead>
            <TableHead>Utilisation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeeBalances.flatMap(employee => 
            // Si l'employé n'a pas de soldes, afficher une ligne vide
            employee.balances.length > 0 ? 
              employee.balances.map((balance, index) => (
                <TableRow key={`${employee.id}-${balance.type}`}>
                  {/* N'affichez les informations employé que sur la première ligne de chaque employé */}
                  {index === 0 ? (
                    <TableCell rowSpan={employee.balances.length} className="align-top">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.photo} alt={employee.name} />
                          <AvatarFallback>{employee.name?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.position}</p>
                          <p className="text-xs text-gray-500">{employee.department}</p>
                        </div>
                      </div>
                    </TableCell>
                  ) : null}
                  <TableCell>{balance.type}</TableCell>
                  <TableCell>{balance.total} jours</TableCell>
                  <TableCell>{balance.used} jours</TableCell>
                  <TableCell className="font-medium">{balance.remaining} jours</TableCell>
                  <TableCell className="w-[200px]">
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(balance.used / balance.total) * 100} 
                        className="h-2" 
                      />
                      <span className="text-xs text-gray-500">
                        {Math.round((balance.used / balance.total) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )) : 
              // Ligne par défaut pour un employé sans solde de congés
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.photo} alt={employee.name} />
                      <AvatarFallback>{employee.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-xs text-gray-500">{employee.position}</p>
                      <p className="text-xs text-gray-500">{employee.department}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Aucun solde de congés défini
                </TableCell>
              </TableRow>
          )}
          {employeeBalances.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Aucun employé trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
