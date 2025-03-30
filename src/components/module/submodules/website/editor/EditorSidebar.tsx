
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Type,
  Image,
  FileText,
  Sidebar,
  FormInput,
  Video,
  ListOrdered,
  Table,
  Grid3X3,
  MessageSquare,
  LayoutGrid,
  AlertTriangle,
  Map,
  CheckSquare,
  ShoppingCart,
  Star,
  Calendar,
  Share2,
  Search,
  Menu,
  Footer
} from 'lucide-react';

const EditorSidebar = () => {
  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('elementType', elementType);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        <h3 className="font-medium mb-2">Éléments</h3>
        <Tabs defaultValue="basic">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="basic">Basique</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="mt-2">
            <Accordion type="multiple" defaultValue={["text", "media"]}>
              <AccordionItem value="text">
                <AccordionTrigger>Texte</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'heading')}
                    >
                      <Type className="h-5 w-5 mb-1" />
                      <span className="text-xs">Titre</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'paragraph')}
                    >
                      <FileText className="h-5 w-5 mb-1" />
                      <span className="text-xs">Paragraphe</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'list')}
                    >
                      <ListOrdered className="h-5 w-5 mb-1" />
                      <span className="text-xs">Liste</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'button')}
                    >
                      <Button className="h-5 pointer-events-none" size="sm">Bouton</Button>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="media">
                <AccordionTrigger>Media</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'image')}
                    >
                      <Image className="h-5 w-5 mb-1" />
                      <span className="text-xs">Image</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'video')}
                    >
                      <Video className="h-5 w-5 mb-1" />
                      <span className="text-xs">Video</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'carousel')}
                    >
                      <LayoutGrid className="h-5 w-5 mb-1" />
                      <span className="text-xs">Carousel</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'map')}
                    >
                      <Map className="h-5 w-5 mb-1" />
                      <span className="text-xs">Carte</span>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="layout">
                <AccordionTrigger>Mise en page</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'section')}
                    >
                      <Sidebar className="h-5 w-5 mb-1" />
                      <span className="text-xs">Section</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'container')}
                    >
                      <Grid3X3 className="h-5 w-5 mb-1" />
                      <span className="text-xs">Conteneur</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'columns')}
                    >
                      <LayoutGrid className="h-5 w-5 mb-1" />
                      <span className="text-xs">Colonnes</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'spacer')}
                    >
                      <div className="h-5 w-10 border-t-2 border-dashed"></div>
                      <span className="text-xs mt-1">Espace</span>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="form">
                <AccordionTrigger>Formulaires</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'input')}
                    >
                      <FormInput className="h-5 w-5 mb-1" />
                      <span className="text-xs">Champ</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'form')}
                    >
                      <FileText className="h-5 w-5 mb-1" />
                      <span className="text-xs">Formulaire</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'checkbox')}
                    >
                      <CheckSquare className="h-5 w-5 mb-1" />
                      <span className="text-xs">Case à cocher</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'contact')}
                    >
                      <MessageSquare className="h-5 w-5 mb-1" />
                      <span className="text-xs">Contact</span>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="advanced" className="mt-2">
            <Accordion type="multiple">
              <AccordionItem value="commerce">
                <AccordionTrigger>E-commerce</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'product')}
                    >
                      <ShoppingCart className="h-5 w-5 mb-1" />
                      <span className="text-xs">Produit</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'products-grid')}
                    >
                      <LayoutGrid className="h-5 w-5 mb-1" />
                      <span className="text-xs">Grille produits</span>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="interactive">
                <AccordionTrigger>Interactif</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'tabs')}
                    >
                      <Menu className="h-5 w-5 mb-1" />
                      <span className="text-xs">Onglets</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'accordion')}
                    >
                      <ListOrdered className="h-5 w-5 mb-1" />
                      <span className="text-xs">Accordéon</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'calendar')}
                    >
                      <Calendar className="h-5 w-5 mb-1" />
                      <span className="text-xs">Calendrier</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'reviews')}
                    >
                      <Star className="h-5 w-5 mb-1" />
                      <span className="text-xs">Avis</span>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="seo">
                <AccordionTrigger>SEO</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'meta')}
                    >
                      <Search className="h-5 w-5 mb-1" />
                      <span className="text-xs">Méta tags</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'schema')}
                    >
                      <AlertTriangle className="h-5 w-5 mb-1" />
                      <span className="text-xs">Schema.org</span>
                    </Card>
                    <Card 
                      className="p-2 flex flex-col items-center cursor-grab hover:bg-muted" 
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'sharelinks')}
                    >
                      <Share2 className="h-5 w-5 mb-1" />
                      <span className="text-xs">Partage</span>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="custom" className="mt-2">
            <div className="py-4 text-center text-sm text-muted-foreground">
              Glissez vos composants personnalisés ici 
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default EditorSidebar;
