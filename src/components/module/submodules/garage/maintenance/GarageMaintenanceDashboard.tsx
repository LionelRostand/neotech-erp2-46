
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Button } from "@/components/ui/button";
import { Plus, FileEdit, Trash, Eye } from 'lucide-react';
import { Card } from "@/components/ui/card";
import AddMaintenanceDialog from './AddMaintenanceDialog';
import EditMaintenanceDialog from './EditMaintenanceDialog';
import ViewMaintenanceDialog from './ViewMaintenanceDialog';
import DeleteMaintenanceDialog from './DeleteMaintenanceDialog';
import { DataTable } from "@/components/ui/data-table";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const GarageMaintenanceDashboard = () => {
  const { maintenances = [], vehicles = [], clients = [], mechanics = [], isLoading, refetch } = useGarageData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié';
    
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error, { dateString });
      return 'Date invalide';
    }
  };

  const getVehicleInfo = (vehicleId) => {
    if (!vehicleId) return 'Non spécifié';
    
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return 'Véhicule inconnu';
    
    return `${vehicle.make || ''} ${vehicle.model || ''} (${vehicle.licensePlate || 'Sans plaque'})`;
  };

  const getClientInfo = (clientId) => {
    if (!clientId) return 'Non spécifié';
    
    const client = clients.find(c => c.id === clientId);
    if (!client) return 'Client inconnu';
    
    return `${client.firstName || ''} ${client.lastName || ''}`;
  };

  const getMechanicInfo = (mechanicId) => {
    if (!mechanicId) return 'Non spécifié';
    
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (!mechanic) return 'Mécanicien inconnu';
    
    return `${mechanic.firstName || ''} ${mechanic.lastName || ''}`;
  };

  const handleView = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowViewDialog(true);
  };

  const handleEdit = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowEditDialog(true);
  };

  const handleDelete = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowDeleteDialog(true);
  };

  const columns = [
    {
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => {
        // Safe access to the date property with default value
        const maintenance = row.original;
        return maintenance && maintenance.date ? formatDate(maintenance.date) : 'Non spécifié';
      }
    },
    {
      header: "Véhicule",
      accessorKey: "vehicleId",
      cell: ({ row }) => {
        const maintenance = row.original;
        return maintenance ? getVehicleInfo(maintenance.vehicleId) : 'Non spécifié';
      }
    },
    {
      header: "Client",
      accessorKey: "clientId",
      cell: ({ row }) => {
        const maintenance = row.original;
        return maintenance ? getClientInfo(maintenance.clientId) : 'Non spécifié';
      }
    },
    {
      header: "Mécanicien",
      accessorKey: "mechanicId",
      cell: ({ row }) => {
        const maintenance = row.original;
        return maintenance ? getMechanicInfo(maintenance.mechanicId) : 'Non spécifié';
      }
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => {
        const maintenance = row.original;
        if (!maintenance) return 'Non spécifié';
        
        const status = maintenance.status || 'pending';
        
        let statusDisplay = 'En attente';
        let statusClass = 'bg-yellow-100 text-yellow-800';
        
        switch (status) {
          case 'completed':
            statusDisplay = 'Terminé';
            statusClass = 'bg-green-100 text-green-800';
            break;
          case 'in_progress':
            statusDisplay = 'En cours';
            statusClass = 'bg-blue-100 text-blue-800';
            break;
          case 'cancelled':
            statusDisplay = 'Annulé';
            statusClass = 'bg-red-100 text-red-800';
            break;
        }
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {statusDisplay}
          </span>
        );
      }
    },
    {
      header: "Coût",
      accessorKey: "totalCost",
      cell: ({ row }) => {
        const maintenance = row.original;
        if (!maintenance) return '0 €';
        
        const cost = maintenance.totalCost !== undefined ? maintenance.totalCost : 0;
        return `${cost} €`;
      }
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const maintenance = row.original;
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(maintenance)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(maintenance)}>
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(maintenance)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  // Safe guard for maintenances data
  const safeMaintenances = Array.isArray(maintenances) ? maintenances.filter(m => m) : [];

  const todayMaintenances = safeMaintenances.filter(m => {
    if (!m || !m.date) return false;
    const today = new Date().toISOString().split('T')[0];
    return m.date.startsWith(today);
  }).length;

  const completedMaintenances = safeMaintenances.filter(m => m && m.status === 'completed').length;
  const inProgressMaintenances = safeMaintenances.filter(m => m && m.status === 'in_progress').length;
  const pendingMaintenances = safeMaintenances.filter(m => m && (!m.status || m.status === 'pending')).length;

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Maintenances</h1>
        <Button onClick={() => setShowAddDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle maintenance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 p-6">
          <div className="flex flex-col">
            <p className="text-sm text-gray-600">Aujourd'hui</p>
            <p className="text-2xl font-bold">{todayMaintenances}</p>
            <p className="text-xs text-gray-500">Maintenances du jour</p>
          </div>
        </Card>

        <Card className="bg-green-50 p-6">
          <div className="flex flex-col">
            <p className="text-sm text-gray-600">Terminées</p>
            <p className="text-2xl font-bold">{completedMaintenances}</p>
            <p className="text-xs text-gray-500">Maintenances complétées</p>
          </div>
        </Card>

        <Card className="bg-yellow-50 p-6">
          <div className="flex flex-col">
            <p className="text-sm text-gray-600">En cours</p>
            <p className="text-2xl font-bold">{inProgressMaintenances}</p>
            <p className="text-xs text-gray-500">Maintenances actives</p>
          </div>
        </Card>

        <Card className="bg-purple-50 p-6">
          <div className="flex flex-col">
            <p className="text-sm text-gray-600">En attente</p>
            <p className="text-2xl font-bold">{pendingMaintenances}</p>
            <p className="text-xs text-gray-500">À traiter</p>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Liste des maintenances</h2>
        </div>
        <div className="p-4">
          <DataTable 
            columns={columns} 
            data={safeMaintenances}
            isLoading={isLoading}
            emptyMessage="Aucune maintenance disponible"
          />
        </div>
      </div>

      <AddMaintenanceDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
      
      <EditMaintenanceDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog} 
        maintenance={selectedMaintenance} 
      />
      
      <ViewMaintenanceDialog 
        open={showViewDialog} 
        onClose={() => setShowViewDialog(false)} 
        maintenance={selectedMaintenance}
        vehicleInfo={selectedMaintenance ? getVehicleInfo(selectedMaintenance.vehicleId) : ''}
        clientInfo={selectedMaintenance ? getClientInfo(selectedMaintenance.clientId) : ''}
        mechanicInfo={selectedMaintenance ? getMechanicInfo(selectedMaintenance.mechanicId) : ''}
      />
      
      <DeleteMaintenanceDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog} 
        maintenanceId={selectedMaintenance?.id} 
      />
    </div>
  );
};

export default GarageMaintenanceDashboard;
