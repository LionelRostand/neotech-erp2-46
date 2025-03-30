
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditorPropertiesPanelProps {
  selectedElement: any;
}

const EditorPropertiesPanel: React.FC<EditorPropertiesPanelProps> = ({ selectedElement }) => {
  const [textContent, setTextContent] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState('normal');
  const [textAlign, setTextAlign] = useState('left');
  const [padding, setPadding] = useState(16);
  const [margin, setMargin] = useState(16);
  const [borderRadius, setBorderRadius] = useState(4);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/800x400');
  const [altText, setAltText] = useState('Image description');
  const [linkUrl, setLinkUrl] = useState('');
  const [targetBlank, setTargetBlank] = useState(false);
  const [opacity, setOpacity] = useState(100);

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h3 className="font-medium mb-4">
          {selectedElement 
            ? `Propriétés: ${selectedElement.type}` 
            : 'Propriétés'}
        </h3>

        {!selectedElement && (
          <div className="text-center text-muted-foreground text-sm p-4">
            Sélectionnez un élément pour voir ses propriétés
          </div>
        )}

        {selectedElement && (
          <Tabs defaultValue="style">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 pt-4">
              {['heading', 'paragraph', 'button'].includes(selectedElement?.type) && (
                <div className="space-y-2">
                  <Label>Texte</Label>
                  <Input 
                    value={textContent} 
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Entrez votre texte" 
                  />
                </div>
              )}

              {selectedElement?.type === 'image' && (
                <>
                  <div className="space-y-2">
                    <Label>URL de l'image</Label>
                    <Input 
                      value={imageUrl} 
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Texte alternatif</Label>
                    <Input 
                      value={altText} 
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Description de l'image" 
                    />
                  </div>
                </>
              )}

              {selectedElement?.type === 'button' && (
                <div className="space-y-2">
                  <Label>URL du lien</Label>
                  <Input 
                    value={linkUrl} 
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com" 
                  />
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      checked={targetBlank} 
                      onCheckedChange={setTargetBlank} 
                      id="target-blank"
                    />
                    <Label htmlFor="target-blank">Ouvrir dans un nouvel onglet</Label>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="style" className="space-y-4 pt-4">
              {['heading', 'paragraph', 'button'].includes(selectedElement?.type) && (
                <>
                  <div className="space-y-2">
                    <Label>Taille de police: {fontSize}px</Label>
                    <Slider
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0])}
                      min={8}
                      max={72}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Graisse</Label>
                    <Select value={fontWeight} onValueChange={setFontWeight}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une graisse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="semibold">Semi-bold</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Alignement</Label>
                    <Select value={textAlign} onValueChange={setTextAlign}>
                      <SelectTrigger>
                        <SelectValue placeholder="Alignement du texte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Gauche</SelectItem>
                        <SelectItem value="center">Centre</SelectItem>
                        <SelectItem value="right">Droite</SelectItem>
                        <SelectItem value="justify">Justifié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>Couleur de fond</Label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 border rounded cursor-pointer" 
                    style={{ backgroundColor }}
                  />
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-8"
                  />
                </div>
              </div>

              {['heading', 'paragraph', 'button'].includes(selectedElement?.type) && (
                <div className="space-y-2">
                  <Label>Couleur du texte</Label>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 border rounded cursor-pointer" 
                      style={{ backgroundColor: textColor }}
                    />
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-8"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Opacité: {opacity}%</Label>
                <Slider
                  value={[opacity]}
                  onValueChange={(value) => setOpacity(value[0])}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Padding: {padding}px</Label>
                  <Slider
                    value={[padding]}
                    onValueChange={(value) => setPadding(value[0])}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Marge: {margin}px</Label>
                  <Slider
                    value={[margin]}
                    onValueChange={(value) => setMargin(value[0])}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bord arrondi: {borderRadius}px</Label>
                <Slider
                  value={[borderRadius]}
                  onValueChange={(value) => setBorderRadius(value[0])}
                  min={0}
                  max={50}
                  step={1}
                />
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>ID</Label>
                <Input 
                  value={selectedElement?.id} 
                  disabled 
                />
              </div>

              <div className="space-y-2">
                <Label>Classes CSS</Label>
                <Input placeholder="Entrez vos classes CSS" />
              </div>

              <div className="space-y-2">
                <Label>Animation</Label>
                <Select defaultValue="none">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une animation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    <SelectItem value="fade">Fondu</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="bounce">Rebond</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Visibilité sur mobile</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch defaultChecked id="mobile-visibility" />
                  <Label htmlFor="mobile-visibility">Visible sur mobile</Label>
                </div>
              </div>

              <Separator className="my-4" />

              <Button variant="destructive" size="sm">
                Supprimer cet élément
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ScrollArea>
  );
};

export default EditorPropertiesPanel;
