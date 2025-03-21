
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Heart, History, Smartphone, User } from 'lucide-react';

const ClientPortalPreview = () => {
  const [activePreviewTab, setActivePreviewTab] = useState('desktop');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Espace client</CardTitle>
              <CardDescription>Configuration de l'espace client en ligne</CardDescription>
            </div>
            <Toggle defaultPressed aria-label="Activer l'espace client">Activé</Toggle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <History className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Historique des rendez-vous</p>
                  <p className="text-sm text-muted-foreground">Consultation des rendez-vous passés</p>
                </div>
              </div>
              <Toggle defaultPressed aria-label="Activer l'historique des rendez-vous" />
            </div>
            
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Gestion des rendez-vous</p>
                  <p className="text-sm text-muted-foreground">Modification et annulation</p>
                </div>
              </div>
              <Toggle defaultPressed aria-label="Activer la gestion des rendez-vous" />
            </div>
            
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Points fidélité</p>
                  <p className="text-sm text-muted-foreground">Suivi et utilisation des points</p>
                </div>
              </div>
              <Toggle defaultPressed aria-label="Activer les points fidélité" />
            </div>
            
            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Profil personnalisé</p>
                  <p className="text-sm text-muted-foreground">Préférences et informations</p>
                </div>
              </div>
              <Toggle defaultPressed aria-label="Activer le profil personnalisé" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Aperçu de l'espace client</CardTitle>
          <CardDescription>
            Visualisez l'interface client sur différents appareils
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activePreviewTab} onValueChange={setActivePreviewTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="desktop" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Version Web</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span>Version Mobile</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="desktop" className="space-y-4">
              <div className="border rounded-lg p-4 bg-card overflow-hidden">
                <div className="bg-background rounded-t-md border-t border-x p-2 flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-center flex-1 text-muted-foreground">
                    https://votre-salon.reservations.com/client
                  </div>
                </div>
                <div className="border-x border-b rounded-b-md p-6 bg-background">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Espace Client - Salon Beautiful</h3>
                      <Button variant="outline" size="sm">Déconnexion</Button>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="flex-1 border rounded-md p-4 bg-card">
                        <div className="font-medium mb-2">Prochain rendez-vous</div>
                        <div className="flex items-center mb-1 text-primary">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>22 Novembre 2023</span>
                        </div>
                        <div className="flex items-center mb-1 text-primary">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>15:30 - 16:30</span>
                        </div>
                        <div className="text-muted-foreground">Coupe et Coloration</div>
                        <div className="text-muted-foreground">Avec: Jean Dupont</div>
                        <Button size="sm" variant="outline" className="mt-3">Modifier</Button>
                      </div>
                      <div className="flex-1 border rounded-md p-4 bg-card">
                        <div className="font-medium mb-2">Fidélité</div>
                        <div className="text-3xl font-bold text-primary">250 <span className="text-sm font-normal text-muted-foreground">points</span></div>
                        <div className="text-xs text-muted-foreground mb-2">Prochain palier: 300 points</div>
                        <div className="w-full bg-muted rounded-full h-2 mb-4">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "83%" }}></div>
                        </div>
                        <Button size="sm" variant="secondary">Utiliser mes points</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mobile" className="flex justify-center">
              <div className="border-4 rounded-3xl p-2 w-64 h-[450px] bg-card">
                <div className="bg-background rounded-2xl h-full overflow-hidden relative flex flex-col">
                  <div className="bg-primary text-primary-foreground p-3 text-center font-medium">
                    Salon Beautiful
                  </div>
                  <div className="p-3 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">Bonjour, Sophie</div>
                      <div className="flex items-center">
                        <Heart className="h-3 w-3 mr-1 text-primary" />
                        <span>250 pts</span>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="font-medium mb-1">Votre prochain RDV</div>
                      <div className="flex">
                        <Calendar className="h-3 w-3 mr-1 text-primary" />
                        <span>22/11/23</span>
                        <Clock className="h-3 w-3 ml-2 mr-1 text-primary" />
                        <span>15:30</span>
                      </div>
                      <div className="mt-1">Coupe et Coloration</div>
                      <Button size="sm" variant="ghost" className="text-[10px] h-6 mt-1">Gérer</Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="text-[10px] h-8">
                        <Calendar className="h-3 w-3 mr-1" />
                        Réserver
                      </Button>
                      <Button size="sm" variant="outline" className="text-[10px] h-8">
                        <History className="h-3 w-3 mr-1" />
                        Historique
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientPortalPreview;
