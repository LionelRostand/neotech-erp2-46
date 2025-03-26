
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface SalaryHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  employee: any;
  history: any[];
}

export const SalaryHistoryDialog: React.FC<SalaryHistoryDialogProps> = ({
  isOpen,
  onOpenChange,
  employee,
  history
}) => {
  if (!employee) return null;

  const employeeHistory = history.filter(h => h.employeeId === employee.id);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Historique des salaires</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="mb-4">
            <h3 className="font-medium">{employee.name}</h3>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Raison</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeHistory.map((historyItem) => (
                  <TableRow key={historyItem.id}>
                    <TableCell>{historyItem.date}</TableCell>
                    <TableCell>{historyItem.amount.toLocaleString('fr-FR')} €</TableCell>
                    <TableCell>{historyItem.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
