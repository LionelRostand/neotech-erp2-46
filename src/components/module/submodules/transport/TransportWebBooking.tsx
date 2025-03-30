
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Globe, Search, Settings, 
  CheckSquare, Copy, Eye, AlertTriangle, 
  LineChart, Users, Smartphone, Palette 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const TransportWebBooking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reservations');
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockBookings = [
    {
      id: 'B-2023-0012',
      customerName: 'Marie Laurent',
      date: '2023-06-05',
      time: '14:30',
      pickupAddress: '15 Rue de Rivoli, Paris',
      dropoffAddress: 'Aéroport Charles de Gaulle, Terminal 2E',
      status: 'confirmed',
      paymentStatus: 'paid',
      amount: 65.50,
      vehicleType: 'sedan'
    },
    {
      id: 'B-2023-0011',
      customerName: 'Jean Dubois',
      date: '2023-06-04',
      time: '09:15',
      pickupAddress: '8 Avenue des Champs-Élysées, Paris',
      dropoffAddress: 'Gare de Lyon, Paris',
      status: 'completed',
      paymentStatus: 'paid',
      amount: 42.00,
      vehicleType: 'sedan'
    },
    {
      id: 'B-2023-0010',
      customerName: 'Sophie Martin',
      date: '2023-06-03',
      time: '18:45',
      pickupAddress: '25 Rue du Faubourg Saint-Honoré, Paris',
      dropoffAddress: '7 Place de Fontenoy, Paris',
      status: 'cancelled',
      paymentStatus: 'refunded',
      amount: 38.75,
      vehicleType: 'eco'
    },
    {
      id: 'B-2023-0009',
      customerName: 'Pierre Lefèvre',
      date: '2023-06-03',
      time: '11:00',
      pickupAddress: 'Aéroport d\'Orly, Terminal Sud',
      dropoffAddress: '36 Rue de Seine, Paris',
      status: 'pending',
      paymentStatus: 'pending',
      amount: 58.25,
      vehicleType: 'van'
    },
  ];
  
  const mockAnalytics = {
    totalBookings: 283,
    todayBookings: 12,
    conversionRate: 14.3,
    averageValue: 52.80
  };
  
  const mockWebsiteStats = {
    visitors: 1840,
    pageviews: 5420,
    bookingAttempts: 365,
    searches: 925,
    mobilePct: 76,
    desktopPct: 24
  };

  const filteredBookings = mockBookings.filter(booking => 
    booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.dropoffAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Fonction pour afficher le statut sous forme de badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-500">Confirmée</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Fonction pour afficher le statut de paiement
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Payé</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'refunded':
        return <Badge className="bg-orange-500">Remboursé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Gérer les actions
  const handleViewDetails = (bookingId: string) => {
    toast.info(`Voir les détails pour la réservation ${bookingId}`);
  };
  
  const handleDuplicate = (bookingId: string) => {
    toast.success("Réservation dupliquée avec succès");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Réservation Web</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{mockAnalytics.totalBookings}</div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Réservations aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{mockAnalytics.todayBookings}</div>
              <CheckSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{mockAnalytics.conversionRate}%</div>
              <LineChart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valeur moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{mockAnalytics.averageValue.toFixed(2)} €</div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher une réservation..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ml-4">
              <Button>Nouvelle réservation</Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reservations" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Réservations</span>
              </TabsTrigger>
              <TabsTrigger value="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Statistiques site web</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Configuration</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reservations" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Réservation</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date & Heure</TableHead>
                      <TableHead>Trajet</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Paiement</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucune réservation trouvée.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.customerName}</TableCell>
                          <TableCell>
                            {new Date(booking.date).toLocaleDateString('fr-FR')} {booking.time}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold">De:</span>
                              <span className="text-sm truncate" title={booking.pickupAddress}>{booking.pickupAddress}</span>
                              <span className="text-xs font-semibold mt-1">À:</span>
                              <span className="text-sm truncate" title={booking.dropoffAddress}>{booking.dropoffAddress}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                          <TableCell>{booking.amount.toFixed(2)} €</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewDetails(booking.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDuplicate(booking.id)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="website" className="pt-4">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Visiteurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockWebsiteStats.visitors}</div>
                      <p className="text-xs text-muted-foreground">30 derniers jours</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Pages vues</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockWebsiteStats.pageviews}</div>
                      <p className="text-xs text-muted-foreground">30 derniers jours</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Tentatives de réservation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{mockWebsiteStats.bookingAttempts}</div>
                      <p className="text-xs text-muted-foreground">30 derniers jours</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Répartition par appareil</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Mobile</p>
                            <p className="text-sm text-muted-foreground">{mockWebsiteStats.mobilePct}%</p>
                          </div>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">Desktop</p>
                            <p className="text-sm text-muted-foreground">{mockWebsiteStats.desktopPct}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${mockWebsiteStats.mobilePct}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Alertes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-800">Taux d'abandon élevé</p>
                            <p className="text-sm text-yellow-700 mt-1">
                              Taux d'abandon du formulaire de réservation: 35%
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm" className="text-xs">
                            Voir toutes les alertes
                          </Button>
                          
                          <Button variant="outline" size="sm" className="text-xs">
                            Configurer les alertes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Optimisation du site web</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-md">
                            <Globe className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Configuration SEO</p>
                            <p className="text-sm text-muted-foreground">
                              Optimisez les mots-clés et métadonnées
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Configurer</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-md">
                            <Palette className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Apparence et thème</p>
                            <p className="text-sm text-muted-foreground">
                              Personnalisez l'interface de votre site
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Personnaliser</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="pt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de réservation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-6 text-gray-500">
                      Cette fonctionnalité est en cours de développement.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportWebBooking;
