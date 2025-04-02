
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface BannerConfig {
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
  backgroundImage: string;
  buttonText: string;
  buttonLink: string;
  overlay: boolean;
  overlayOpacity: number;
}

interface BannerEditorProps {
  initialConfig?: Partial<BannerConfig>;
  onConfigChange?: (config: BannerConfig) => void;
}

const BannerEditor: React.FC<BannerEditorProps> = ({ initialConfig, onConfigChange }) => {
  const { toast } = useToast();
  
  const [config, setConfig] = useState<BannerConfig>({
    title: "Réservez votre véhicule en quelques clics",
    subtitle: "Des tarifs compétitifs et un service de qualité pour tous vos déplacements",
    backgroundColor: "#003366",
    textColor: "#ffffff",
    backgroundImage: "/images/car1.jpg",
    buttonText: "Réserver maintenant",
    buttonLink: "#reservation",
    overlay: true,
    overlayOpacity: 50,
    ...initialConfig
  });

  const handleChange = (field: keyof BannerConfig, value: string | boolean | number) => {
    const updatedConfig = { ...config, [field]: value };
    setConfig(updatedConfig);
    if (onConfigChange) {
      onConfigChange(updatedConfig);
    }
  };

  const handleSave = () => {
    toast({
      title: "Bannière sauvegardée",
      description: "Les modifications de la bannière ont été enregistrées avec succès.",
    });
    if (onConfigChange) {
      onConfigChange(config);
    }
  };
  
  const handleImageSelection = () => {
    document.getElementById('banner-image-upload')?.click();
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload the file to a server
      // For now, we'll just create a temporary URL
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      handleChange('backgroundImage', imageUrl);
      
      toast({
        title: "Image téléchargée",
        description: "L'image de la bannière a été mise à jour.",
      });
    }
  };

  const getOverlayStyle = () => {
    if (!config.overlay) return {};
    return {
      backgroundColor: 'rgba(0,0,0,' + (config.overlayOpacity / 100) + ')'
    };
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Configuration de la bannière</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="banner-title">Titre principal</Label>
            <Input
              id="banner-title"
              value={config.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="banner-subtitle">Sous-titre</Label>
            <Textarea
              id="banner-subtitle"
              value={config.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="banner-text-color">Couleur du texte</Label>
              <div className="flex mt-1 gap-2">
                <input
                  type="color"
                  id="banner-text-color"
                  value={config.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-10 h-10 p-1 border rounded"
                />
                <Input
                  value={config.textColor}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="banner-bg-color">Couleur d'arrière-plan</Label>
              <div className="flex mt-1 gap-2">
                <input
                  type="color"
                  id="banner-bg-color"
                  value={config.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  className="w-10 h-10 p-1 border rounded"
                />
                <Input
                  value={config.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="banner-button-text">Texte du bouton</Label>
            <Input
              id="banner-button-text"
              value={config.buttonText}
              onChange={(e) => handleChange('buttonText', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="banner-button-link">Lien du bouton</Label>
            <Input
              id="banner-button-link"
              value={config.buttonLink}
              onChange={(e) => handleChange('buttonLink', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="banner-overlay"
                checked={config.overlay}
                onChange={(e) => handleChange('overlay', e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="banner-overlay">Activer le calque sombre</Label>
            </div>
            
            {config.overlay && (
              <div>
                <Label htmlFor="banner-overlay-opacity">Opacité du calque ({config.overlayOpacity}%)</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    id="banner-overlay-opacity"
                    min="0"
                    max="100"
                    value={config.overlayOpacity}
                    onChange={(e) => handleChange('overlayOpacity', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Image d'arrière-plan</Label>
            <div className="mt-1 border rounded-md overflow-hidden">
              <div className="relative aspect-[3/1] bg-gray-100 overflow-hidden">
                {config.backgroundImage ? (
                  <img 
                    src={config.backgroundImage} 
                    alt="Banner background" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-2 flex justify-center">
                <input
                  id="banner-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button variant="outline" onClick={handleImageSelection}>
                  <Upload className="h-4 w-4 mr-2" />
                  Changer l'image
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <Label>Aperçu de la bannière</Label>
            <div className="mt-1 rounded-md overflow-hidden">
              <div 
                className="relative aspect-[3/1] overflow-hidden"
                style={{backgroundColor: config.backgroundColor}}
              >
                {config.backgroundImage && (
                  <img 
                    src={config.backgroundImage} 
                    alt="Banner preview" 
                    className="w-full h-full object-cover"
                  />
                )}
                
                {config.overlay && (
                  <div 
                    className="absolute inset-0"
                    style={getOverlayStyle()}
                  ></div>
                )}
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <h2 
                    className="text-2xl font-bold mb-2"
                    style={{color: config.textColor}}
                  >
                    {config.title}
                  </h2>
                  
                  <p
                    className="text-sm mb-4"
                    style={{color: config.textColor}}
                  >
                    {config.subtitle}
                  </p>
                  
                  <button
                    className="px-4 py-2 rounded"
                    style={{backgroundColor: "#ff5f00", color: "white"}}
                  >
                    {config.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
};

export default BannerEditor;
