
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, DollarSign, FileText, Users, Link, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setDocument } from "@/hooks/firestore/firestore-utils";
import { TRANSPORT_COLLECTIONS } from "@/lib/firebase-collections";

const TransportSettings = () => {
  const [saving, setSaving] = React.useState(false);

  const handleSave = (tabId: string) => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success(`Paramètres ${tabId} enregistrés avec succès`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Paramètres du Transport</h2>
      </div>
      
      <Tabs defaultValue="rates" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Tarifs
          </TabsTrigger>
          <TabsTrigger value="conditions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Conditions
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Permissions
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link className="h-4 w-4" /> Intégrations
          </TabsTrigger>
        </TabsList>

        {/* Rates Tab */}
        <TabsContent value="rates">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des Tarifs</CardTitle>
              <CardDescription>
                Définissez les tarifs de base et les modèles de tarification pour vos services de transport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Tarifs de Base</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="base-rate-sedan">Berline (par km)</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="base-rate-sedan" defaultValue="2.50" className="pl-10" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="base-rate-suv">SUV (par km)</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="base-rate-suv" defaultValue="3.20" className="pl-10" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="base-rate-van">Van (par km)</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="base-rate-van" defaultValue="3.80" className="pl-10" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="base-rate-minibus">Minibus (par km)</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="base-rate-minibus" defaultValue="4.50" className="pl-10" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="base-rate-luxury">Berline de luxe (par km)</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="base-rate-luxury" defaultValue="5.00" className="pl-10" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="minimum-fare">Tarif minimum</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="minimum-fare" defaultValue="25.00" className="pl-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Suppléments</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="night-rate">Supplément nuit (22h-6h)</Label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                          <Input id="night-rate" defaultValue="15" className="pl-10" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="weekend-rate">Supplément weekend</Label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                          <Input id="weekend-rate" defaultValue="10" className="pl-10" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="airport-fee">Frais aéroport</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="airport-fee" defaultValue="15.00" className="pl-10" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="extra-luggage">Bagages supplémentaires</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="extra-luggage" defaultValue="5.00" className="pl-10" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="wait-time">Temps d'attente (par heure)</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="wait-time" defaultValue="30.00" className="pl-10" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cancel-fee">Frais d'annulation</Label>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                          <Input id="cancel-fee" defaultValue="50" className="pl-10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Options de Tarification Spéciale</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="dynamic-pricing" />
                    <Label htmlFor="dynamic-pricing">Tarification dynamique</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="seasonal-pricing" />
                    <Label htmlFor="seasonal-pricing">Tarifs saisonniers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="corporate-rates" defaultChecked />
                    <Label htmlFor="corporate-rates">Tarifs entreprises</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSave('tarifs')}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? 'Enregistrement...' : (
                    <>
                      <Save className="h-4 w-4" />
                      Enregistrer les tarifs
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conditions Tab */}
        <TabsContent value="conditions">
          <Card>
            <CardHeader>
              <CardTitle>Conditions de Location</CardTitle>
              <CardDescription>
                Définissez les termes et conditions pour la location de véhicules avec ou sans chauffeur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Conditions Générales</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="min-rental-time">Durée minimale de location (heures)</Label>
                      <Input id="min-rental-time" type="number" defaultValue="2" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="max-rental-time">Durée maximale de location (jours)</Label>
                      <Input id="max-rental-time" type="number" defaultValue="30" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="min-notice">Préavis minimal de réservation (heures)</Label>
                      <Input id="min-notice" type="number" defaultValue="4" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="cancel-policy">Politique d'annulation</Label>
                      <Select defaultValue="24h">
                        <SelectTrigger id="cancel-policy" className="mt-1">
                          <SelectValue placeholder="Sélectionner une politique" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flexible">Flexible (1h avant)</SelectItem>
                          <SelectItem value="moderate">Modérée (12h avant)</SelectItem>
                          <SelectItem value="24h">Standard (24h avant)</SelectItem>
                          <SelectItem value="strict">Stricte (48h avant)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location sans chauffeur</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="min-driver-age">Âge minimum du conducteur</Label>
                      <Input id="min-driver-age" type="number" defaultValue="25" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="license-years">Années minimales de permis</Label>
                      <Input id="license-years" type="number" defaultValue="2" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="deposit-amount">Montant de la caution (€)</Label>
                      <Input id="deposit-amount" type="number" defaultValue="1000" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="insurance-policy">Police d'assurance</Label>
                      <Select defaultValue="comprehensive">
                        <SelectTrigger id="insurance-policy" className="mt-1">
                          <SelectValue placeholder="Sélectionner une assurance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basique</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="comprehensive">Tous risques</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Clauses Spéciales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="allow-pets" />
                    <Label htmlFor="allow-pets">Autoriser les animaux domestiques</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="allow-smoking" />
                    <Label htmlFor="allow-smoking">Autoriser de fumer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="unlimited-km" defaultChecked />
                    <Label htmlFor="unlimited-km">Kilométrage illimité</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="international" defaultChecked />
                    <Label htmlFor="international">Voyages internationaux autorisés</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSave('conditions')}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? 'Enregistrement...' : (
                    <>
                      <Save className="h-4 w-4" />
                      Enregistrer les conditions
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Permissions</CardTitle>
              <CardDescription>
                Configurez les droits d'accès des utilisateurs aux différentes fonctionnalités du module transport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Rôle</th>
                      <th className="text-center py-3 px-4 font-medium">Tableau de bord</th>
                      <th className="text-center py-3 px-4 font-medium">Réservations</th>
                      <th className="text-center py-3 px-4 font-medium">Flotte</th>
                      <th className="text-center py-3 px-4 font-medium">Chauffeurs</th>
                      <th className="text-center py-3 px-4 font-medium">Tarifs</th>
                      <th className="text-center py-3 px-4 font-medium">Paramètres</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-4 font-medium">Administrateur</td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked disabled />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked disabled />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked disabled />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked disabled />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked disabled />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked disabled />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Responsable Transport</td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Agent de réservation</td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Chauffeur</td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Comptable</td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch defaultChecked />
                      </td>
                      <td className="text-center py-3 px-4">
                        <Switch />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button variant="outline">Ajouter un rôle</Button>
                <Button 
                  onClick={() => handleSave('permissions')}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? 'Enregistrement...' : (
                    <>
                      <Save className="h-4 w-4" />
                      Enregistrer les permissions
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Intégrations</CardTitle>
              <CardDescription>
                Configurez les intégrations avec d'autres systèmes et services externes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg border flex items-center gap-4">
                    <div className="bg-background p-2 rounded-md">
                      <img src="https://cdn.worldvectorlogo.com/logos/stripe-4.svg" alt="Stripe" className="h-10 w-10" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-muted-foreground">Paiements en ligne et facturations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="stripe-api-key">Clé API Stripe</Label>
                      <Input id="stripe-api-key" type="password" defaultValue="sk_test_51Lk..." className="mt-1 font-mono" />
                    </div>
                    <div>
                      <Label htmlFor="stripe-webhook">URL Webhook Stripe</Label>
                      <Input id="stripe-webhook" defaultValue="https://votre-domaine.com/api/webhooks/stripe" className="mt-1" />
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border flex items-center gap-4">
                    <div className="bg-background p-2 rounded-md">
                      <img src="https://www.gstatic.com/images/branding/product/2x/maps_96dp.png" alt="Google Maps" className="h-10 w-10" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Google Maps</h3>
                      <p className="text-sm text-muted-foreground">Géolocalisation et calcul d'itinéraires</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="google-api-key">Clé API Google Maps</Label>
                      <Input id="google-api-key" type="password" defaultValue="AIzaSyBhI..." className="mt-1 font-mono" />
                    </div>
                    <div>
                      <Label htmlFor="maps-services">Services activés</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch id="maps-directions" defaultChecked />
                          <Label htmlFor="maps-directions">Directions API</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="maps-places" defaultChecked />
                          <Label htmlFor="maps-places">Places API</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="maps-distance" defaultChecked />
                          <Label htmlFor="maps-distance">Distance Matrix API</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg border flex items-center gap-4">
                    <div className="bg-background p-2 rounded-md">
                      <img src="https://www.gstatic.com/images/branding/product/2x/gmail_96dp.png" alt="Email" className="h-10 w-10" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Intégration Email</h3>
                      <p className="text-sm text-muted-foreground">Configuration SMTP pour l'envoi d'emails</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="smtp-server">Serveur SMTP</Label>
                      <Input id="smtp-server" defaultValue="smtp.votre-domaine.com" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="smtp-port">Port</Label>
                        <Input id="smtp-port" defaultValue="587" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="smtp-security">Sécurité</Label>
                        <Select defaultValue="tls">
                          <SelectTrigger id="smtp-security" className="mt-1">
                            <SelectValue placeholder="Choisir" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucune</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                            <SelectItem value="tls">TLS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="smtp-user">Utilisateur</Label>
                      <Input id="smtp-user" defaultValue="no-reply@votre-domaine.com" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="smtp-password">Mot de passe</Label>
                      <Input id="smtp-password" type="password" defaultValue="********" className="mt-1" />
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border flex items-center gap-4">
                    <div className="bg-background p-2 rounded-md">
                      <img src="https://cdn.worldvectorlogo.com/logos/twilio-1.svg" alt="Twilio" className="h-10 w-10" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Twilio SMS</h3>
                      <p className="text-sm text-muted-foreground">Envoi de SMS pour notifications</p>
                    </div>
                    <Switch />
                  </div>

                  <div>
                    <Label htmlFor="calendar-integration">Intégration Calendrier</Label>
                    <Select>
                      <SelectTrigger id="calendar-integration" className="mt-1">
                        <SelectValue placeholder="Sélectionner une intégration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Calendar</SelectItem>
                        <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                        <SelectItem value="apple">Apple Calendar</SelectItem>
                        <SelectItem value="none">Aucune</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSave('integrations')}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? 'Enregistrement...' : (
                    <>
                      <Save className="h-4 w-4" />
                      Enregistrer les intégrations
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportSettings;
