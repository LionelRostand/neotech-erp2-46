
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  History, 
  FileEdit, 
  FileDown
} from 'lucide-react';

interface SalaryListProps {
  salaries: any[];
  onViewDetails: (employee: any) => void;
  onViewHistory: (employee: any) => void;
  onEdit: (employee: any) => void;
  onDownloadPayStub: (employee: any) => void;
}

export const SalaryList: React.FC<SalaryListProps> = ({ 
  salaries, 
  onViewDetails, 
  onViewHistory, 
  onEdit, 
  onDownloadPayStub
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Employé</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>Département</TableHead>
            <TableHead className="text-right">Salaire Annuel</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaries.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">#{employee.id}</TableCell>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell className="text-right">{employee.salary.toLocaleString('fr-FR')} €</TableCell>
              <TableCell>
                <Badge 
                  variant={employee.status === 'paid' ? 'default' : 'outline'}
                  className={employee.status === 'paid' ? 'bg-green-500' : ''}
                >
                  {employee.status === 'paid' ? 'Payé' : 'En attente'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onViewDetails(employee)}
                    title="Voir les détails"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onViewHistory(employee)}
                    title="Historique des salaires"
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(employee)}
                    title="Modifier"
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDownloadPayStub(employee)}
                    title="Télécharger bulletin de paie"
                  >
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
