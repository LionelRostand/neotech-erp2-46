
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Palette, 
  Type, 
  Image, 
  Layout, 
  Save, 
  Check, 
  RefreshCcw,
  Copy,
  ChevronsUpDown
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const WebsiteThemeEditor = () => {
  const { toast } = useToast();
  const [activeTheme, setActiveTheme] = useState('default');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#10b981');
  const [accentColor, setAccentColor] = useState('#f43f5e');
  const [fontFamily, setFontFamily] = useState('Inter');

  const handleSaveTheme = () => {
    toast({
      description: "Thème sauvegardé avec succès",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="mr-2 h-5 w-5 text-primary" />
            Apparence & Thème
          </CardTitle>
          <CardDescription>
            Personnalisez l'aspect visuel de votre site web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="theme">
            <TabsList className="mb-4">
              <TabsTrigger value="theme">Thème</TabsTrigger>
              <TabsTrigger value="typography">Typographie</TabsTrigger>
              <TabsTrigger value="colors">Couleurs</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>
            
            <TabsContent value="theme" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {['default', 'modern', 'elegant', 'minimalist', 'bold', 'creative'].map((theme) => (
                  <Card 
                    key={theme}
                    className={`cursor-pointer overflow-hidden ${activeTheme === theme ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => {
                      setActiveTheme(theme);
                      toast({
                        description: `Thème ${theme} sélectionné`,
                      });
                    }}
                  >
                    <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-500"></div>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm capitalize">{theme}</div>
                      {activeTheme === theme && <Check className="h-4 w-4 text-primary" />}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="typography" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Polices</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Police principale</Label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative border rounded-md">
                          <Input 
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            className="pr-8"
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="absolute right-0 top-0 h-full"
                          >
                            <ChevronsUpDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button size="icon" variant="outline">
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Police des titres</Label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative border rounded-md">
                          <Input 
                            value="Montserrat"
                            className="pr-8"
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="absolute right-0 top-0 h-full"
                          >
                            <ChevronsUpDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button size="icon" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <h4 className="text-sm font-medium">Prévisualisation</h4>
                    <div className="p-4 border rounded-md">
                      <h1 className="text-2xl font-bold mb-2">Titre d'exemple H1</h1>
                      <h2 className="text-xl font-bold mb-2">Sous-titre d'exemple H2</h2>
                      <p className="mb-2">Texte de paragraphe d'exemple. Voici à quoi ressemble votre typographie.</p>
                      <a href="#" className="text-primary hover:underline">Exemple de lien</a>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="colors" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Couleurs principales</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Couleur primaire</Label>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded-md border cursor-pointer"
                        style={{ backgroundColor: primaryColor }}
                        onClick={() => document.getElementById('color-primary')?.click()}
                      />
                      <Input 
                        id="color-primary"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Couleur secondaire</Label>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded-md border cursor-pointer"
                        style={{ backgroundColor: secondaryColor }}
                        onClick={() => document.getElementById('color-secondary')?.click()}
                      />
                      <Input 
                        id="color-secondary"
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Couleur d'accent</Label>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded-md border cursor-pointer"
                        style={{ backgroundColor: accentColor }}
                        onClick={() => document.getElementById('color-accent')?.click()}
                      />
                      <Input 
                        id="color-accent"
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Palette de couleurs</h3>
                <div className="flex flex-wrap gap-2">
                  {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280', '#000000', '#ffffff'].map((color) => (
                    <div 
                      key={color}
                      className="w-10 h-10 rounded-md border cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => setPrimaryColor(color)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-4 space-y-4">
                <h4 className="text-sm font-medium">Prévisualisation</h4>
                <div className="p-4 border rounded-md">
                  <div className="flex flex-wrap gap-3">
                    <div className="p-3 rounded-md text-white" style={{ backgroundColor: primaryColor }}>
                      Primaire
                    </div>
                    <div className="p-3 rounded-md text-white" style={{ backgroundColor: secondaryColor }}>
                      Secondaire
                    </div>
                    <div className="p-3 rounded-md text-white" style={{ backgroundColor: accentColor }}>
                      Accent
                    </div>
                    <div className="p-3 rounded-md bg-muted">
                      Neutre
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personnalisation avancée</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">CSS personnalisé</h4>
                    <textarea 
                      className="w-full h-32 p-2 text-sm font-mono border rounded-md"
                      placeholder=".custom-class {
  padding: 1rem;
  border-radius: 0.5rem;
}"
                    ></textarea>
                  </Card>
                  
                  <Card className="p-4">
                    <h4 className="font-medium mb-2">JavaScript personnalisé</h4>
                    <textarea 
                      className="w-full h-32 p-2 text-sm font-mono border rounded-md"
                      placeholder="document.addEventListener('DOMContentLoaded', function() {
  // Votre code JavaScript ici
});"
                    ></textarea>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-4">
          <Button variant="outline" className="mr-2">
            Réinitialiser
          </Button>
          <Button onClick={handleSaveTheme}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer les changements
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WebsiteThemeEditor;
