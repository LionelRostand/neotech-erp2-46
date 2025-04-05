
import React from 'react';
import { Alert } from '@/hooks/useAlertsData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AlertsListProps {
  alerts: Alert[];
  isLoading: boolean;
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts, isLoading }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Haute':
        return 'bg-red-500 hover:bg-red-600';
      case 'Moyenne':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'Basse':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Résolue':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Chargement des alertes...</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p>Aucune alerte trouvée.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Employé</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell className="font-medium">{alert.title}</TableCell>
              <TableCell>{alert.type}</TableCell>
              <TableCell>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
              </TableCell>
              <TableCell>{alert.createdDate}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(alert.status)}>
                  {alert.status}
                </Badge>
              </TableCell>
              <TableCell>{alert.employeeName}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" />
                      Voir les détails
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Marquer comme résolue
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Assigner à...
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AlertsList;
