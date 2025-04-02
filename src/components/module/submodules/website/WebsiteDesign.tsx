
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from './editor/ColorPicker';
import { Palette, Brush, Layout, Type, Grid, Laptop, Tablet, Smartphone, Save, Undo, FileCode, Code } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const WebsiteDesign: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#00FA9A');
  const [secondaryColor, setSecondaryColor] = useState('#343a40');
  const [textColor, setTextColor] = useState('#222222');
  const [backgroundColor, setBackgroundColor] = useState('#f5f5f5');
  const [borderRadius, setBorderRadius] = useState(8);
  const [fontFamily, setFontFamily] = useState('system-ui');
  const [headerHeight, setHeaderHeight] = useState(80);
  const [activeTab, setActiveTab] = useState('colors');
  const [activeDevice, setActiveDevice] = useState('desktop');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleColorChange = (color: string, setter: (color: string) => void) => {
    setter(color);
    setUnsavedChanges(true);
  };

  const handleSliderChange = (value: number[], setter: (value: number) => void) => {
    setter(value[0]);
    setUnsavedChanges(true);
  };

  const handleSelectChange = (value: string, setter: (value: string) => void) => {
    setter(value);
    setUnsavedChanges(true);
  };

  const saveChanges = () => {
    // Here you would typically save the design settings to your backend or localStorage
    console.log('Saving design changes:', {
      primaryColor,
      secondaryColor,
      textColor,
      backgroundColor,
      borderRadius,
      fontFamily,
      headerHeight
    });
    setUnsavedChanges(false);
  };

  const resetChanges = () => {
    setPrimaryColor('#00FA9A');
    setSecondaryColor('#343a40');
    setTextColor('#222222');
    setBackgroundColor('#f5f5f5');
    setBorderRadius(8);
    setFontFamily('system-ui');
    setHeaderHeight(80);
    setUnsavedChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Personnalisation du design</h1>
          <p className="text-sm text-muted-foreground">
            Adaptez l'apparence de votre site web selon vos préférences
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={resetChanges} disabled={!unsavedChanges}>
            <Undo className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button onClick={saveChanges} disabled={!unsavedChanges}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les modifications
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" /> 
                Outils de design
              </CardTitle>
              <CardDescription>
                Modifiez les paramètres visuels de votre site
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="colors" className="text-xs sm:text-sm">
                    <Palette className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Couleurs</span>
                  </TabsTrigger>
                  <TabsTrigger value="typography" className="text-xs sm:text-sm">
                    <Type className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Typographie</span>
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="text-xs sm:text-sm">
                    <Layout className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Mise en page</span>
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="text-xs sm:text-sm">
                    <Code className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Avancé</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="p-4 space-y-4">
                  <ColorPicker
                    color={primaryColor}
                    onChange={(color) => handleColorChange(color, setPrimaryColor)}
                    label="Couleur principale"
                  />
                  
                  <ColorPicker
                    color={secondaryColor}
                    onChange={(color) => handleColorChange(color, setSecondaryColor)}
                    label="Couleur secondaire"
                  />
                  
                  <ColorPicker
                    color={textColor}
                    onChange={(color) => handleColorChange(color, setTextColor)}
                    label="Couleur du texte"
                  />
                  
                  <ColorPicker
                    color={backgroundColor}
                    onChange={(color) => handleColorChange(color, setBackgroundColor)}
                    label="Couleur de fond"
                  />

                  <Separator className="my-4" />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Suggestions de palettes</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {['#00FA9A', '#00b36b', '#343a40', '#f8f9fa', '#f5f5f5'].map((color) => (
                        <div 
                          key={color} 
                          className="h-8 rounded-md cursor-pointer border" 
                          style={{ backgroundColor: color }}
                          onClick={() => setPrimaryColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Police principale</Label>
                    <Select 
                      value={fontFamily} 
                      onValueChange={(value) => handleSelectChange(value, setFontFamily)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une police" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system-ui">System UI</SelectItem>
                        <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                        <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                        <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                        <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Taille de police de base</Label>
                    <Select defaultValue="16px">
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une taille" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="14px">14px</SelectItem>
                        <SelectItem value="16px">16px (Recommandé)</SelectItem>
                        <SelectItem value="18px">18px</SelectItem>
                        <SelectItem value="20px">20px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Hauteur de ligne</Label>
                    <Select defaultValue="1.5">
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une hauteur de ligne" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.2">Compacte (1.2)</SelectItem>
                        <SelectItem value="1.5">Standard (1.5)</SelectItem>
                        <SelectItem value="1.8">Détendue (1.8)</SelectItem>
                        <SelectItem value="2">Espacée (2.0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Espacement des lettres</Label>
                    <Slider
                      defaultValue={[0]}
                      max={2}
                      step={0.05}
                      className="mb-6"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="bold-links" />
                      <label
                        htmlFor="bold-links"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Liens en gras
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="underline-links" />
                      <label
                        htmlFor="underline-links"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Souligner les liens
                      </label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Bordures arrondies</Label>
                      <span className="text-sm text-muted-foreground">{borderRadius}px</span>
                    </div>
                    <Slider 
                      value={[borderRadius]} 
                      min={0} 
                      max={20} 
                      step={1}
                      onValueChange={(value) => handleSliderChange(value, setBorderRadius)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Hauteur d'en-tête</Label>
                      <span className="text-sm text-muted-foreground">{headerHeight}px</span>
                    </div>
                    <Slider 
                      value={[headerHeight]} 
                      min={60} 
                      max={120} 
                      step={4}
                      onValueChange={(value) => handleSliderChange(value, setHeaderHeight)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Largeur du conteneur</Label>
                    <Select defaultValue="1280">
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une largeur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024">Étroit (1024px)</SelectItem>
                        <SelectItem value="1280">Standard (1280px)</SelectItem>
                        <SelectItem value="1440">Large (1440px)</SelectItem>
                        <SelectItem value="1800">Très large (1800px)</SelectItem>
                        <SelectItem value="100%">Pleine largeur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label className="mb-2">Espacement des sections</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un espacement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Compact</SelectItem>
                        <SelectItem value="medium">Moyen</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="xlarge">Très large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="sticky-header" />
                    <Label htmlFor="sticky-header">En-tête fixe</Label>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Code CSS personnalisé</Label>
                    <div className="relative">
                      <textarea 
                        className="w-full h-32 p-3 bg-muted/50 rounded-md font-mono text-sm resize-none border"
                        placeholder="/* Ajoutez votre CSS personnalisé ici */"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Le CSS personnalisé sera appliqué à l'ensemble du site
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Injection d'en-tête HTML</Label>
                    <div className="relative">
                      <textarea 
                        className="w-full h-20 p-3 bg-muted/50 rounded-md font-mono text-sm resize-none border"
                        placeholder="<!-- Code à insérer dans l'en-tête -->"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Utile pour les scripts de suivi, les polices, etc.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label>Mode du thème</Label>
                    <Select defaultValue="light">
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Clair</SelectItem>
                        <SelectItem value="dark">Sombre</SelectItem>
                        <SelectItem value="system">Système (automatique)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="animations" defaultChecked />
                    <Label htmlFor="animations">Animations activées</Label>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Aperçu du design</CardTitle>
                <div className="flex items-center space-x-1 bg-muted/40 rounded-lg p-1">
                  <Button
                    variant={activeDevice === 'desktop' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setActiveDevice('desktop')}
                  >
                    <Laptop className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeDevice === 'tablet' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setActiveDevice('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={activeDevice === 'mobile' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setActiveDevice('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`
                w-full mx-auto overflow-hidden border rounded-md transition-all
                ${activeDevice === 'desktop' ? 'h-[500px] max-w-full' : ''}
                ${activeDevice === 'tablet' ? 'h-[500px] max-w-[768px]' : ''}
                ${activeDevice === 'mobile' ? 'h-[580px] max-w-[375px]' : ''}
              `}>
                <div 
                  className="h-full w-full bg-white"
                  style={{
                    fontFamily: fontFamily,
                    color: textColor,
                    backgroundColor: backgroundColor,
                  }}
                >
                  {/* Header Preview */}
                  <div 
                    className="w-full border-b px-6 py-4 flex justify-between items-center"
                    style={{
                      height: `${headerHeight}px`,
                      backgroundColor: secondaryColor,
                      color: '#fff',
                    }}
                  >
                    <div className="font-bold text-lg">Nom du site</div>
                    <div className="hidden sm:flex gap-4">
                      <span>Accueil</span>
                      <span>Services</span>
                      <span>Contact</span>
                    </div>
                    <div className="sm:hidden">
                      <Grid className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="p-6">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold mb-4">Titre principal</h1>
                      <p className="text-muted-foreground">Ce texte présente votre site aux visiteurs.</p>
                    </div>

                    <div className="mb-8">
                      <h2 className="text-xl font-semibold mb-3">Nos services</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                          <div 
                            key={i} 
                            className="p-4 border" 
                            style={{
                              borderRadius: `${borderRadius}px`,
                              backgroundColor: i === 2 ? primaryColor : 'transparent',
                              color: i === 2 ? '#fff' : textColor,
                            }}
                          >
                            <h3 className="font-medium mb-2">Service {i}</h3>
                            <p className={`text-sm ${i !== 2 ? 'text-muted-foreground' : ''}`}>
                              Description du service offert à vos clients.
                            </p>
                            <Button
                              className="mt-3"
                              variant={i !== 2 ? 'default' : 'outline'}
                              style={{
                                backgroundColor: i !== 2 ? primaryColor : 'transparent',
                                borderColor: i === 2 ? '#fff' : 'transparent',
                                color: i !== 2 ? '#fff' : '#fff',
                                borderRadius: `${borderRadius}px`,
                              }}
                            >
                              En savoir plus
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      style={{
                        backgroundColor: primaryColor,
                        color: '#fff',
                        borderRadius: `${borderRadius}px`,
                      }}
                    >
                      Bouton d'action
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCode className="h-5 w-5 mr-2" />
                Exporter votre thème
              </CardTitle>
              <CardDescription>
                Exportez vos paramètres de design pour une utilisation ultérieure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline">
                  Exporter en CSS
                </Button>
                <Button variant="outline">
                  Exporter en JSON
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Vous pouvez importer ces fichiers plus tard pour restaurer vos paramètres de design.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDesign;
