
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ColorPicker } from './editor/ColorPicker';
import { useToast } from '@/components/ui/use-toast';
import { Palette, Type, Grid, Layout, Brush, Save, ArrowRight, Check } from 'lucide-react';

const WebsiteDesign = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('colors');
  
  // Theme state
  const [primaryColor, setPrimaryColor] = useState('#0066cc');
  const [secondaryColor, setSecondaryColor] = useState('#ff9900');
  const [accentColor, setAccentColor] = useState('#42b983');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#333333');
  
  // Typography state
  const [fontFamily, setFontFamily] = useState('Inter');
  const [headingFont, setHeadingFont] = useState('Inter');
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  
  // Layout state
  const [contentWidth, setContentWidth] = useState(1200);
  const [borderRadius, setBorderRadius] = useState(4);
  const [spacing, setSpacing] = useState(16);
  const [enableShadows, setEnableShadows] = useState(true);

  const handleSaveDesign = () => {
    toast({
      title: "Paramètres de design enregistrés",
      description: "Les configurations de design ont été appliquées avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Design du site</h2>
          <p className="text-muted-foreground">Personnalisez l'apparence et le style de votre site web</p>
        </div>
        <Button onClick={handleSaveDesign}>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="w-2/3">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Couleurs</span>
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <span>Typographie</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span>Mise en page</span>
              </TabsTrigger>
              <TabsTrigger value="styles" className="flex items-center gap-2">
                <Brush className="h-4 w-4" />
                <span>Styles</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <ColorPicker 
                    label="Couleur principale" 
                    color={primaryColor} 
                    onChange={setPrimaryColor} 
                  />
                  
                  <ColorPicker 
                    label="Couleur secondaire" 
                    color={secondaryColor} 
                    onChange={setSecondaryColor} 
                  />
                  
                  <ColorPicker 
                    label="Couleur d'accent" 
                    color={accentColor} 
                    onChange={setAccentColor} 
                  />
                  
                  <ColorPicker 
                    label="Couleur de fond" 
                    color={backgroundColor} 
                    onChange={setBackgroundColor} 
                  />
                  
                  <ColorPicker 
                    label="Couleur de texte" 
                    color={textColor} 
                    onChange={setTextColor} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="typography" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Police principale</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Police des titres</Label>
                    <Select value={headingFont} onValueChange={setHeadingFont}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Taille de police de base: {fontSize}px</Label>
                    </div>
                    <Slider 
                      value={[fontSize]} 
                      min={12} 
                      max={24} 
                      step={1} 
                      onValueChange={(value) => setFontSize(value[0])} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Hauteur de ligne: {lineHeight}</Label>
                    </div>
                    <Slider 
                      value={[lineHeight * 10]} 
                      min={10} 
                      max={30} 
                      step={1} 
                      onValueChange={(value) => setLineHeight(value[0] / 10)} 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="layout" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Largeur de contenu maximale: {contentWidth}px</Label>
                    </div>
                    <Slider 
                      value={[contentWidth]} 
                      min={800} 
                      max={1600} 
                      step={50} 
                      onValueChange={(value) => setContentWidth(value[0])} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Rayon de bordure: {borderRadius}px</Label>
                    </div>
                    <Slider 
                      value={[borderRadius]} 
                      min={0} 
                      max={20} 
                      step={1} 
                      onValueChange={(value) => setBorderRadius(value[0])} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Espacement de base: {spacing}px</Label>
                    </div>
                    <Slider 
                      value={[spacing]} 
                      min={4} 
                      max={32} 
                      step={2} 
                      onValueChange={(value) => setSpacing(value[0])} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="shadows-toggle">Activer les ombres</Label>
                    <Switch 
                      id="shadows-toggle"
                      checked={enableShadows}
                      onCheckedChange={setEnableShadows}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="styles" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Styles de composants</h3>
                    
                    <div className="space-y-2">
                      <Label>Style des boutons</Label>
                      <Select defaultValue="rounded">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rounded">Arrondi</SelectItem>
                          <SelectItem value="pill">Pilule</SelectItem>
                          <SelectItem value="square">Carré</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Style des cartes</Label>
                      <Select defaultValue="shadow">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shadow">Ombre</SelectItem>
                          <SelectItem value="border">Bordure</SelectItem>
                          <SelectItem value="filled">Rempli</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Style des formulaires</Label>
                      <Select defaultValue="outline">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outline">Contour</SelectItem>
                          <SelectItem value="filled">Rempli</SelectItem>
                          <SelectItem value="underline">Souligné</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-1/3">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <h3 className="text-lg font-medium mb-4">Aperçu</h3>
              
              <div 
                className="border rounded-md p-6 h-[500px] overflow-auto"
                style={{
                  fontFamily,
                  color: textColor,
                  backgroundColor,
                  borderRadius: `${borderRadius}px`,
                  boxShadow: enableShadows ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <h1 
                  style={{ 
                    fontFamily: headingFont, 
                    color: textColor,
                    marginBottom: `${spacing}px`
                  }}
                  className="text-2xl font-bold"
                >
                  Aperçu du design
                </h1>
                
                <p style={{ marginBottom: `${spacing}px`, lineHeight }}>
                  Voici un aperçu du design de votre site basé sur les paramètres que vous avez définis.
                </p>
                
                <div 
                  style={{ 
                    backgroundColor: primaryColor, 
                    padding: `${spacing/2}px ${spacing}px`,
                    borderRadius: `${borderRadius}px`,
                    display: 'inline-block',
                    color: '#fff',
                    marginRight: `${spacing}px`,
                    marginBottom: `${spacing}px`
                  }}
                >
                  Bouton principal
                </div>
                
                <div 
                  style={{ 
                    backgroundColor: secondaryColor, 
                    padding: `${spacing/2}px ${spacing}px`,
                    borderRadius: `${borderRadius}px`,
                    display: 'inline-block',
                    color: '#fff',
                    marginBottom: `${spacing}px`
                  }}
                >
                  Bouton secondaire
                </div>
                
                <div 
                  style={{ 
                    backgroundColor: '#fff', 
                    padding: `${spacing}px`,
                    borderRadius: `${borderRadius}px`,
                    marginTop: `${spacing}px`,
                    boxShadow: enableShadows ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    borderLeft: `4px solid ${accentColor}`
                  }}
                >
                  <h3 style={{ fontFamily: headingFont, marginBottom: `${spacing/2}px` }} className="font-medium">
                    Titre de carte
                  </h3>
                  <p style={{ fontSize: `${fontSize-2}px`, lineHeight }}>
                    Contenu de la carte avec la couleur d'accent.
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full" onClick={handleSaveDesign}>
                  <Check className="mr-2 h-4 w-4" />
                  Appliquer ce design
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDesign;
