
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  department: string;
  balances: {
    [key: string]: {
      entitled: number;
      taken: number;
      pending: number;
      remaining: number;
    }
  }
}

// Données d'exemple pour les soldes de congés
const LEAVE_BALANCES: LeaveBalance[] = [
  {
    employeeId: '001',
    employeeName: 'Thomas Martin',
    department: 'Marketing',
    balances: {
      'Congés payés': { entitled: 25, taken: 12, pending: 0, remaining: 13 },
      'RTT': { entitled: 12, taken: 0, pending: 0, remaining: 12 },
      'Maladie': { entitled: 0, taken: 0, pending: 0, remaining: 0 }
    }
  },
  {
    employeeId: '002',
    employeeName: 'Sophie Dubois',
    department: 'Développement',
    balances: {
      'Congés payés': { entitled: 25, taken: 5, pending: 0, remaining: 20 },
      'RTT': { entitled: 12, taken: 0, pending: 1, remaining: 11 },
      'Maladie': { entitled: 0, taken: 0, pending: 0, remaining: 0 }
    }
  },
  {
    employeeId: '003',
    employeeName: 'Jean Dupont',
    department: 'Finance',
    balances: {
      'Congés payés': { entitled: 25, taken: 0, pending: 0, remaining: 25 },
      'RTT': { entitled: 12, taken: 2, pending: 0, remaining: 10 },
      'Maladie': { entitled: 0, taken: 3, pending: 0, remaining: 0 }
    }
  },
  {
    employeeId: '004',
    employeeName: 'Marie Lambert',
    department: 'Ressources Humaines',
    balances: {
      'Congés payés': { entitled: 25, taken: 8, pending: 0, remaining: 17 },
      'RTT': { entitled: 12, taken: 5, pending: 0, remaining: 7 },
      'Maladie': { entitled: 0, taken: 0, pending: 0, remaining: 0 },
      'Sans solde': { entitled: 0, taken: 0, pending: 6, remaining: 0 }
    }
  },
  {
    employeeId: '005',
    employeeName: 'Pierre Durand',
    department: 'Développement',
    balances: {
      'Congés payés': { entitled: 25, taken: 3, pending: 11, remaining: 11 },
      'RTT': { entitled: 12, taken: 8, pending: 0, remaining: 4 },
      'Maladie': { entitled: 0, taken: 2, pending: 0, remaining: 0 }
    }
  }
];

const LEAVE_TYPES = ['Congés payés', 'RTT', 'Maladie', 'Sans solde'];

export const LeaveBalances: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2}>Employé</TableHead>
              <TableHead rowSpan={2}>Département</TableHead>
              {LEAVE_TYPES.map(type => (
                <TableHead key={type} colSpan={4} className="text-center border-b">
                  {type}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              {LEAVE_TYPES.map(type => (
                <React.Fragment key={`${type}-details`}>
                  <TableHead className="text-xs font-normal">Acquis</TableHead>
                  <TableHead className="text-xs font-normal">Pris</TableHead>
                  <TableHead className="text-xs font-normal">En attente</TableHead>
                  <TableHead className="text-xs font-normal">Solde</TableHead>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {LEAVE_BALANCES.map((employee) => (
              <TableRow key={employee.employeeId}>
                <TableCell className="font-medium">{employee.employeeName}</TableCell>
                <TableCell>{employee.department}</TableCell>
                
                {LEAVE_TYPES.map(type => {
                  const balance = employee.balances[type] || { entitled: 0, taken: 0, pending: 0, remaining: 0 };
                  const progressPercent = balance.entitled > 0 
                    ? Math.round(((balance.entitled - balance.remaining) / balance.entitled) * 100)
                    : 0;
                  
                  return (
                    <React.Fragment key={`${employee.employeeId}-${type}`}>
                      <TableCell className="text-center">{balance.entitled}</TableCell>
                      <TableCell className="text-center">{balance.taken}</TableCell>
                      <TableCell className="text-center">{balance.pending}</TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center">
                          <span className="font-medium text-sm">{balance.remaining}</span>
                          {balance.entitled > 0 && (
                            <Progress value={progressPercent} className="h-1.5 w-16 mt-1" />
                          )}
                        </div>
                      </TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
