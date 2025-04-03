
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WebBookingConfig } from '../types/web-booking-types';
import { ColorPicker } from '../../website/editor/ColorPicker';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface WebBookingEditorSidebarProps {
  config: WebBookingConfig;
  onConfigUpdate: (config: Partial<WebBookingConfig>) => void;
}

interface SiteElement {
  id: string;
  name: string;
  type: string;
  isVisible: boolean;
}

const WebBookingEditorSidebar: React.FC<WebBookingEditorSidebarProps> = ({ 
  config, 
  onConfigUpdate 
}) => {
  const [activeTab, setActiveTab] = useState<string>("elements");
  const [expandedElement, setExpandedElement] = useState<string | null>(null);
  const [siteElements, setSiteElements] = useState<SiteElement[]>([
    { id: 'header', name: 'En-tête', type: 'header', isVisible: true },
    { id: 'banner', name: 'Bannière', type: 'banner', isVisible: true },
    { id: 'booking-form', name: 'Formulaire de réservation', type: 'form', isVisible: true },
    { id: 'services', name: 'Nos services', type: 'services', isVisible: true },
    { id: 'why-us', name: 'Pourquoi nous choisir', type: 'content', isVisible: true },
    { id: 'footer', name: 'Pied de page', type: 'footer', isVisible: true },
  ]);

  const updateBannerConfig = (key: string, value: any) => {
    const updatedBannerConfig = {
      ...config.bannerConfig,
      [key]: value
    };
    
    onConfigUpdate({
      bannerConfig: updatedBannerConfig
    });
  };

  const handleElementVisibilityChange = (elementId: string, isVisible: boolean) => {
    const updatedElements = siteElements.map(element => 
      element.id === elementId ? { ...element, isVisible } : element
    );
    setSiteElements(updatedElements);
    
    // Update config based on element type
    if (elementId === 'booking-form') {
      onConfigUpdate({
        enableBookingForm: isVisible
      });
    }
  };

  const handleElementSelect = (elementId: string) => {
    setExpandedElement(elementId === expandedElement ? null : elementId);
  };

  const renderElementSettings = () => {
    if (!expandedElement) return null;

    switch (expandedElement) {
      case 'banner':
        return (
          <div className="space-y-4 mt-4">
            <h3 className="font-medium">Éditer la bannière</h3>
            <div>
              <Label htmlFor="banner-title">Titre de la bannière</Label>
              <Input 
                id="banner-title" 
                value={config.bannerConfig?.title || ''} 
                onChange={(e) => updateBannerConfig('title', e.target.value)}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="banner-subtitle">Sous-titre</Label>
              <Textarea 
                id="banner-subtitle" 
                value={config.bannerConfig?.subtitle || ''} 
                onChange={(e) => updateBannerConfig('subtitle', e.target.value)}
                className="mt-1 resize-none" 
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="banner-button">Texte du bouton</Label>
              <Input 
                id="banner-button" 
                value={config.bannerConfig?.buttonText || ''} 
                onChange={(e) => updateBannerConfig('buttonText', e.target.value)}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="banner-button-link">Lien du bouton</Label>
              <Input 
                id="banner-button-link" 
                value={config.bannerConfig?.buttonLink || ''} 
                onChange={(e) => updateBannerConfig('buttonLink', e.target.value)}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label>Couleur de fond</Label>
              <ColorPicker 
                color={config.bannerConfig?.backgroundColor || '#003366'} 
                onChange={(color) => updateBannerConfig('backgroundColor', color)}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label>Couleur du texte</Label>
              <ColorPicker 
                color={config.bannerConfig?.textColor || '#ffffff'} 
                onChange={(color) => updateBannerConfig('textColor', color)}
                className="mt-1" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="banner-overlay">Calque sombre</Label>
              <Switch 
                id="banner-overlay"
                checked={config.bannerConfig?.overlay || false}
                onCheckedChange={(checked) => updateBannerConfig('overlay', checked)}
              />
            </div>
            
            {config.bannerConfig?.overlay && (
              <div>
                <Label htmlFor="banner-overlay-opacity">Opacité ({config.bannerConfig?.overlayOpacity || 50}%)</Label>
                <Input 
                  id="banner-overlay-opacity"
                  type="range"
                  min="0"
                  max="100"
                  value={config.bannerConfig?.overlayOpacity || 50}
                  onChange={(e) => updateBannerConfig('overlayOpacity', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label htmlFor="banner-background-image">Image d'arrière-plan</Label>
              <Input 
                id="banner-background-image" 
                value={config.bannerConfig?.backgroundImage || ''} 
                onChange={(e) => updateBannerConfig('backgroundImage', e.target.value)}
                className="mt-1" 
                placeholder="URL de l'image"
              />
            </div>
          </div>
        );
        
      case 'booking-form':
        return (
          <div className="space-y-4 mt-4">
            <h3 className="font-medium">Formulaire de réservation</h3>
            <div>
              <Label htmlFor="booking-title">Titre de la section</Label>
              <Input 
                id="booking-title" 
                value="Réservez votre véhicule en quelques clics" 
                onChange={(e) => onConfigUpdate({ title: e.target.value })}
                className="mt-1" 
              />
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="fields">
                <AccordionTrigger>Champs requis</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="field-pickup">Lieu de prise en charge</Label>
                      <Switch 
                        id="field-pickup"
                        checked={config.requiredFields?.includes('pickup_location') ?? true}
                        onCheckedChange={(checked) => {
                          const fields = [...(config.requiredFields || [])];
                          if (checked && !fields.includes('pickup_location')) {
                            fields.push('pickup_location');
                          } else if (!checked) {
                            const index = fields.indexOf('pickup_location');
                            if (index !== -1) fields.splice(index, 1);
                          }
                          onConfigUpdate({ requiredFields: fields });
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="field-dropoff">Lieu de restitution</Label>
                      <Switch 
                        id="field-dropoff"
                        checked={config.requiredFields?.includes('dropoff_location') ?? true}
                        onCheckedChange={(checked) => {
                          const fields = [...(config.requiredFields || [])];
                          if (checked && !fields.includes('dropoff_location')) {
                            fields.push('dropoff_location');
                          } else if (!checked) {
                            const index = fields.indexOf('dropoff_location');
                            if (index !== -1) fields.splice(index, 1);
                          }
                          onConfigUpdate({ requiredFields: fields });
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="field-dates">Dates de location</Label>
                      <Switch 
                        id="field-dates"
                        checked={config.requiredFields?.includes('pickup_date') ?? true}
                        onCheckedChange={(checked) => {
                          const fields = [...(config.requiredFields || [])];
                          if (checked && !fields.includes('pickup_date')) {
                            fields.push('pickup_date');
                            if (!fields.includes('dropoff_date')) fields.push('dropoff_date');
                          } else if (!checked) {
                            const index1 = fields.indexOf('pickup_date');
                            const index2 = fields.indexOf('dropoff_date');
                            if (index1 !== -1) fields.splice(index1, 1);
                            if (index2 !== -1) fields.splice(index2, 1);
                          }
                          onConfigUpdate({ requiredFields: fields });
                        }}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );
        
      case 'services':
        return (
          <div className="space-y-4 mt-4">
            <h3 className="font-medium">Section Services</h3>
            <div>
              <Label htmlFor="services-title">Titre de la section</Label>
              <Input 
                id="services-title" 
                defaultValue="Nos services" 
                className="mt-1" 
              />
            </div>
            
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Services</h4>
                <Button variant="ghost" size="sm">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded-md bg-background">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span>Réservation rapide</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md bg-background">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span>Annulation gratuite</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-2 border rounded-md bg-background">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span>Meilleur prix garanti</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            Sélectionnez un élément pour l'éditer
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="elements" className="flex-1">Éléments</TabsTrigger>
          <TabsTrigger value="styles" className="flex-1">Styles</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="elements" className="mt-0">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Éléments du site</h3>
              <div className="space-y-2">
                {siteElements.map(element => (
                  <div 
                    key={element.id}
                    onClick={() => handleElementSelect(element.id)}
                    className={`border rounded-md p-3 cursor-pointer 
                      ${expandedElement === element.id ? 'bg-primary/10 border-primary/30' : 'bg-background hover:bg-accent/20'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <span>{element.name}</span>
                      </div>
                      <Switch 
                        checked={element.isVisible}
                        onCheckedChange={(checked) => handleElementVisibilityChange(element.id, checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un élément
              </Button>
            </div>
            
            {renderElementSettings()}
          </div>
        </TabsContent>
        
        <TabsContent value="styles" className="mt-0">
          <div className="space-y-4">
            <h3 className="font-medium mb-2">Style global</h3>
            
            <div>
              <Label htmlFor="primary-color">Couleur principale</Label>
              <div className="mt-1">
                <ColorPicker 
                  color={config.primaryColor || '#ff5f00'} 
                  onChange={(color) => onConfigUpdate({ primaryColor: color })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="secondary-color">Couleur secondaire</Label>
              <div className="mt-1">
                <ColorPicker 
                  color={config.secondaryColor || '#003366'} 
                  onChange={(color) => onConfigUpdate({ secondaryColor: color })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="font-family">Police de caractères</Label>
              <select
                id="font-family"
                value={config.fontFamily || 'Inter'}
                onChange={(e) => onConfigUpdate({ fontFamily: e.target.value })}
                className="w-full rounded-md border border-input p-2 mt-1"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Open Sans">Open Sans</option>
              </select>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">En-tête</h3>
              
              <div>
                <Label htmlFor="header-bg">Couleur d'arrière-plan</Label>
                <div className="mt-1">
                  <ColorPicker 
                    color={config.headerBackground || '#ffffff'} 
                    onChange={(color) => onConfigUpdate({ headerBackground: color })}
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Pied de page</h3>
              
              <div>
                <Label htmlFor="footer-bg">Couleur d'arrière-plan</Label>
                <div className="mt-1">
                  <ColorPicker 
                    color={config.footerBackground || '#f5f5f5'} 
                    onChange={(color) => onConfigUpdate({ footerBackground: color })}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <div className="space-y-4">
            <h3 className="font-medium mb-2">Paramètres du site</h3>
            
            <div>
              <Label htmlFor="site-title">Titre du site</Label>
              <Input 
                id="site-title" 
                value={config.siteTitle || config.title || ''} 
                onChange={(e) => onConfigUpdate({ siteTitle: e.target.value })}
                className="mt-1" 
              />
            </div>
            
            <div>
              <Label htmlFor="site-logo">Logo</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  id="site-logo" 
                  value={config.logo || ''} 
                  onChange={(e) => onConfigUpdate({ logo: e.target.value })}
                  placeholder="URL du logo"
                />
                <Button variant="outline">Parcourir</Button>
              </div>
              {config.logo && (
                <div className="mt-2 p-1 border rounded inline-block">
                  <img src={config.logo} alt="Logo" className="h-8" />
                </div>
              )}
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Information de contact</h3>
              
              <div>
                <Label htmlFor="contact-phone">Téléphone</Label>
                <Input 
                  id="contact-phone" 
                  value={config.contactInfo?.phone || ''} 
                  onChange={(e) => onConfigUpdate({ 
                    contactInfo: { 
                      ...config.contactInfo,
                      phone: e.target.value 
                    } 
                  })}
                  className="mt-1" 
                />
              </div>
              
              <div className="mt-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input 
                  id="contact-email" 
                  value={config.contactInfo?.email || ''} 
                  onChange={(e) => onConfigUpdate({ 
                    contactInfo: { 
                      ...config.contactInfo,
                      email: e.target.value 
                    } 
                  })}
                  className="mt-1" 
                />
              </div>
              
              <div className="mt-2">
                <Label htmlFor="contact-address">Adresse</Label>
                <Textarea 
                  id="contact-address" 
                  value={config.contactInfo?.address || ''} 
                  onChange={(e) => onConfigUpdate({ 
                    contactInfo: { 
                      ...config.contactInfo,
                      address: e.target.value 
                    } 
                  })}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebBookingEditorSidebar;
