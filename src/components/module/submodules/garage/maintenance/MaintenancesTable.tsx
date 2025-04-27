import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Maintenance } from './types';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useGarageInvoices } from '@/hooks/garage/useGarageInvoices';

interface MaintenancesTableProps {
  maintenances: Maintenance[];
  onView: (maintenance: Maintenance) => void;
  onEdit: (maintenance: Maintenance) => void;
  onDelete: (maintenance: Maintenance) => void;
}

const MaintenancesTable = ({ 
  maintenances, 
  onView, 
  onEdit, 
  onDelete 
}: MaintenancesTableProps) => {
  const { clients, vehicles } = useGarageData();
  const { createInvoice } = useGarageInvoices();
  const navigate = useNavigate();
  
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Client non assigné';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.name || ''} (${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate})` : 'Véhicule non assigné';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date non définie';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Terminé', className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' },
      in_progress: { label: 'En cours', className: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200' },
      scheduled: { label: 'Planifié', className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200' },
      cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
      { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200' };

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleCreateInvoice = async (maintenance: Maintenance) => {
    const invoiceData = {
      invoiceNumber: `FAC-${Date.now()}`,
      clientId: maintenance.clientId,
      clientName: getClientName(maintenance.clientId),
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: maintenance.totalCost,
      maintenanceId: maintenance.id,
      status: 'pending',
      vehicleInfo: getVehicleInfo(maintenance.vehicleId)
    };

    await createInvoice(invoiceData);
    navigate('/modules/garage/invoices');
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50/50">
          <TableHead>Date</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Véhicule</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {maintenances.map((maintenance) => (
          <TableRow key={maintenance.id} className="hover:bg-gray-50/50">
            <TableCell>{formatDate(maintenance.date)}</TableCell>
            <TableCell>{getClientName(maintenance.clientId)}</TableCell>
            <TableCell>{getVehicleInfo(maintenance.vehicleId)}</TableCell>
            <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-gray-100"
                  onClick={() => onView(maintenance)}
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-gray-100"
                  onClick={() => onEdit(maintenance)}
                >
                  <Pencil className="h-4 w-4 text-gray-600" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-gray-100"
                  onClick={() => onDelete(maintenance)}
                >
                  <Trash2 className="h-4 w-4 text-gray-600" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-gray-100"
                  onClick={() => handleCreateInvoice(maintenance)}
                >
                  <FileText className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MaintenancesTable;
