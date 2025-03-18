
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Users, Building, Calendar, Clock, Bell } from 'lucide-react';

const EmployeesSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Paramètres des Employés</h2>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="fields">Champs personnalisés</TabsTrigger>
          <TabsTrigger value="departments">Départements</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Paramètres généraux</CardTitle>
              <CardDescription>Configuration générale du module Employés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Préférences de l'entreprise</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <Input id="companyName" defaultValue="Neotech Solutions" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select defaultValue="europe-paris">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un fuseau horaire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe-paris">Europe/Paris (UTC+1)</SelectItem>
                        <SelectItem value="europe-london">Europe/London (UTC+0)</SelectItem>
                        <SelectItem value="america-newyork">America/New_York (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Format de date</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un format de date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">DD/MM/YYYY (31/12/2025)</SelectItem>
                        <SelectItem value="us">MM/DD/YYYY (12/31/2025)</SelectItem>
                        <SelectItem value="iso">YYYY-MM-DD (2025-12-31)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Options du module</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoNumber">Numérotation automatique des employés</Label>
                      <p className="text-sm text-muted-foreground">
                        Générer automatiquement un ID unique pour chaque nouvel employé
                      </p>
                    </div>
                    <Switch id="autoNumber" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Notifications d'événements</Label>
                      <p className="text-sm text-muted-foreground">
                        Envoyer des notifications pour les événements importants
                      </p>
                    </div>
                    <Switch id="notifications" defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium mb-4">Modules activés</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className="flex items-start">
                    <Switch id="module-profiles" defaultChecked className="mt-0.5 mr-2" />
                    <div className="space-y-0.5">
                      <Label htmlFor="module-profiles" className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Profils
                      </Label>
                      <p className="text-xs text-muted-foreground">Gestion des fiches employés</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Switch id="module-departments" defaultChecked className="mt-0.5 mr-2" />
                    <div className="space-y-0.5">
                      <Label htmlFor="module-departments" className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        Départements
                      </Label>
                      <p className="text-xs text-muted-foreground">Structure organisationnelle</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Switch id="module-attendance" defaultChecked className="mt-0.5 mr-2" />
                    <div className="space-y-0.5">
                      <Label htmlFor="module-attendance" className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Présences
                      </Label>
                      <p className="text-xs text-muted-foreground">Suivi des présences</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Switch id="module-leaves" defaultChecked className="mt-0.5 mr-2" />
                    <div className="space-y-0.5">
                      <Label htmlFor="module-leaves" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Congés
                      </Label>
                      <p className="text-xs text-muted-foreground">Gestion des congés</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit">Enregistrer les paramètres</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fields">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">
                Cette section vous permet de configurer les champs personnalisés pour les fiches employés.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">
                Cette section vous permet de gérer les départements de votre organisation.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">
                Cette section vous permet de configurer les permissions d'accès aux différentes fonctionnalités.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">
                Cette section vous permet de configurer les intégrations avec d'autres services.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeesSettings;
