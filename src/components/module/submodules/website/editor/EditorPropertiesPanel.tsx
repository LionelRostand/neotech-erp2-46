
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Settings2, Edit3, Type, PanelLeft, Move, Palette } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditorPropertiesPanelProps {
  selectedElement: any | null;
  onDeleteElement: (elementId: string) => void;
}

const EditorPropertiesPanel: React.FC<EditorPropertiesPanelProps> = ({ 
  selectedElement,
  onDeleteElement
}) => {
  const [activeTab, setActiveTab] = useState('style');

  if (!selectedElement) {
    return (
      <div className="p-4 text-center h-full flex items-center justify-center">
        <div className="text-muted-foreground">
          <PanelLeft className="h-10 w-10 mx-auto mb-4 opacity-50" />
          <p>Sélectionnez un élément pour modifier ses propriétés</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-full bg-muted">
            {selectedElement.type === 'heading' ? <Type className="h-4 w-4" /> : 
             selectedElement.type === 'paragraph' ? <Edit3 className="h-4 w-4" /> :
             <PanelLeft className="h-4 w-4" />}
          </div>
          <h3 className="font-medium">{selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}</h3>
        </div>
        <p className="text-sm text-muted-foreground">ID: {selectedElement.id}</p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>
        
        <TabsContent value="style" className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Couleur de texte</Label>
              <div className="grid grid-cols-4 gap-2">
                <div className="w-full h-8 rounded bg-primary cursor-pointer border-2 border-muted" />
                <div className="w-full h-8 rounded bg-destructive cursor-pointer" />
                <div className="w-full h-8 rounded bg-secondary cursor-pointer" />
                <div className="w-full h-8 rounded bg-accent cursor-pointer" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Arrière-plan</Label>
              <div className="grid grid-cols-4 gap-2">
                <div className="w-full h-8 rounded bg-transparent border cursor-pointer" />
                <div className="w-full h-8 rounded bg-muted cursor-pointer" />
                <div className="w-full h-8 rounded bg-primary/10 cursor-pointer" />
                <div className="w-full h-8 rounded bg-background cursor-pointer" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Alignement</Label>
              <div className="border rounded-lg p-0.5 flex">
                <Button variant="ghost" size="sm" className="w-full flex-1">Gauche</Button>
                <Button variant="ghost" size="sm" className="w-full flex-1">Centre</Button>
                <Button variant="ghost" size="sm" className="w-full flex-1">Droite</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Espacement</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-muted-foreground">Marge</span>
                  <Input type="number" defaultValue={16} className="mt-1" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Rembourrage</span>
                  <Input type="number" defaultValue={20} className="mt-1" />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Taille de texte</Label>
              <Select defaultValue="base">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">Très petit</SelectItem>
                  <SelectItem value="sm">Petit</SelectItem>
                  <SelectItem value="base">Normal</SelectItem>
                  <SelectItem value="lg">Grand</SelectItem>
                  <SelectItem value="xl">Très grand</SelectItem>
                  <SelectItem value="2xl">Extra large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Épaisseur de texte</Label>
              <Select defaultValue="normal">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une épaisseur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Léger</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="bold">Gras</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="content" className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Contenu HTML</Label>
              <Textarea 
                defaultValue={selectedElement.content}
                className="font-mono text-sm min-h-[200px]"
              />
            </div>
            
            <Separator />
            
            {selectedElement.type === 'heading' && (
              <div className="space-y-2">
                <Label>Type de titre</Label>
                <Select defaultValue="h2">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de titre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">Titre H1</SelectItem>
                    <SelectItem value="h2">Titre H2</SelectItem>
                    <SelectItem value="h3">Titre H3</SelectItem>
                    <SelectItem value="h4">Titre H4</SelectItem>
                    <SelectItem value="h5">Titre H5</SelectItem>
                    <SelectItem value="h6">Titre H6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {selectedElement.type === 'image' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>URL de l'image</Label>
                  <Input defaultValue="https://via.placeholder.com/800x400" />
                </div>
                <div className="space-y-2">
                  <Label>Texte alternatif</Label>
                  <Input defaultValue="Image placeholder" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fit-img">Ajuster l'image</Label>
                    <Switch id="fit-img" />
                  </div>
                  <p className="text-xs text-muted-foreground">L'image s'adaptera à son conteneur</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Classes CSS</Label>
              <Input defaultValue="p-4 bg-primary/10" />
              <p className="text-xs text-muted-foreground">Classes Tailwind CSS séparées par espaces</p>
            </div>
            
            <div className="space-y-2">
              <Label>ID personnalisé</Label>
              <Input defaultValue={selectedElement.id} />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="visible">Visible</Label>
                <Switch id="visible" defaultChecked />
              </div>
              <p className="text-xs text-muted-foreground">Afficher ou masquer cet élément</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="responsive">Responsive</Label>
                <Switch id="responsive" defaultChecked />
              </div>
              <p className="text-xs text-muted-foreground">Adapter l'élément aux écrans mobiles</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={() => selectedElement.onDelete ? selectedElement.onDelete() : onDeleteElement(selectedElement.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Supprimer cet élément
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorPropertiesPanel;
