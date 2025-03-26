
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
  FilePdf
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onViewDetails(employee)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Voir les détails</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onViewHistory(employee)}
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Historique des salaires</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onEdit(employee)}
                        >
                          <FileEdit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Modifier</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onDownloadPayStub(employee)}
                          className="text-primary hover:bg-primary/10"
                        >
                          <FilePdf className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Télécharger bulletin de paie</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
