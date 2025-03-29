import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, AlertTriangle, Navigation, Bell, Search, Settings, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransportVehicle } from './types/transport-types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTransportMap } from './hooks/useTransportMap';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const mockVehicles: (TransportVehicle & { 
  location?: { lat: number; lng: number; lastUpdate: string; speed: number; status: string; }
})[] = [
  {
    id: "v1",
    name: "Mercedes Classe E",
    type: "sedan",
    capacity: 4,
    licensePlate: "AB-123-CD",
    available: false,
    status: "active",
    color: "white",
    fuelType: "diesel",
    location: {
      lat: 48.856614,
      lng: 2.3522219,
      lastUpdate: "2023-06-01T14:32:00",
      speed: 45,
      status: "en service"
    }
  },
  {
    id: "v2",
    name: "Tesla Model S",
    type: "luxury",
    capacity: 5,
    licensePlate: "EF-456-GH",
    available: false,
    status: "active",
    color: "black",
    fuelType: "electric",
    location: {
      lat: 48.8584,
      lng: 2.2945,
      lastUpdate: "2023-06-01T14:30:00",
      speed: 0,
      status: "arrêté"
    }
  },
  {
    id: "v3",
    name: "Renault Trafic",
    type: "van",
    capacity: 9,
    licensePlate: "IJ-789-KL",
    available: true,
    status: "maintenance",
    color: "silver",
    fuelType: "diesel",
    location: {
      lat: 48.8737,
      lng: 2.2950,
      lastUpdate: "2023-06-01T13:15:00",
      speed: 0,
      status: "maintenance"
    }
  },
  {
    id: "v4",
    name: "BMW Série 5",
    type: "sedan",
    capacity: 5,
    licensePlate: "MN-012-OP",
    available: true,
    status: "active",
    color: "blue",
    fuelType: "gasoline",
    location: {
      lat: 48.8417,
      lng: 2.3324,
      lastUpdate: "2023-06-01T14:28:00",
      speed: 32,
      status: "en service"
    }
  }
];

const mockAlerts = [
  { 
    id: 'a1', 
    vehicleId: 'v4', 
    vehicleName: 'BMW Série 5', 
    licensePlate: 'MN-012-OP', 
    type: 'unauthorized', 
    message: 'Utilisation en dehors des heures de service', 
    timestamp: '2023-06-01T02:14:00', 
    status: 'unresolved'
  },
  { 
    id: 'a2', 
    vehicleId: 'v1', 
    vehicleName: 'Mercedes Classe E', 
    licensePlate: 'AB-123-CD', 
    type: 'speeding', 
    message: 'Excès de vitesse: 95 km/h en zone 50', 
    timestamp: '2023-06-01T11:23:00', 
    status: 'resolved'
  },
  { 
    id: 'a3', 
    vehicleId: 'v2', 
    vehicleName: 'Tesla Model S', 
    licensePlate: 'EF-456-GH', 
    type: 'geofence', 
    message: 'Véhicule hors zone autorisée', 
    timestamp: '2023-06-01T09:45:00', 
    status: 'unresolved'
  }
];

const mockRoutes = [
  {
    id: 'r1',
    vehicleId: 'v1',
    vehicleName: 'Mercedes Classe E',
    currentRoute: 'Paris Centre → Orly Airport',
    optimizedRoute: 'Paris Centre → A6 → Orly Airport',
    savingsMinutes: 12,
    savingsKm: 5.4
  },
  {
    id: 'r2',
    vehicleId: 'v4',
    vehicleName: 'BMW Série 5',
    currentRoute: 'Montmartre → Tour Eiffel',
    optimizedRoute: 'Montmartre → Opéra → Tour Eiffel',
    savingsMinutes: 8,
    savingsKm: 2.3
  }
];

const TransportGeolocation = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  
  const { mapInitialized, mapConfig, setMapConfig, refreshMap } = useTransportMap(mapRef, mockVehicles);

  useEffect(() => {
    if (mapRef.current && activeTab === 'map') {
      refreshMap();
    }
  }, [activeTab, refreshMap]);

  const filteredVehicles = mockVehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAlerts = mockAlerts.filter(alert => 
    alert.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "en service":
        return <Badge className="bg-green-500">En service</Badge>;
      case "arrêté":
        return <Badge className="bg-yellow-500">Arrêté</Badge>;
      case "maintenance":
        return <Badge className="bg-orange-500">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderAlertBadge = (type: string, status: string) => {
    let bgColor = "bg-red-500";
    
    if (status === 'resolved') {
      bgColor = "bg-gray-500";
    }
    
    return <Badge className={bgColor}>{type}</Badge>;
  };

  const handleMapProviderChange = (value: 'osm' | 'osm-france' | 'carto') => {
    setMapConfig({
      ...mapConfig,
      tileProvider: value
    });
    refreshMap();
  };

  const handleZoomChange = (value: number[]) => {
    setMapConfig({
      ...mapConfig,
      zoom: value[0]
    });
  };

  const handleShowLabelsChange = (checked: boolean) => {
    setMapConfig({
      ...mapConfig,
      showLabels: checked
    });
    refreshMap();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Géolocalisation des Véhicules</h2>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un véhicule par nom ou plaque d'immatriculation..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            <span>Carte en temps réel</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Alertes</span>
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            <span>Optimisation des trajets</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  <span>Suivi en Temps Réel</span>
                </CardTitle>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Settings className="h-4 w-4" />
                      <span>Configuration de la carte</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="font-medium">Configuration de la carte</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tileProvider">Fournisseur de carte</Label>
                        <Select 
                          value={mapConfig.tileProvider} 
                          onValueChange={(value: any) => handleMapProviderChange(value)}
                        >
                          <SelectTrigger id="tileProvider">
                            <SelectValue placeholder="Choisir un fournisseur" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="osm-france">OpenStreetMap France</SelectItem>
                            <SelectItem value="osm">OpenStreetMap Standard</SelectItem>
                            <SelectItem value="carto">CartoDB Light</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="zoom">Niveau de zoom</Label>
                          <span className="text-sm text-muted-foreground">{mapConfig.zoom}</span>
                        </div>
                        <Slider 
                          id="zoom"
                          min={1} 
                          max={18} 
                          step={1}
                          value={[mapConfig.zoom]}
                          onValueChange={handleZoomChange}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="showLabels">Afficher les informations détaillées</Label>
                        <Switch
                          id="showLabels"
                          checked={mapConfig.showLabels}
                          onCheckedChange={handleShowLabelsChange}
                        />
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <Button onClick={refreshMap} size="sm">
                          Appliquer
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full relative">
                <div 
                  id="map"
                  ref={mapRef} 
                  className="h-[600px] w-full bg-gray-100 rounded-md mb-6"
                  style={{ position: 'relative', zIndex: 0 }}
                >
                  {!mapInitialized && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Map className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">
                          Chargement de la carte...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Localisation des véhicules</h3>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Layers className="h-4 w-4" />
                    <span>Changer de vue</span>
                  </Button>
                </div>
                
                <div className="border rounded-md divide-y">
                  {filteredVehicles.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Aucun véhicule trouvé
                    </div>
                  ) : (
                    filteredVehicles.map((vehicle) => (
                      <div key={vehicle.id} className="p-4 flex justify-between items-center">
                        <div>
                          <div className="font-medium">{vehicle.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.licensePlate} • Dernière mise à jour: {new Date(vehicle.location?.lastUpdate || "").toLocaleTimeString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          {vehicle.location?.speed ? (
                            <span className="text-sm font-medium">{vehicle.location.speed} km/h</span>
                          ) : null}
                          {renderStatusBadge(vehicle.location?.status || "")}
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Alertes et Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 border-orange-300 bg-orange-50 text-orange-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Configuration des alertes</AlertTitle>
                <AlertDescription>
                  Vous pouvez configurer les règles d'alerte pour chaque véhicule dans les paramètres. 
                  Recevez des alertes pour excès de vitesse, utilisation non autorisée, et sortie de zone.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Alertes récentes</h3>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Bell className="h-4 w-4" />
                    Configurer
                  </Button>
                </div>
                
                <div className="border rounded-md divide-y">
                  {filteredAlerts.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Aucune alerte trouvée
                    </div>
                  ) : (
                    filteredAlerts.map((alert) => (
                      <div key={alert.id} className="p-4 flex justify-between items-center">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {renderAlertBadge(alert.type, alert.status)}
                            {alert.vehicleName} ({alert.licensePlate})
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {alert.message}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(alert.timestamp).toLocaleString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={alert.status === 'resolved'}
                          >
                            {alert.status === 'resolved' ? 'Résolu' : 'Résoudre'}
                          </Button>
                          <Button variant="outline" size="sm">
                            Détails
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="routes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                <span>Optimisation des Trajets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-md">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 pt-1">
                    <Navigation className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">Économies grâce à l'optimisation</h4>
                    <p className="text-sm text-green-700 mt-1">
                      L'optimisation des itinéraires a permis d'économiser environ 120 litres de carburant et 45 heures de trajet ce mois-ci.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Suggestions d'optimisation</h3>
                <div className="border rounded-md divide-y">
                  {mockRoutes.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Aucune optimisation disponible
                    </div>
                  ) : (
                    mockRoutes.map((route) => (
                      <div key={route.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{route.vehicleName}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Itinéraire actuel: {route.currentRoute}
                            </div>
                            <div className="text-sm mt-2 flex items-center gap-1">
                              <span className="text-green-600 font-medium">Suggestion:</span>
                              <span>{route.optimizedRoute}</span>
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              Économie: {route.savingsMinutes} min • {route.savingsKm} km
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Appliquer
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportGeolocation;
