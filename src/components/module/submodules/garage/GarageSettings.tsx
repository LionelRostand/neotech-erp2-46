
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { 
  Settings, 
  Save, 
  Bell, 
  Clock, 
  Printer, 
  Mail, 
  MessageSquare, 
  RefreshCw,
  ShieldCheck, 
  Euro
} from 'lucide-react';

const GarageSettings: React.FC = () => {
  // États pour les interrupteurs dans différentes sections
  // Notifications
  const [notifyOnAppointment, setNotifyOnAppointment] = useState(true);
  const [notifyBeforeAppointment, setNotifyBeforeAppointment] = useState(true);
  const [notifyOnCompletion, setNotifyOnCompletion] = useState(true);
  const [smsSendEnabled, setSmsSendEnabled] = useState(false);
  const [emailSendEnabled, setEmailSendEnabled] = useState(true);
  
  // Facturation
  const [automaticInvoice, setAutomaticInvoice] = useState(true);
  const [showVat, setShowVat] = useState(true);
  const [includeLaborDetails, setIncludeLaborDetails] = useState(true);
  const [includeParts, setIncludeParts] = useState(true);
  
  // Programme de fidélité
  const [loyaltyEnabled, setLoyaltyEnabled] = useState(false);
  const [pointsPerEuro, setPointsPerEuro] = useState("1");
  const [redeemThreshold, setRedeemThreshold] = useState("100");
  
  // Sauvegarde des paramètres
  const handleSaveSettings = () => {
    toast.success("Paramètres enregistrés avec succès");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Paramètres</h2>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save size={18} />
          <span>Enregistrer les modifications</span>
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="invoicing">Facturation</TabsTrigger>
          <TabsTrigger value="loyalty">Programme de fidélité</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du garage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="garage-name">Nom du garage</Label>
                  <Input id="garage-name" defaultValue="Auto Service Plus" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="garage-phone">Téléphone</Label>
                  <Input id="garage-phone" defaultValue="01 23 45 67 89" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="garage-email">Email</Label>
                  <Input id="garage-email" defaultValue="contact@autoserviceplus.fr" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="garage-address">Adresse</Label>
                  <Input id="garage-address" defaultValue="123 Avenue des Mécaniciens, 75001 Paris" />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="business-hours">Horaires d'ouverture</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="opening-time">Heure d'ouverture</Label>
                    <Input id="opening-time" type="time" defaultValue="08:30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closing-time">Heure de fermeture</Label>
                    <Input id="closing-time" type="time" defaultValue="18:30" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Notification de rendez-vous</div>
                  <div className="text-sm text-muted-foreground">
                    Recevoir une notification pour chaque nouveau rendez-vous
                  </div>
                </div>
                <Switch 
                  checked={notifyOnAppointment}
                  onCheckedChange={setNotifyOnAppointment}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Rappel avant rendez-vous</div>
                  <div className="text-sm text-muted-foreground">
                    Envoyer un rappel aux clients avant leur rendez-vous
                  </div>
                </div>
                <Switch 
                  checked={notifyBeforeAppointment}
                  onCheckedChange={setNotifyBeforeAppointment}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Notification de fin de travaux</div>
                  <div className="text-sm text-muted-foreground">
                    Notifier le client lorsque les travaux sont terminés
                  </div>
                </div>
                <Switch 
                  checked={notifyOnCompletion}
                  onCheckedChange={setNotifyOnCompletion}
                />
              </div>

              <Separator className="my-4" />

              <h3 className="text-lg font-medium">Méthodes de notification</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>SMS</div>
                  </div>
                  <Switch 
                    checked={smsSendEnabled}
                    onCheckedChange={setSmsSendEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>Email</div>
                  </div>
                  <Switch 
                    checked={emailSendEnabled}
                    onCheckedChange={setEmailSendEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoicing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de facturation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Facturation automatique</div>
                  <div className="text-sm text-muted-foreground">
                    Générer automatiquement les factures à la fin des travaux
                  </div>
                </div>
                <Switch 
                  checked={automaticInvoice}
                  onCheckedChange={setAutomaticInvoice}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Afficher la TVA</div>
                  <div className="text-sm text-muted-foreground">
                    Afficher le détail de la TVA sur les factures
                  </div>
                </div>
                <Switch 
                  checked={showVat}
                  onCheckedChange={setShowVat}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Détail de la main d'œuvre</div>
                  <div className="text-sm text-muted-foreground">
                    Inclure le détail des heures de main d'œuvre
                  </div>
                </div>
                <Switch 
                  checked={includeLaborDetails}
                  onCheckedChange={setIncludeLaborDetails}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Détail des pièces</div>
                  <div className="text-sm text-muted-foreground">
                    Inclure la liste détaillée des pièces remplacées
                  </div>
                </div>
                <Switch 
                  checked={includeParts}
                  onCheckedChange={setIncludeParts}
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="invoice-prefix">Préfixe des factures</Label>
                <Input id="invoice-prefix" defaultValue="FACT-" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-terms">Conditions de paiement</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="payment-terms">
                    <SelectValue placeholder="Sélectionner les conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Paiement immédiat</SelectItem>
                    <SelectItem value="15">15 jours</SelectItem>
                    <SelectItem value="30">30 jours</SelectItem>
                    <SelectItem value="45">45 jours</SelectItem>
                    <SelectItem value="60">60 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Programme de fidélité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Activer le programme de fidélité</div>
                  <div className="text-sm text-muted-foreground">
                    Permettre aux clients de gagner des points de fidélité
                  </div>
                </div>
                <Switch 
                  checked={loyaltyEnabled}
                  onCheckedChange={setLoyaltyEnabled}
                />
              </div>

              {loyaltyEnabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="points-per-euro">Points par euro dépensé</Label>
                    <Input 
                      id="points-per-euro" 
                      type="number" 
                      value={pointsPerEuro}
                      onChange={(e) => setPointsPerEuro(e.target.value)}
                      min="0.1" 
                      step="0.1" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="redeem-threshold">Seuil de conversion (points)</Label>
                    <Input 
                      id="redeem-threshold" 
                      type="number" 
                      value={redeemThreshold}
                      onChange={(e) => setRedeemThreshold(e.target.value)}
                      min="1" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loyalty-conversion">Valeur en euros pour {redeemThreshold} points</Label>
                    <Input id="loyalty-conversion" type="number" defaultValue="10" min="1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loyalty-expiry">Expiration des points (mois)</Label>
                    <Select defaultValue="12">
                      <SelectTrigger id="loyalty-expiry">
                        <SelectValue placeholder="Sélectionner la durée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Jamais</SelectItem>
                        <SelectItem value="6">6 mois</SelectItem>
                        <SelectItem value="12">12 mois</SelectItem>
                        <SelectItem value="24">24 mois</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="access-level">Niveau d'accès par défaut</Label>
                <Select defaultValue="employee">
                  <SelectTrigger id="access-level">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur (Accès complet)</SelectItem>
                    <SelectItem value="manager">Manager (Accès étendu)</SelectItem>
                    <SelectItem value="employee">Employé (Accès standard)</SelectItem>
                    <SelectItem value="readonly">Lecture seule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-retention">Conservation des données client (années)</Label>
                <Select defaultValue="5">
                  <SelectTrigger id="data-retention">
                    <SelectValue placeholder="Sélectionner une durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 an</SelectItem>
                    <SelectItem value="2">2 ans</SelectItem>
                    <SelectItem value="5">5 ans</SelectItem>
                    <SelectItem value="10">10 ans</SelectItem>
                    <SelectItem value="indefinite">Durée indéfinie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sauvegardes automatiques</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Fréquence des sauvegardes</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Sélectionner une fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Toutes les heures</SelectItem>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                      <SelectItem value="manual">Manuel uniquement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Exécuter une sauvegarde maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GarageSettings;
