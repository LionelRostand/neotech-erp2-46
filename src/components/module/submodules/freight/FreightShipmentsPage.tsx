
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText, Download } from "lucide-react";
import ShipmentWizardDialog from './ShipmentWizardDialog';
import { useShipments } from './hooks/useShipments';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatusBadge from '@/components/StatusBadge';
import { Shipment } from '@/types/freight';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FirebaseErrorAlert } from './components/FirebaseErrorAlert';

const FreightShipmentsPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ongoing' | 'delivered' | 'delayed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch shipments using the hook
  const { shipments, isLoading, error } = useShipments(activeFilter);
  
  // Filter shipments by search query
  const filteredShipments = searchQuery 
    ? shipments.filter(s => 
        s.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : shipments;

  // Retry loading if there was an error
  const handleRetry = () => {
    // Le hook useShipments se réinitialisera si le filtre change
    setActiveFilter(prev => {
      // Force le raffraîchissement en basculant brièvement le filtre
      const temp = prev === 'all' ? 'ongoing' : 'all';
      setTimeout(() => setActiveFilter(prev), 10);
      return temp;
    });
  };

  // Get status badge for shipment
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <StatusBadge status="warning">Confirmée</StatusBadge>;
      case 'in_transit':
        return <StatusBadge status="warning">En transit</StatusBadge>;
      case 'delivered':
        return <StatusBadge status="success">Livrée</StatusBadge>;
      case 'cancelled':
        return <StatusBadge status="danger">Annulée</StatusBadge>;
      case 'delayed':
        return <StatusBadge status="danger">Retard</StatusBadge>;
      default:
        return <StatusBadge status="outline">Brouillon</StatusBadge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Expéditions</h1>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          onClick={() => setShowDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Expédition
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              className="px-4"
              onClick={() => setActiveFilter('all')}
            >
              Toutes
            </Button>
            <Button 
              variant={activeFilter === 'ongoing' ? 'default' : 'outline'} 
              className="px-4"
              onClick={() => setActiveFilter('ongoing')}
            >
              En cours
            </Button>
            <Button 
              variant={activeFilter === 'delivered' ? 'default' : 'outline'} 
              className="px-4"
              onClick={() => setActiveFilter('delivered')}
            >
              Livrées
            </Button>
            <Button 
              variant={activeFilter === 'delayed' ? 'default' : 'outline'} 
              className="px-4"
              onClick={() => setActiveFilter('delayed')}
            >
              Retardées
            </Button>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une expédition..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"></div>
            <span className="ml-2">Chargement des expéditions...</span>
          </div>
        ) : error ? (
          <FirebaseErrorAlert 
            error={error} 
            onRetry={handleRetry}
            className="mb-4"
          />
        ) : filteredShipments.length > 0 ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Origine</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.map((shipment: Shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.reference}</TableCell>
                    <TableCell>{shipment.customer}</TableCell>
                    <TableCell>{shipment.origin}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>
                      {shipment.createdAt ? 
                        format(new Date(shipment.createdAt), 'dd MMM yyyy', { locale: fr }) : 
                        'N/A'}
                    </TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" title="Détails">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Télécharger">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="border rounded-md px-6 py-10 text-center text-muted-foreground text-lg">
            <p>Aucune expédition trouvée</p>
            <span className="block text-sm text-muted-foreground mt-1">
              {searchQuery ? 'Essayez de modifier votre recherche' : 'Créez votre première expédition avec le bouton "Nouvelle Expédition"'}
            </span>
          </div>
        )}
      </div>
      
      <ShipmentWizardDialog open={showDialog} onOpenChange={setShowDialog} />
    </div>
  );
};

export default FreightShipmentsPage;
