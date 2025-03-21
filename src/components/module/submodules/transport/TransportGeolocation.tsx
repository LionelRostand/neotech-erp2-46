
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, AlertTriangle, Navigation, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransportVehicle } from './types/transport-types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for vehicles with location
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
    location: {
      lat: 48.8417,
      lng: 2.3324,
      lastUpdate: "2023-06-01T14:28:00",
      speed: 32,
      status: "en service"
    }
  }
];

// Mock alerts for the alerts tab
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

// Mock routes optimization data
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

  // Filter vehicles based on search term
  const filteredVehicles = mockVehicles.filter(vehicle => 
    vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter alerts based on search term
  const filteredAlerts = mockAlerts.filter(alert => 
    alert.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render status badge for vehicle
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

  // Render alert badge
  const renderAlertBadge = (type: string, status: string) => {
    let bgColor = "bg-red-500";
    
    if (status === 'resolved') {
      bgColor = "bg-gray-500";
    }
    
    return <Badge className={bgColor}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Géolocalisation des Véhicules</h2>
      </div>
      
      {/* Search and filters */}
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                <span>Suivi en Temps Réel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={mapRef} 
                className="h-[400px] bg-gray-100 rounded-md mb-6 flex items-center justify-center"
              >
                <div className="text-center">
                  <Map className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Carte interactive de géolocalisation disponible dans la prochaine mise à jour.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Localisation des véhicules</h3>
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
