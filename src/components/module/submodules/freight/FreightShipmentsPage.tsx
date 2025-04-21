
import React, { useState, useEffect } from 'react';
import { useFreightData } from '@/hooks/modules/useFreightData';
import { DataTable } from '@/components/ui/data-table';
import { Shipment } from '@/types/freight';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const FreightShipmentsPage: React.FC = () => {
  const { shipments, loading } = useFreightData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (shipments) {
      let filtered = [...shipments];
      
      if (searchTerm) {
        filtered = filtered.filter(shipment => {
          // Safe checks to prevent errors when properties are undefined
          const reference = shipment.reference ? shipment.reference.toLowerCase() : '';
          const origin = shipment.origin ? shipment.origin.toLowerCase() : '';
          const destination = shipment.destination ? shipment.destination.toLowerCase() : '';
          const customer = shipment.customer ? shipment.customer.toLowerCase() : '';
          const carrierName = shipment.carrierName ? shipment.carrierName.toLowerCase() : '';
          
          const term = searchTerm.toLowerCase();
          return (
            reference.includes(term) || 
            origin.includes(term) || 
            destination.includes(term) || 
            customer.includes(term) || 
            carrierName.includes(term)
          );
        });
      }
      
      setFilteredShipments(filtered);
    }
  }, [shipments, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-200 text-gray-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'delayed': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      header: 'Référence',
      accessorKey: 'reference',
      cell: ({ row }: { row: { original: Shipment } }) => (
        <div className="font-medium">{row.original.reference}</div>
      ),
    },
    {
      header: 'Client',
      accessorKey: 'customer',
    },
    {
      header: 'Origine',
      accessorKey: 'origin',
    },
    {
      header: 'Destination',
      accessorKey: 'destination',
    },
    {
      header: 'Statut',
      accessorKey: 'status',
      cell: ({ row }: { row: { original: Shipment } }) => (
        <Badge className={getStatusColor(row.original.status)}>
          {row.original.status === 'in_transit' ? 'En transit' : 
           row.original.status === 'delivered' ? 'Livré' : 
           row.original.status === 'confirmed' ? 'Confirmé' : 
           row.original.status === 'draft' ? 'Brouillon' : 
           row.original.status === 'cancelled' ? 'Annulé' : 
           row.original.status === 'delayed' ? 'Retardé' : 
           row.original.status}
        </Badge>
      ),
    },
    {
      header: 'Date d\'expédition',
      accessorKey: 'scheduledDate',
      cell: ({ row }: { row: { original: Shipment } }) => (
        <div>{row.original.scheduledDate ? format(new Date(row.original.scheduledDate), 'dd/MM/yyyy') : '-'}</div>
      ),
    },
    {
      header: 'Transporteur',
      accessorKey: 'carrierName',
    },
    {
      header: 'Coût',
      accessorKey: 'totalPrice',
      cell: ({ row }: { row: { original: Shipment } }) => (
        <div>{row.original.totalPrice ? `${row.original.totalPrice.toLocaleString()} €` : '-'}</div>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }: { row: { original: Shipment } }) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/modules/freight/shipments/${row.original.id}`)}
          >
            <FileText className="h-4 w-4 mr-1" />
            Voir
          </Button>
        </div>
      ),
    },
  ];

  const handleCreateShipment = () => {
    navigate('/modules/freight/create-shipment');
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Gestion des Expéditions</CardTitle>
          <Button onClick={handleCreateShipment}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle Expédition
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par référence, client, origine, destination..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
    </div>
  );
};

export default FreightShipmentsPage;
