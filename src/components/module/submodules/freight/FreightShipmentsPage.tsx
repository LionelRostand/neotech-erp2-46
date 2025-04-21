
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { Shipment } from '@/types/freight';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useFreightData from '@/hooks/modules/useFreightData';
import ShipmentCreateDialog from './ShipmentCreateDialog';
import ShipmentViewDialog from './ShipmentViewDialog';
import ShipmentDeleteDialog from './ShipmentDeleteDialog';
import ShipmentEditDialog from './ShipmentEditDialog';
import StatusBadge from '@/components/module/submodules/StatusBadge';
import { format } from 'date-fns';

const FreightShipmentsPage: React.FC = () => {
  const { shipments, loading } = useFreightData();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Safely filter shipments by checking if the search string exists in any field
  const filteredShipments = shipments.filter(shipment => {
    if (!search.trim()) return true;
    
    // Safely check each field that might be searched, handling undefined values
    const searchLower = search.toLowerCase();
    return (
      (shipment.reference && shipment.reference.toLowerCase().includes(searchLower)) ||
      (shipment.origin && shipment.origin.toLowerCase().includes(searchLower)) ||
      (shipment.destination && shipment.destination.toLowerCase().includes(searchLower)) ||
      (shipment.customer && shipment.customer.toLowerCase().includes(searchLower)) ||
      (shipment.carrierName && shipment.carrierName.toLowerCase().includes(searchLower)) ||
      (shipment.status && shipment.status.toLowerCase().includes(searchLower))
    );
  });

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    // You might want to refresh your data here if not using real-time updates
  };

  const columns = [
    {
      header: "Référence",
      accessorKey: "reference",
    },
    {
      header: "Origine",
      accessorKey: "origin",
    },
    {
      header: "Destination",
      accessorKey: "destination",
    },
    {
      header: "Client",
      accessorKey: "customer",
    },
    {
      header: "Transporteur",
      accessorKey: "carrierName",
    },
    {
      header: "Type",
      accessorKey: "shipmentType",
      cell: ({ row }: { row: { original: Shipment } }) => {
        const shipment = row.original;
        return (
          <div className="capitalize">
            {shipment.shipmentType === 'import' ? 'Import' :
             shipment.shipmentType === 'export' ? 'Export' :
             shipment.shipmentType === 'local' ? 'Local' : 'International'}
          </div>
        );
      }
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }: { row: { original: Shipment } }) => {
        const shipment = row.original;
        return (
          <StatusBadge 
            status={shipment.status} 
            statusMapping={{
              draft: {label: "Brouillon", color: "gray"},
              confirmed: {label: "Confirmé", color: "blue"},
              in_transit: {label: "En transit", color: "yellow"},
              delivered: {label: "Livré", color: "green"},
              cancelled: {label: "Annulé", color: "red"},
              delayed: {label: "Retardé", color: "orange"}
            }}
          />
        );
      }
    },
    {
      header: "Date Prévue",
      accessorKey: "scheduledDate",
      cell: ({ row }: { row: { original: Shipment } }) => {
        const shipment = row.original;
        return shipment.scheduledDate ? format(new Date(shipment.scheduledDate), 'dd/MM/yyyy') : '-';
      }
    },
    {
      header: "Coût",
      accessorKey: "totalPrice",
      cell: ({ row }: { row: { original: Shipment } }) => {
        const shipment = row.original;
        return shipment.totalPrice ? `${shipment.totalPrice.toFixed(2)} €` : '-';
      }
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }: { row: { original: Shipment } }) => {
        const shipment = row.original;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedShipment(shipment);
                setIsViewOpen(true);
              }}
            >
              Voir
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedShipment(shipment);
                setIsEditOpen(true);
              }}
            >
              Modifier
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-500 hover:text-red-700" 
              onClick={() => {
                setSelectedShipment(shipment);
                setIsDeleteOpen(true);
              }}
            >
              Supprimer
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Expéditions</h1>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Nouvelle Expédition
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Expéditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher une expédition..."
                className="w-full pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <DataTable
            columns={columns}
            data={filteredShipments}
            isLoading={loading}
            emptyMessage="Aucune expédition trouvée"
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ShipmentCreateDialog 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onCreated={handleCreateSuccess}
      />
      
      {selectedShipment && (
        <>
          <ShipmentViewDialog 
            shipment={selectedShipment}
            isOpen={isViewOpen} 
            onClose={() => {
              setIsViewOpen(false);
              setSelectedShipment(null);
            }} 
          />
          
          <ShipmentEditDialog 
            shipment={selectedShipment}
            isOpen={isEditOpen} 
            onClose={() => {
              setIsEditOpen(false);
              setSelectedShipment(null);
            }} 
            onUpdated={() => {
              setIsEditOpen(false);
              setSelectedShipment(null);
              // Refresh data if needed
            }}
          />
          
          <ShipmentDeleteDialog 
            shipment={selectedShipment}
            isOpen={isDeleteOpen} 
            onClose={() => {
              setIsDeleteOpen(false);
              setSelectedShipment(null);
            }} 
            onDeleted={() => {
              setIsDeleteOpen(false);
              setSelectedShipment(null);
              // Refresh data if needed
            }}
          />
        </>
      )}
    </div>
  );
};

export default FreightShipmentsPage;
