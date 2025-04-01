import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Globe, Settings, Users, Calendar, Car, MapPin, Code, X, Check, Copy } from 'lucide-react';
import { WebBooking, WebBookingStatus } from './types/reservation-types';
import { TransportService } from './types/base-types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

const TransportWebBooking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('configuration');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [integrationMethod, setIntegrationMethod] = useState<'iframe' | 'javascript'>('iframe');
  const [customDomain, setCustomDomain] = useState('');
  const [websiteTheme, setWebsiteTheme] = useState('light');
  
  const [formConfig, setFormConfig] = useState({
    enableDriverSelection: true,
    requireUserAccount: false,
    enablePaymentOnline: true,
    defaultService: 'airport' as TransportService,
    requirePhoneNumber: true,
    advanceBookingHours: 3,
    maxBookingDaysInFuture: 30,
    displayPricing: true
  });

  const [mockBookings] = useState<WebBooking[]>([
    {
      id: "web-001",
      name: "Marie Martin",
      email: "marie.martin@example.com",
      phone: "+33 6 12 34 56 78",
      date: "2023-11-20",
      time: "14:30",
      passengers: 2,
      status: "new",
      createdAt: "2023-11-10T15:30:00Z",
      serviceId: "airport-transfer",
      service: "Transfert Aéroport"
    },
    {
      id: "web-002",
      name: "Pierre Dubois",
      email: "pierre.dubois@example.com",
      phone: "+33 7 98 76 54 32",
      date: "2023-11-25",
      time: "09:15",
      passengers: 1,
      notes: "Bagages volumineux",
      status: "processed",
      createdAt: "2023-11-12T09:45:00Z",
      serviceId: "city-tour",
      service: "Visite de Ville"
    }
  ]);

  const handleConfigChange = (key: string, value: any) => {
    setFormConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getDomainBasedUrl = () => {
    const domain = customDomain || 'votre-domaine.com';
    return `https://${domain}/reservations-transport`;
  };

  const getIframeCode = () => {
    return `<iframe src="${getDomainBasedUrl()}" 
        width="100%" 
        height="650" 
        frameborder="0">
</iframe>`;
  };

  const getJavascriptCode = () => {
    return `<script>
  (function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '${getDomainBasedUrl()}/embed.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
</script>
<div id="transport-booking-form"></div>`;
  };

  const handleCopyCode = () => {
    const code = integrationMethod === 'iframe' ? getIframeCode() : getJavascriptCode();
    navigator.clipboard.writeText(code);
    toast.success("Code d'intégration copié dans le presse-papier");
  };

  const getStatusBadge = (status: WebBookingStatus) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">Nouvelle</Badge>;
      case "processed":
        return <Badge className="bg-green-500">Traitée</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold">Réservation Web</h2>
        <p className="text-muted-foreground">
          Configurez et gérez le système de réservation en ligne pour vos clients
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statut du module</CardTitle>
          <CardDescription>
            Le module de réservation web est actif et disponible pour vos clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium">Actif</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setConfigDialogOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Configurer l'intégration
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="configuration" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="configuration">
            <Settings className="mr-2 h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="formulaire">
            <Globe className="mr-2 h-4 w-4" />
            Formulaire
          </TabsTrigger>
          <TabsTrigger value="reservations">
            <Calendar className="mr-2 h-4 w-4" />
            Réservations
          </TabsTrigger>
          <TabsTrigger value="integration">
            <Users className="mr-2 h-4 w-4" />
            Intégration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les options principales du système de réservation en ligne.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="driver-selection">Sélection de chauffeur</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre aux clients de choisir s'ils souhaitent un chauffeur
                  </p>
                </div>
                <Switch 
                  id="driver-selection" 
                  checked={formConfig.enableDriverSelection}
                  onCheckedChange={(checked) => handleConfigChange('enableDriverSelection', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="require-account">Compte utilisateur requis</Label>
                  <p className="text-sm text-muted-foreground">
                    Obliger les clients à créer un compte pour réserver
                  </p>
                </div>
                <Switch 
                  id="require-account" 
                  checked={formConfig.requireUserAccount}
                  onCheckedChange={(checked) => handleConfigChange('requireUserAccount', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="online-payment">Paiement en ligne</Label>
                  <p className="text-sm text-muted-foreground">
                    Activer le paiement en ligne lors de la réservation
                  </p>
                </div>
                <Switch 
                  id="online-payment" 
                  checked={formConfig.enablePaymentOnline}
                  onCheckedChange={(checked) => handleConfigChange('enablePaymentOnline', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default-service">Service par défaut</Label>
                  <Select 
                    value={formConfig.defaultService} 
                    onValueChange={(value) => handleConfigChange('defaultService', value)}
                  >
                    <SelectTrigger id="default-service">
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airport">Transfert aéroport</SelectItem>
                      <SelectItem value="hourly">Service à l'heure</SelectItem>
                      <SelectItem value="pointToPoint">Point à point</SelectItem>
                      <SelectItem value="dayTour">Excursion journée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="booking-hours">Heures minimum avant réservation</Label>
                  <Input 
                    id="booking-hours" 
                    type="number" 
                    value={formConfig.advanceBookingHours}
                    onChange={(e) => handleConfigChange('advanceBookingHours', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="formulaire" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation du formulaire</CardTitle>
              <CardDescription>
                Configurez les champs et l'apparence du formulaire de réservation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Champs requis</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-phone">Numéro de téléphone</Label>
                    <Switch 
                      id="require-phone" 
                      checked={formConfig.requirePhoneNumber}
                      onCheckedChange={(checked) => handleConfigChange('requirePhoneNumber', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="display-pricing">Afficher les prix</Label>
                    <Switch 
                      id="display-pricing" 
                      checked={formConfig.displayPricing}
                      onCheckedChange={(checked) => handleConfigChange('displayPricing', checked)}
                    />
                  </div>
                </div>
                
                <div className="border rounded-md p-6">
                  <h3 className="text-lg font-medium mb-4">Aperçu du formulaire</h3>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 border rounded-md">
                      <Car className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Type de véhicule</span>
                    </div>
                    <div className="flex items-center p-2 border rounded-md">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Date et heure</span>
                    </div>
                    <div className="flex items-center p-2 border rounded-md">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Adresses</span>
                    </div>
                    <div className="flex items-center p-2 border rounded-md">
                      <Users className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Informations client</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reservations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Réservations récentes</CardTitle>
              <CardDescription>
                Consultez les réservations effectuées via le portail web.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">ID</th>
                      <th className="py-3 px-4 text-left font-medium">Client</th>
                      <th className="py-3 px-4 text-left font-medium">Service</th>
                      <th className="py-3 px-4 text-left font-medium">Date</th>
                      <th className="py-3 px-4 text-left font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBookings.map(booking => (
                      <tr key={booking.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{booking.id}</td>
                        <td className="py-3 px-4">{booking.name}</td>
                        <td className="py-3 px-4">
                          {booking.serviceId === "airport-transfer" ? 'Transfert Aéroport' : 
                           booking.serviceId === "city-tour" ? 'Visite de Ville' : 
                           booking.serviceId === "airport" ? 'Transfert aéroport' : 
                           booking.serviceId === "hourly" ? 'Service à l\'heure' : 
                           booking.serviceId === "pointToPoint" ? 'Point à point' : 'Excursion journée'}
                        </td>
                        <td className="py-3 px-4">{`${booking.date} ${booking.time}`}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(booking.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intégration</CardTitle>
              <CardDescription>
                Configurez l'intégration du formulaire de réservation sur votre site web.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Code d'intégration</h3>
                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {getIframeCode()}
                  </pre>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyCode}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copier le code
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personnalisation</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="integration-width">Largeur (px ou %)</Label>
                    <Input id="integration-width" defaultValue="100%" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="integration-height">Hauteur (px)</Label>
                    <Input id="integration-height" defaultValue="650" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-md">
                <h4 className="font-medium mb-2">Conseil d'intégration</h4>
                <p className="text-sm text-muted-foreground">
                  Pour une expérience optimale, nous recommandons de placer le formulaire de réservation sur une page dédiée de votre site web avec une largeur minimale de 600px.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de configuration d'intégration */}
      <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" /> Configuration de l'intégration web
            </DialogTitle>
            <DialogDescription>
              Personnalisez les paramètres d'intégration du formulaire de réservation sur votre site web.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domaine personnalisé</Label>
              <div className="flex gap-2">
                <span className="flex items-center bg-muted px-3 rounded-l-md border border-r-0">https://</span>
                <Input
                  id="domain"
                  placeholder="votre-domaine.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="rounded-l-none"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Le domaine sur lequel sera hébergé votre formulaire de réservation.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Méthode d'intégration</Label>
              <RadioGroup value={integrationMethod} onValueChange={(value) => setIntegrationMethod(value as 'iframe' | 'javascript')}>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="iframe" id="iframe" />
                  <Label htmlFor="iframe" className="flex-grow cursor-pointer">
                    <div className="font-medium">Iframe (Recommandé)</div>
                    <div className="text-sm text-muted-foreground">Intégration simple via un cadre iframe.</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="javascript" id="javascript" />
                  <Label htmlFor="javascript" className="flex-grow cursor-pointer">
                    <div className="font-medium">JavaScript</div>
                    <div className="text-sm text-muted-foreground">Intégration avancée avec plus de flexibilité.</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="theme">Thème d'affichage</Label>
              <Select value={websiteTheme} onValueChange={setWebsiteTheme}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Sélectionner un thème" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="auto">Automatique (selon le thème du visiteur)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Le thème visuel du formulaire de réservation.
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-md space-y-2">
              <h3 className="font-medium">Aperçu du code</h3>
              <div className="bg-black text-white p-3 rounded-md overflow-x-auto text-sm font-mono">
                {integrationMethod === 'iframe' ? getIframeCode() : getJavascriptCode()}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setConfigDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copier le code
              </Button>
              <Button onClick={() => {
                toast.success("Configuration d'intégration enregistrée");
                setConfigDialogOpen(false);
              }}>
                <Check className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransportWebBooking;
