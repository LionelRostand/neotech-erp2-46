import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Copy, Check, Globe, Calendar, Users, MapPin, Car, Code, X } from "lucide-react";
import { WebBookingStatus } from './types/reservation-types';
import { TransportService } from './types/base-types';

const TransportWebBooking = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isIntegrationOpen, setIsIntegrationOpen] = useState(false);
  const [integrationCode, setIntegrationCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const mockServices = [
    {
      id: "1",
      name: "Transport aéroport",
      description: "Navette depuis/vers l'aéroport",
      basePrice: 50,
      active: true
    },
    {
      id: "2",
      name: "Location avec chauffeur",
      description: "Service de chauffeur privé à l'heure",
      basePrice: 75,
      active: true
    },
    {
      id: "3",
      name: "Navette entreprise",
      description: "Transport régulier pour entreprises",
      basePrice: 120,
      active: false
    }
  ];

  const mockWebBookings = [
    {
      id: "wb1",
      userId: "u1",
      serviceId: "1",
      date: "2023-06-15",
      time: "14:30",
      pickup: "Aéroport Charles de Gaulle",
      dropoff: "Paris Centre",
      passengers: 3,
      specialRequirements: "Beaucoup de bagages",
      price: 65,
      isPaid: true,
      status: "confirmed" as WebBookingStatus,
      createdAt: "2023-06-10T08:15:00Z",
      updatedAt: "2023-06-10T08:20:00Z",
      service: mockServices[0]
    },
    {
      id: "wb2",
      userId: "u2",
      serviceId: "2",
      date: "2023-06-16",
      time: "09:00",
      pickup: "Hôtel Marriott",
      dropoff: "Versailles",
      passengers: 2,
      price: 150,
      isPaid: false,
      status: "new" as WebBookingStatus,
      createdAt: "2023-06-11T12:05:00Z",
      updatedAt: "2023-06-11T12:05:00Z",
      service: mockServices[1]
    },
    {
      id: "wb3",
      userId: "u3",
      serviceId: "1",
      date: "2023-06-14",
      time: "18:45",
      pickup: "Aéroport d'Orly",
      dropoff: "Montmartre",
      passengers: 1,
      price: 55,
      isPaid: true,
      status: "cancelled" as WebBookingStatus,
      createdAt: "2023-06-09T17:30:00Z",
      updatedAt: "2023-06-10T09:15:00Z",
      service: mockServices[0]
    }
  ];

  const handleGenerateCode = () => {
    setIntegrationCode(`
<!-- Code d'intégration de réservation de transport -->
<div id="transport-booking-widget" data-api-key="YOUR_API_KEY" data-service-id="1">
  <script src="https://api.votre-domaine.com/transport/booking-widget.js"></script>
</div>
    `);
    setIsIntegrationOpen(true);
    toast({
      title: "Code généré",
      description: "Le code d'intégration a été généré avec succès.",
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(integrationCode);
    setCopySuccess(true);
    toast({
      title: "Code copié",
      description: "Le code a été copié dans le presse-papiers.",
    });
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Réservation en ligne</h2>
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="integration">Intégration Web</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Réservations en ligne récentes</CardTitle>
              <CardDescription>
                Dernières réservations effectuées via votre site web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWebBookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{booking.service.name}</CardTitle>
                          <CardDescription>Réservation #{booking.id}</CardDescription>
                        </div>
                        {booking.status === "new" && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">Nouveau</Badge>
                        )}
                        {booking.status === "confirmed" && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">Confirmé</Badge>
                        )}
                        {booking.status === "cancelled" && (
                          <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">Annulé</Badge>
                        )}
                        {booking.status === "processed" && (
                          <Badge>Traité</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{booking.service.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{booking.date} à {booking.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{booking.pickup} → {booking.dropoff}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{booking.passengers} passagers</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 dark:bg-gray-800 flex justify-between">
                      <div>
                        <p className="text-sm font-medium">{booking.price.toFixed(2)} €</p>
                        <p className="text-xs text-gray-500">{booking.isPaid ? "Payé" : "Non payé"}</p>
                      </div>
                      <Button size="sm">Voir les détails</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Voir toutes les réservations</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des services</CardTitle>
              <CardDescription>
                Gérez les services disponibles à la réservation sur votre site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Transport aéroport</h3>
                    <p className="text-sm text-gray-600">Navette depuis/vers l'aéroport</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="airport-transfer-active" className="text-sm">Actif</Label>
                    <Switch id="airport-transfer-active" defaultChecked />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-start">
                  <div>
                    <Label htmlFor="airport-transfer-vip" className="text-sm">Option VIP</Label>
                    <Switch id="airport-transfer-vip" defaultChecked />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-start">
                  <div>
                    <Label htmlFor="airport-transfer-multi" className="text-sm">Multi-stops</Label>
                    <Switch id="airport-transfer-multi" />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-start">
                  <div>
                    <Label htmlFor="airport-transfer-vehicle" className="text-sm">Type de véhicule</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px] mt-1">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="sedan">Berline</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="luxury">Luxe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="airport-transfer-price" className="text-sm">Prix de base (€)</Label>
                    <Input id="airport-transfer-price" type="number" defaultValue="50" className="w-[100px] mt-1" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">Location avec chauffeur</h3>
                    <p className="text-sm text-gray-600">Service de chauffeur privé à l'heure</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="hourly-active" className="text-sm">Actif</Label>
                    <Switch id="hourly-active" defaultChecked />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-start">
                  <div>
                    <Label htmlFor="hourly-min" className="text-sm">Durée minimale</Label>
                    <Switch id="hourly-min" defaultChecked />
                  </div>
                </div>
              </Card>

              <div className="flex justify-center">
                <Button className="w-full sm:w-auto">
                  <Car className="h-4 w-4 mr-2" />
                  Ajouter un nouveau service
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Intégration sur votre site web</CardTitle>
              <CardDescription>
                Ajoutez facilement un module de réservation sur votre site internet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <h3 className="font-semibold">Module de réservation</h3>
                  <p className="text-sm text-gray-600">Créez un widget personnalisé</p>
                </div>
                <Button onClick={handleGenerateCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Générer le code
                </Button>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="domain-url" className="text-sm">URL de votre site</Label>
                  <Input id="domain-url" placeholder="https://www.votresite.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="api-key" className="text-sm">Clé API</Label>
                  <Input id="api-key" placeholder="votre-clé-api" className="mt-1" />
                </div>
              </div>

              <Card className="p-6 bg-gray-50 dark:bg-gray-800">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 mr-3 text-blue-600" />
                    <h3 className="font-semibold">Aperçu du widget</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Calendar className="h-5 w-5 mb-2 text-gray-500" />
                      <p className="text-sm font-semibold">Date et heure flexibles</p>
                      <p className="text-xs text-gray-500">Permet à vos clients de choisir le jour et l'heure qui leur conviennent</p>
                    </div>
                    <div>
                      <MapPin className="h-5 w-5 mb-2 text-gray-500" />
                      <p className="text-sm font-semibold">Adresses personnalisées</p>
                      <p className="text-xs text-gray-500">Points de prise en charge et de dépose au choix</p>
                    </div>
                    <div>
                      <Users className="h-5 w-5 mb-2 text-gray-500" />
                      <p className="text-sm font-semibold">Options de service</p>
                      <p className="text-xs text-gray-500">Sélection du nombre de passagers et des exigences spéciales</p>
                    </div>
                  </div>
                </div>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isIntegrationOpen} onOpenChange={setIsIntegrationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              <Code className="inline h-4 w-4 mr-2" />Code d'intégration
            </DialogTitle>
            <DialogDescription>
              Copiez ce code et collez-le sur votre site web.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="integration-code" className="text-sm">Code HTML</Label>
              <div className="relative">
                <Input
                  id="integration-code"
                  className="pr-10 font-mono text-xs"
                  readOnly
                  value={integrationCode}
                  onClick={handleCopyCode}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="where-to-place" className="">Où placer ce code?</Label>
              <RadioGroup defaultValue="body">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="body" id="body" />
                  <Label htmlFor="body">
                    Dans le corps de la page (<code className="text-xs bg-gray-100 p-1 rounded">&lt;body&gt;</code>)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="div" id="div" />
                  <Label htmlFor="div">
                    Dans un div existant (où vous souhaitez afficher le widget)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="widget-style" className="text-sm">Style du widget</Label>
              <Select defaultValue="light">
                <SelectTrigger id="widget-style">
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="custom">Personnalisé (utilise vos couleurs)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIntegrationOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Fermer
            </Button>
            <Button onClick={handleCopyCode}>
              {copySuccess ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copié!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le code
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransportWebBooking;
