
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Search,
  Layout,
  Type,
  Image,
  FileText,
  Columns,
  FormInput,
  Video,
  ListOrdered,
  Table,
  Grid3X3,
  Car
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const EditorSidebar: React.FC = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, elementType: string) => {
    e.dataTransfer.setData('elementType', elementType);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des éléments..."
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="px-2 mb-2 font-medium">Structure</h3>
        <div className="grid grid-cols-2 gap-1 px-1">
          <Card 
            className="p-3 text-center cursor-move hover:bg-muted transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, 'section')}
          >
            <div className="flex flex-col items-center">
              <Layout className="h-8 w-8 mb-1 text-primary" />
              <span className="text-sm">Section</span>
            </div>
          </Card>
          <Card 
            className="p-3 text-center cursor-move hover:bg-muted transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, 'columns')}
          >
            <div className="flex flex-col items-center">
              <Columns className="h-8 w-8 mb-1 text-primary" />
              <span className="text-sm">Colonnes</span>
            </div>
          </Card>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium">Éléments Basiques</h3>
        <div className="space-y-1 px-1">
          <Card 
            className="p-3 cursor-move hover:bg-muted transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, 'heading')}
          >
            <div className="flex items-center space-x-2">
              <Type className="h-4 w-4 text-primary" />
              <span>Titre</span>
            </div>
          </Card>
          <Card 
            className="p-3 cursor-move hover:bg-muted transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, 'paragraph')}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Paragraphe</span>
            </div>
          </Card>
          <Card 
            className="p-3 cursor-move hover:bg-muted transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, 'image')}
          >
            <div className="flex items-center space-x-2">
              <Image className="h-4 w-4 text-primary" />
              <span>Image</span>
            </div>
          </Card>
          <Card 
            className="p-3 cursor-move hover:bg-muted transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, 'button')}
          >
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-primary/80 rounded-sm"></div>
              <span>Bouton</span>
            </div>
          </Card>
          <Card 
            className="p-3 cursor-move hover:bg-muted transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, 'video')}
          >
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4 text-primary" />
              <span>Vidéo</span>
            </div>
          </Card>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium">Formulaires</h3>
        <div className="space-y-1 px-1">
          <Card 
            className="p-3 cursor-move hover:bg-muted transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, 'form')}
          >
            <div className="flex items-center space-x-2">
              <FormInput className="h-4 w-4 text-primary" />
              <span>Formulaire</span>
            </div>
          </Card>
        </div>
      </div>

      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium">Intégrations</h3>
        <div className="space-y-1 px-1">
          <Card 
            className="p-3 cursor-move hover:bg-muted transition-colors"
            draggable
            onDragStart={(e) => handleDragStart(e, 'transport-booking')}
          >
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-primary" />
              <span>Réservation Transport</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
