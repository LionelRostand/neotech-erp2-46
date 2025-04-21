
import React, { useState } from 'react';
import { useShipments } from './hooks/useShipments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PackageSearch, RefreshCw, Plus, Filter } from 'lucide-react';
import { Shipment } from '@/types/freight';
import ShipmentWizardDialog from './ShipmentWizardDialog';
import ShipmentViewDialog from './ShipmentViewDialog';
import ShipmentDeleteDialog from './ShipmentDeleteDialog';
import ShipmentEditDialog from './ShipmentEditDialog';
import { FirebaseErrorAlert } from './components/FirebaseErrorAlert';

const FreightShipmentsPage = () => {
  const [currentTab, setCurrentTab] = useState<'all' | 'ongoing' | 'delivered' | 'delayed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Use the enhanced hook with retry capability
  const { shipments, isLoading, error, retry } = useShipments(currentTab);

  // Filter shipments based on search query
  const filteredShipments = searchQuery
    ? shipments.filter(
        (shipment) =>
          shipment.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shipment.customer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : shipments;

  // Handlers for dialogs
  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsViewDialogOpen(true);
  };

  const handleEditShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsEditDialogOpen(true);
  };

  const handleDeleteShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-200 text-gray-800';
      case 'confirmed':
        return 'bg-blue-200 text-blue-800';
      case 'in_transit':
        return 'bg-yellow-200 text-yellow-800';
      case 'delivered':
        return 'bg-green-200 text-green-800';
      case 'delayed':
        return 'bg-red-200 text-red-800';
      case 'cancelled':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'confirmed':
        return 'Confirmé';
      case 'in_transit':
        return 'En transit';
      case 'delivered':
        return 'Livré';
      case 'delayed':
        return 'Retardé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Expéditions</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
          <Plus size={18} />
          Nouvelle Expédition
        </Button>
      </div>

      {/* Recherche et filtres */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <PackageSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher par référence, origine, destination ou client..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-1">
          <Filter size={16} />
          Filtres
        </Button>
      </div>

      {/* Affichage de l'erreur Firebase si présente */}
      {error && (
        <FirebaseErrorAlert
          error={error}
          onRetry={retry}
          className="mb-6"
        />
      )}

      {/* Tabs pour filtrer par statut */}
      <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="ongoing">En cours</TabsTrigger>
          <TabsTrigger value="delivered">Livrées</TabsTrigger>
          <TabsTrigger value="delayed">Retardées</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tableau des expéditions */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Aucune expédition trouvée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    De
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    À
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transporteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date prévue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {shipment.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.origin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.destination}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment.carrierName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(shipment.scheduledDate).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          shipment.status
                        )}`}
                      >
                        {getStatusText(shipment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewShipment(shipment)}
                      >
                        Voir
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditShipment(shipment)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteShipment(shipment)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <ShipmentWizardDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {selectedShipment && (
        <>
          <ShipmentViewDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            shipment={selectedShipment}
          />
          <ShipmentEditDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            shipment={selectedShipment}
          />
          <ShipmentDeleteDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            shipment={selectedShipment}
          />
        </>
      )}
    </div>
  );
};

export default FreightShipmentsPage;
