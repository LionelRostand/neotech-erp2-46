
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from './editor/ColorPicker';
import { Check, Download, RotateCcw, Save, Smartphone, Tablet, Monitor, Eye, Code } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: number;
  spacing: number;
  containerWidth: number;
  enableAnimations: boolean;
  enableGradients: boolean;
  customCss: string;
}

const defaultTheme: ThemeSettings = {
  primaryColor: '#00FA9A',
  secondaryColor: '#343a40',
  accentColor: '#00b36b',
  backgroundColor: '#f5f5f5',
  textColor: '#222222',
  headingFont: 'Inter',
  bodyFont: 'Inter',
  borderRadius: 8,
  spacing: 16,
  containerWidth: 1200,
  enableAnimations: true,
  enableGradients: false,
  customCss: '/* Ajoutez votre CSS personnalisé ici */\n\n/* Exemple :\n.header {\n  box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n}\n*/',
};

const fontOptions = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Oswald', value: 'Oswald' },
];

const WebsiteThemeEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('colors');
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [previewMode, setPreviewMode] = useState('visual');
  const { toast } = useToast();
  const form = useForm<ThemeSettings>({
    defaultValues: defaultTheme,
  });
  
  const handleColorChange = (colorKey: keyof ThemeSettings, color: string) => {
    setThemeSettings((prev) => ({
      ...prev,
      [colorKey]: color,
    }));
  };
  
  const handleReset = () => {
    setThemeSettings(defaultTheme);
    form.reset(defaultTheme);
    toast({
      title: "Thème réinitialisé",
      description: "Tous les paramètres ont été restaurés aux valeurs par défaut",
      duration: 3000,
    });
  };
  
  const handleSave = () => {
    // Save theme to localStorage for demo purposes
    localStorage.setItem('website-theme', JSON.stringify(themeSettings));
    toast({
      title: "Thème enregistré",
      description: "Vos modifications ont été appliquées au site web",
      duration: 3000,
    });
  };
  
  const handleExport = () => {
    const dataStr = JSON.stringify(themeSettings, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `theme-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Thème exporté",
      description: "Le fichier JSON du thème a été téléchargé",
      duration: 3000,
    });
  };
  
  const getPreviewClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-[320px] h-[568px]';
      case 'tablet':
        return 'w-[768px] h-[1024px]';
      default:
        return 'w-full h-full';
    }
  };
  
  const generateCssVariables = () => {
    return `
:root {
  --primary: ${themeSettings.primaryColor};
  --secondary: ${themeSettings.secondaryColor};
  --accent: ${themeSettings.accentColor};
  --background: ${themeSettings.backgroundColor};
  --text: ${themeSettings.textColor};
  --heading-font: ${themeSettings.headingFont};
  --body-font: ${themeSettings.bodyFont};
  --border-radius: ${themeSettings.borderRadius}px;
  --spacing: ${themeSettings.spacing}px;
  --container-width: ${themeSettings.containerWidth}px;
}

/* Styles générés */
body {
  font-family: var(--body-font), sans-serif;
  background-color: var(--background);
  color: var(--text);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font), serif;
}

.btn-primary {
  background-color: var(--primary);
  border-radius: var(--border-radius);
  padding: calc(var(--spacing) / 2) var(--spacing);
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: var(--spacing);
}

${themeSettings.enableGradients ? 
`
/* Gradients */
.bg-gradient {
  background-image: linear-gradient(to right, var(--primary), var(--accent));
}
` : ''}

${themeSettings.enableAnimations ? 
`
/* Animations */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
` : ''}

/* CSS personnalisé */
${themeSettings.customCss}
    `;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Éditeur de Thème</h2>
          <p className="text-muted-foreground">Personnalisation avancée du thème de votre site web</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Paramètres du thème</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de votre site web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="colors">Couleurs</TabsTrigger>
                  <TabsTrigger value="typography">Typographie</TabsTrigger>
                  <TabsTrigger value="layout">Mise en page</TabsTrigger>
                  <TabsTrigger value="advanced">Avancé</TabsTrigger>
                </TabsList>
                
                <TabsContent value="colors" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ColorPicker
                      label="Couleur principale"
                      color={themeSettings.primaryColor}
                      onChange={(color) => handleColorChange('primaryColor', color)}
                    />
                    <ColorPicker
                      label="Couleur secondaire"
                      color={themeSettings.secondaryColor}
                      onChange={(color) => handleColorChange('secondaryColor', color)}
                    />
                    <ColorPicker
                      label="Couleur d'accent"
                      color={themeSettings.accentColor}
                      onChange={(color) => handleColorChange('accentColor', color)}
                    />
                    <ColorPicker
                      label="Couleur de fond"
                      color={themeSettings.backgroundColor}
                      onChange={(color) => handleColorChange('backgroundColor', color)}
                    />
                    <ColorPicker
                      label="Couleur de texte"
                      color={themeSettings.textColor}
                      onChange={(color) => handleColorChange('textColor', color)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="typography" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="headingFont">Police des titres</Label>
                      <Select
                        value={themeSettings.headingFont}
                        onValueChange={(value) => setThemeSettings({...themeSettings, headingFont: value})}
                      >
                        <SelectTrigger id="headingFont">
                          <SelectValue placeholder="Sélectionner une police" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map(font => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-2">
                        <p className="text-xl" style={{ fontFamily: themeSettings.headingFont }}>
                          Aperçu de la police des titres
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="bodyFont">Police du texte</Label>
                      <Select
                        value={themeSettings.bodyFont}
                        onValueChange={(value) => setThemeSettings({...themeSettings, bodyFont: value})}
                      >
                        <SelectTrigger id="bodyFont">
                          <SelectValue placeholder="Sélectionner une police" />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map(font => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="mt-2">
                        <p style={{ fontFamily: themeSettings.bodyFont }}>
                          Aperçu de la police du texte. Ceci est un exemple de texte pour visualiser la police.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="layout" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="borderRadius">Rayon des bordures: {themeSettings.borderRadius}px</Label>
                      </div>
                      <Slider
                        id="borderRadius"
                        min={0}
                        max={24}
                        step={1}
                        value={[themeSettings.borderRadius]}
                        onValueChange={(values) => setThemeSettings({...themeSettings, borderRadius: values[0]})}
                        className="py-4"
                      />
                      <div className="flex gap-4 mt-2">
                        <div className="w-16 h-16 bg-primary" style={{ borderRadius: `${themeSettings.borderRadius}px` }}></div>
                        <div className="w-32 h-12 bg-secondary" style={{ borderRadius: `${themeSettings.borderRadius}px` }}></div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="spacing">Espacement: {themeSettings.spacing}px</Label>
                      </div>
                      <Slider
                        id="spacing"
                        min={4}
                        max={32}
                        step={2}
                        value={[themeSettings.spacing]}
                        onValueChange={(values) => setThemeSettings({...themeSettings, spacing: values[0]})}
                        className="py-4"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="containerWidth">Largeur du conteneur: {themeSettings.containerWidth}px</Label>
                      </div>
                      <Slider
                        id="containerWidth"
                        min={800}
                        max={1920}
                        step={10}
                        value={[themeSettings.containerWidth]}
                        onValueChange={(values) => setThemeSettings({...themeSettings, containerWidth: values[0]})}
                        className="py-4"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableAnimations">Animations</Label>
                        <p className="text-sm text-muted-foreground">
                          Activer les animations sur le site
                        </p>
                      </div>
                      <Switch
                        id="enableAnimations"
                        checked={themeSettings.enableAnimations}
                        onCheckedChange={(checked) => setThemeSettings({...themeSettings, enableAnimations: checked})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="enableGradients">Dégradés</Label>
                        <p className="text-sm text-muted-foreground">
                          Activer les dégradés de couleurs
                        </p>
                      </div>
                      <Switch
                        id="enableGradients"
                        checked={themeSettings.enableGradients}
                        onCheckedChange={(checked) => setThemeSettings({...themeSettings, enableGradients: checked})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="customCss">CSS personnalisé</Label>
                      <textarea
                        id="customCss"
                        className="w-full h-80 p-3 font-mono text-sm rounded-md border border-input bg-background shadow-sm"
                        value={themeSettings.customCss}
                        onChange={(e) => setThemeSettings({...themeSettings, customCss: e.target.value})}
                      />
                      <p className="text-sm text-muted-foreground">
                        Ajoutez du CSS personnalisé pour affiner l'apparence de votre site
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Aperçu du thème</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setPreviewDevice('tablet')}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button
                    variant={previewMode === 'visual' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setPreviewMode('visual')}
                    title="Aperçu visuel"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'code' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setPreviewMode('code')}
                    title="Code CSS généré"
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {previewMode === 'visual' ? (
                <div className={`border rounded-md overflow-hidden mx-auto ${getPreviewClass()}`}>
                  <div className="h-full overflow-auto">
                    <div 
                      className="p-6"
                      style={{
                        fontFamily: themeSettings.bodyFont,
                        color: themeSettings.textColor,
                        backgroundColor: themeSettings.backgroundColor,
                      }}
                    >
                      <h1 
                        style={{ 
                          fontFamily: themeSettings.headingFont,
                          color: themeSettings.textColor,
                        }}
                        className="text-2xl font-bold mb-4"
                      >
                        Aperçu du thème
                      </h1>
                      
                      <p className="mb-4">Voici comment votre site web apparaîtra avec ce thème.</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        <button 
                          style={{ 
                            backgroundColor: themeSettings.primaryColor,
                            borderRadius: `${themeSettings.borderRadius}px`,
                            padding: `${themeSettings.spacing / 2}px ${themeSettings.spacing}px`,
                            color: '#fff'
                          }}
                        >
                          Bouton primaire
                        </button>
                        <button 
                          style={{ 
                            backgroundColor: themeSettings.secondaryColor,
                            borderRadius: `${themeSettings.borderRadius}px`,
                            padding: `${themeSettings.spacing / 2}px ${themeSettings.spacing}px`,
                            color: '#fff'
                          }}
                        >
                          Bouton secondaire
                        </button>
                        <button 
                          style={{ 
                            backgroundColor: themeSettings.accentColor,
                            borderRadius: `${themeSettings.borderRadius}px`,
                            padding: `${themeSettings.spacing / 2}px ${themeSettings.spacing}px`,
                            color: '#fff'
                          }}
                        >
                          Bouton accent
                        </button>
                      </div>
                      
                      <h2 
                        style={{ fontFamily: themeSettings.headingFont }}
                        className="text-xl font-semibold mb-2"
                      >
                        Titres et typographie
                      </h2>
                      
                      <div 
                        style={{
                          backgroundColor: themeSettings.secondaryColor,
                          borderRadius: `${themeSettings.borderRadius}px`,
                          padding: `${themeSettings.spacing}px`,
                          color: '#fff',
                          marginBottom: `${themeSettings.spacing}px`
                        }}
                      >
                        <h3 
                          style={{ fontFamily: themeSettings.headingFont }}
                          className="font-medium mb-2"
                        >
                          Section avec fond coloré
                        </h3>
                        <p className="text-sm">
                          Cette section utilise la couleur secondaire comme fond.
                        </p>
                      </div>
                      
                      {themeSettings.enableGradients && (
                        <div 
                          style={{
                            backgroundImage: `linear-gradient(to right, ${themeSettings.primaryColor}, ${themeSettings.accentColor})`,
                            borderRadius: `${themeSettings.borderRadius}px`,
                            padding: `${themeSettings.spacing}px`,
                            color: '#fff',
                            marginBottom: `${themeSettings.spacing}px`
                          }}
                        >
                          <h3 
                            style={{ fontFamily: themeSettings.headingFont }}
                            className="font-medium mb-2"
                          >
                            Section avec dégradé
                          </h3>
                          <p className="text-sm">
                            Cette section utilise un dégradé entre les couleurs principale et accent.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md bg-muted/30 p-4 font-mono text-xs overflow-auto h-96">
                  <pre>{generateCssVariables()}</pre>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Check className="h-4 w-4 mr-2" />
                  Appliquer au site
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder comme preset
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter le code CSS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebsiteThemeEditor;
