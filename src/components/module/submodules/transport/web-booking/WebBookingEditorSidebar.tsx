
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from '@/components/ui/switch';

const WebBookingEditorSidebar = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="layout">Mise en page</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="space-y-4">
            <div>
              <Label htmlFor="site-name">Nom du site</Label>
              <Input id="site-name" placeholder="Réservation de transport" />
            </div>
            
            <div>
              <Label htmlFor="site-description">Description</Label>
              <Textarea 
                id="site-description" 
                placeholder="Réservez votre transport facilement et rapidement"
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="logo-url">URL du logo</Label>
              <Input id="logo-url" placeholder="https://votre-site.com/logo.png" />
            </div>
            
            <div>
              <Label htmlFor="favicon">Favicon</Label>
              <Input id="favicon" type="file" />
            </div>
            
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="meta">
                <AccordionTrigger>Métadonnées SEO</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div>
                      <Label htmlFor="meta-title">Titre Meta</Label>
                      <Input id="meta-title" placeholder="Réservation de transport" />
                    </div>
                    
                    <div>
                      <Label htmlFor="meta-description">Description Meta</Label>
                      <Textarea 
                        id="meta-description" 
                        placeholder="Réservez votre transport facilement et rapidement"
                        className="resize-none"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="meta-keywords">Mots-clés</Label>
                      <Input id="meta-keywords" placeholder="transport, réservation, chauffeur" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="layout">
          <div className="space-y-4">
            <div>
              <Label htmlFor="layout-template">Template</Label>
              <Select defaultValue="standard">
                <SelectTrigger id="layout-template">
                  <SelectValue placeholder="Choisir un template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="modern">Moderne</SelectItem>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="advanced">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="header-style">Style de l'en-tête</Label>
              <Select defaultValue="centered">
                <SelectTrigger id="header-style">
                  <SelectValue placeholder="Choisir un style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centered">Centré</SelectItem>
                  <SelectItem value="left">Aligné à gauche</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="hero">Hero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="show-header">Afficher l'en-tête</Label>
              <Switch id="show-header" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="show-footer">Afficher le pied de page</Label>
              <Switch id="show-footer" defaultChecked />
            </div>
            
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="sections">
                <AccordionTrigger>Sections de la page</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">En-tête</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Formulaire de réservation</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Services</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Témoignages</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">FAQ</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pied de page</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="components">
                <AccordionTrigger>Composants</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Galerie d'images</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Carte de localisation</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bouton d'appel</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Icônes sociales</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
        
        <TabsContent value="style">
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="primary-color">Couleur principale</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id="primary-color" 
                    type="color" 
                    defaultValue="#1E40AF" 
                    className="w-12 h-10 p-1"
                  />
                  <Input defaultValue="#1E40AF" className="flex-1" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="secondary-color">Couleur secondaire</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id="secondary-color" 
                    type="color" 
                    defaultValue="#60A5FA" 
                    className="w-12 h-10 p-1"
                  />
                  <Input defaultValue="#60A5FA" className="flex-1" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="text-color">Couleur du texte</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id="text-color" 
                    type="color" 
                    defaultValue="#111827" 
                    className="w-12 h-10 p-1"
                  />
                  <Input defaultValue="#111827" className="flex-1" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="background-color">Arrière-plan</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    id="background-color" 
                    type="color" 
                    defaultValue="#F9FAFB" 
                    className="w-12 h-10 p-1"
                  />
                  <Input defaultValue="#F9FAFB" className="flex-1" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="font-family">Police</Label>
                <Select defaultValue="inter">
                  <SelectTrigger id="font-family">
                    <SelectValue placeholder="Choisir une police" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inter">Inter</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                    <SelectItem value="opensans">Open Sans</SelectItem>
                    <SelectItem value="montserrat">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="border-radius">Coins arrondis</Label>
                <Select defaultValue="md">
                  <SelectTrigger id="border-radius">
                    <SelectValue placeholder="Choisir un style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="sm">Petit (2px)</SelectItem>
                    <SelectItem value="md">Moyen (4px)</SelectItem>
                    <SelectItem value="lg">Grand (8px)</SelectItem>
                    <SelectItem value="full">Complet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="advanced-style">
                <AccordionTrigger>Style avancé</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div>
                      <Label htmlFor="button-style">Style des boutons</Label>
                      <Select defaultValue="filled">
                        <SelectTrigger id="button-style">
                          <SelectValue placeholder="Choisir un style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="filled">Rempli</SelectItem>
                          <SelectItem value="outline">Contour</SelectItem>
                          <SelectItem value="ghost">Fantôme</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="input-style">Style des champs</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="input-style">
                          <SelectValue placeholder="Choisir un style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="filled">Rempli</SelectItem>
                          <SelectItem value="outline">Contour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="shadow-style">Style des ombres</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="shadow-style">
                          <SelectValue placeholder="Choisir un style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucune</SelectItem>
                          <SelectItem value="small">Légère</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="large">Prononcée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-css">CSS personnalisé</Label>
                      <Textarea 
                        id="custom-css" 
                        placeholder=".booking-form { border: 1px solid #eee; }"
                        className="font-mono text-xs"
                        rows={4}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="pt-4 border-t">
        <Button className="w-full">Appliquer les changements</Button>
      </div>
    </div>
  );
};

export default WebBookingEditorSidebar;
