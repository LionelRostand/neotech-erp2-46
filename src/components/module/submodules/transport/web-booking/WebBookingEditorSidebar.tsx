
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Search, Layout, Image, Type, FileText, FormInput, Globe, Map, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DragPreviewImage, useDrag } from 'react-dnd';

interface DraggableElementProps {
  type: string;
  label: string;
  icon: React.ReactNode;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ type, label, icon }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'ELEMENT',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <>
      <DragPreviewImage connect={preview} src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
      <div
        ref={drag}
        className={`flex items-center p-2 rounded border cursor-grab 
                    ${isDragging ? 'opacity-50 border-primary' : 'border-muted bg-card hover:border-primary/50'}`}
      >
        <span className="mr-2">{icon}</span>
        {label}
      </div>
    </>
  );
};

const WebBookingEditorSidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('elements');

  const elementCategories = [
    {
      title: "Navigation",
      elements: [
        { type: 'nav-bar', label: 'Barre de navigation', icon: <Layout size={14} /> },
        { type: 'menu', label: 'Menu', icon: <Layout size={14} /> },
        { type: 'footer', label: 'Pied de page', icon: <Layout size={14} /> },
      ]
    },
    {
      title: "Contenu",
      elements: [
        { type: 'heading', label: 'Titre', icon: <Type size={14} /> },
        { type: 'text', label: 'Texte', icon: <FileText size={14} /> },
        { type: 'image', label: 'Image', icon: <Image size={14} /> },
        { type: 'gallery', label: 'Galerie', icon: <Image size={14} /> },
        { type: 'card', label: 'Carte', icon: <Layout size={14} /> },
      ]
    },
    {
      title: "Formulaires",
      elements: [
        { type: 'contact-form', label: 'Formulaire de contact', icon: <FormInput size={14} /> },
        { type: 'booking-form', label: 'Formulaire de réservation', icon: <FormInput size={14} /> },
        { type: 'input', label: 'Champ de saisie', icon: <FormInput size={14} /> },
        { type: 'textarea', label: 'Zone de texte', icon: <FormInput size={14} /> },
      ]
    },
    {
      title: "Transport",
      elements: [
        { type: 'map', label: 'Carte', icon: <Map size={14} /> },
        { type: 'address', label: 'Adresse', icon: <Globe size={14} /> },
        { type: 'schedule', label: 'Horaires', icon: <Clock size={14} /> },
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="elements">Éléments</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="elements" className="flex-1 overflow-y-auto">
          <div className="pb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un élément..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            {elementCategories.map((category) => {
              const filteredElements = category.elements.filter(
                element => element.label.toLowerCase().includes(searchTerm.toLowerCase())
              );
              
              if (filteredElements.length === 0) return null;
              
              return (
                <div key={category.title} className="space-y-2">
                  <h3 className="text-sm font-medium">{category.title}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredElements.map((element) => (
                      <DraggableElement 
                        key={element.type} 
                        type={element.type} 
                        label={element.label} 
                        icon={element.icon} 
                      />
                    ))}
                  </div>
                  <Separator className="my-4" />
                </div>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="styles" className="flex-1 overflow-y-auto">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Couleur principale</Label>
                <div className="grid grid-cols-5 gap-2">
                  {['#3490dc', '#38c172', '#e3342f', '#f6993f', '#9561e2'].map((color) => (
                    <div 
                      key={color} 
                      className="w-6 h-6 rounded-full cursor-pointer border border-gray-200"
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-family">Police</Label>
                <Input id="font-family" defaultValue="Inter" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="border-radius">Arrondi des bordures</Label>
                <Input id="border-radius" type="range" min="0" max="10" defaultValue="4" />
              </div>
              
              <div className="pt-4">
                <Button className="w-full">Appliquer les styles</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebBookingEditorSidebar;
