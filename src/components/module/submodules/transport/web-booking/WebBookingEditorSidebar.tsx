
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WebBookingConfig } from '../types/web-booking-types';
import { ColorPicker } from '../../website/editor/ColorPicker';
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';

interface WebBookingEditorSidebarProps {
  config: WebBookingConfig;
  onConfigUpdate: (config: Partial<WebBookingConfig>) => void;
}

const WebBookingEditorSidebar: React.FC<WebBookingEditorSidebarProps> = ({ 
  config, 
  onConfigUpdate 
}) => {
  const updateBannerConfig = (key: string, value: any) => {
    const updatedBannerConfig = {
      ...config.bannerConfig,
      [key]: value
    };
    
    onConfigUpdate({
      bannerConfig: updatedBannerConfig
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Éléments du site</h3>
        <div className="space-y-4">
          <div className="border rounded-md p-3 bg-background hover:bg-accent/20 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <span>En-tête</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3 bg-background hover:bg-accent/20 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <span>Bannière</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3 bg-background hover:bg-accent/20 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <span>Formulaire de réservation</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3 bg-background hover:bg-accent/20 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <span>Nos services</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-3 bg-background hover:bg-accent/20 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <span>Pied de page</span>
              </div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un élément
          </Button>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Éditer le texte de bannière</h3>
        <div className="space-y-4">
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
        </div>
      </div>
      
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Éditer texte de réservation</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="booking-title">Titre de la section réservation</Label>
            <Input 
              id="booking-title" 
              value="Réservez votre véhicule en quelques clics" 
              onChange={(e) => onConfigUpdate({ title: e.target.value })}
              className="mt-1" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebBookingEditorSidebar;
