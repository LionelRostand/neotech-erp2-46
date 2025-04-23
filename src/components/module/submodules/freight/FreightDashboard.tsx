
import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Container, 
  MapPin, 
  Receipt, 
  FileText, 
  Users, 
  Route as RouteIcon,
  CarFront
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import useFreightData from '@/hooks/modules/useFreightData';
import { useUnifiedTrackingData } from '@/hooks/modules/useUnifiedTrackingData';
import useFreightInvoices from '@/hooks/modules/useFreightInvoices';
import useContainersData from '@/hooks/modules/useContainersData';

const FreightDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { shipments, clients, routes, loading } = useFreightData();
  const { containers, isLoading: containersLoading } = useContainersData();
  const { invoices, isLoading: invoicesLoading } = useFreightInvoices();
  const [searchQuery, setSearchQuery] = useState('EXP12345');
  const { data: trackingData, isLoading: trackingLoading } = useUnifiedTrackingData(searchQuery);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold">Tableau de bord du fret</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Shipments Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">Expéditions</CardTitle>
            <Package className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : shipments?.length || 0}</div>
            <CardDescription>Expéditions totales</CardDescription>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              size="sm"
              onClick={() => navigate('/modules/freight/shipments')}
            >
              Voir les expéditions
            </Button>
          </CardContent>
        </Card>

        {/* Containers Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">Conteneurs</CardTitle>
            <Container className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containersLoading ? "..." : containers?.length || 0}</div>
            <CardDescription>Conteneurs en gestion</CardDescription>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              size="sm"
              onClick={() => navigate('/modules/freight/containers')}
            >
              Voir les conteneurs
            </Button>
          </CardContent>
        </Card>

        {/* Tracking Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">Suivi</CardTitle>
            <MapPin className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trackingLoading ? "..." : trackingData?.length || 0}</div>
            <CardDescription>Éléments en suivi</CardDescription>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              size="sm"
              onClick={() => navigate('/modules/freight/tracking')}
            >
              Suivi en temps réel
            </Button>
          </CardContent>
        </Card>

        {/* Invoices Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">Factures</CardTitle>
            <Receipt className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoicesLoading ? "..." : invoices?.length || 0}</div>
            <CardDescription>Factures émises</CardDescription>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              size="sm"
              onClick={() => navigate('/modules/freight/invoices')}
            >
              Voir les factures
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Recent Shipments */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Expéditions récentes</CardTitle>
              <Package className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <p className="text-gray-500">Chargement...</p>
              </div>
            ) : shipments && shipments.length > 0 ? (
              <div className="space-y-2">
                {shipments.slice(0, 5).map((shipment) => (
                  <div key={shipment.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="font-medium">{shipment.reference}</p>
                      <p className="text-sm text-gray-500">{shipment.customerName || 'Client inconnu'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{shipment.status || 'Statut inconnu'}</p>
                      <p className="text-xs text-gray-500">
                        {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString() : 'Date inconnue'}
                      </p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-2" 
                  size="sm"
                  onClick={() => navigate('/modules/freight/shipments')}
                >
                  Voir toutes les expéditions
                </Button>
              </div>
            ) : (
              <div className="flex justify-center py-6">
                <p className="text-gray-500">Aucune expédition récente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Containers */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Conteneurs récents</CardTitle>
              <Container className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            {containersLoading ? (
              <div className="flex justify-center py-6">
                <p className="text-gray-500">Chargement...</p>
              </div>
            ) : containers && containers.length > 0 ? (
              <div className="space-y-2">
                {containers.slice(0, 5).map((container) => (
                  <div key={container.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="font-medium">{container.number}</p>
                      <p className="text-sm text-gray-500">{container.type} - {container.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{container.status}</p>
                      <p className="text-xs text-gray-500">{container.location || 'Localisation inconnue'}</p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-2"

                  size="sm"
                  onClick={() => navigate('/modules/freight/containers')}
                >
                  Voir tous les conteneurs
                </Button>
              </div>
            ) : (
              <div className="flex justify-center py-6">
                <p className="text-gray-500">Aucun conteneur actif</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {/* Clients Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">Clients</CardTitle>
            <Users className="h-5 w-5 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : clients?.length || 0}</div>
            <CardDescription>Clients enregistrés</CardDescription>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              size="sm"
              onClick={() => navigate('/modules/freight/clients')}
            >
              Gérer les clients
            </Button>
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">Documents</CardTitle>
            <FileText className="h-5 w-5 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <CardDescription>Documents archivés</CardDescription>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              size="sm"
              onClick={() => navigate('/modules/freight/documents')}
            >
              Gérer les documents
            </Button>
          </CardContent>
        </Card>

        {/* Routes Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">Routes</CardTitle>
            <RouteIcon className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : routes?.length || 0}</div>
            <CardDescription>Routes configurées</CardDescription>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              size="sm"
              onClick={() => navigate('/modules/freight/routes')}
            >
              Gérer les routes
            </Button>
          </CardContent>
        </Card>

        {/* Transports Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-lg font-medium">Transports</CardTitle>
            <CarFront className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <CardDescription>Véhicules assignés</CardDescription>
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              size="sm"
              onClick={() => navigate('/modules/freight/transports')}
            >
              Gérer les transports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightDashboard;
