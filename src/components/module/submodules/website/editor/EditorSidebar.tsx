
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
  Car,
  Menu as MenuIcon,
  Flag,
  AlertTriangle,
  Footprints
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ElementItem from './ElementItem';

const EditorSidebar: React.FC = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, elementType: string) => {
    e.dataTransfer.setData('elementType', elementType);
  };

  // Group elements by category for better organization
  const elements = {
    navigation: [
      { type: 'menu', icon: <MenuIcon className="h-8 w-8 mb-1 text-primary" />, label: 'Menu' },
      { type: 'footer', icon: <Footprints className="h-8 w-8 mb-1 text-primary" />, label: 'Footer' }
    ],
    structure: [
      { type: 'section', icon: <Layout className="h-8 w-8 mb-1 text-primary" />, label: 'Section' },
      { type: 'banner', icon: <Flag className="h-8 w-8 mb-1 text-primary" />, label: 'Bannière' },
      { type: 'columns', icon: <Columns className="h-8 w-8 mb-1 text-primary" />, label: 'Colonnes' }
    ],
    basic: [
      { type: 'heading', icon: <Type className="h-4 w-4 text-primary" />, label: 'Titre' },
      { type: 'paragraph', icon: <FileText className="h-4 w-4 text-primary" />, label: 'Paragraphe' },
      { type: 'image', icon: <Image className="h-4 w-4 text-primary" />, label: 'Image' },
      { type: 'button', icon: <div className="h-4 w-4 bg-primary/80 rounded-sm"></div>, label: 'Bouton' },
      { type: 'video', icon: <Video className="h-4 w-4 text-primary" />, label: 'Vidéo' }
    ],
    forms: [
      { type: 'form', icon: <FormInput className="h-4 w-4 text-primary" />, label: 'Formulaire' }
    ],
    integrations: [
      { type: 'transport-booking', icon: <Car className="h-4 w-4 text-primary" />, label: 'Réservation Transport' }
    ]
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
        <h3 className="px-2 mb-2 font-medium">Navigation</h3>
        <div className="grid grid-cols-2 gap-1 px-1">
          {elements.navigation.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 text-center cursor-move hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="px-2 mb-2 font-medium">Structure</h3>
        <div className="grid grid-cols-2 gap-1 px-1">
          {elements.structure.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 text-center cursor-move hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium">Éléments Basiques</h3>
        <div className="space-y-1 px-1">
          {elements.basic.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 flex items-center space-x-2 cursor-move hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium">Formulaires</h3>
        <div className="space-y-1 px-1">
          {elements.forms.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 flex items-center space-x-2 cursor-move hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </div>

      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium">Intégrations</h3>
        <div className="space-y-1 px-1">
          {elements.integrations.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 flex items-center space-x-2 cursor-move hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
