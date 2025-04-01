
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
  Footprints,
  Award,
  Users,
  MessageSquare,
  ShoppingCart
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ElementItem from './ElementItem';
import { TransportChevronsUpDown } from '@/components/icons/ChevronIcons';

const EditorSidebar: React.FC = () => {
  // Group elements by category for better organization
  const elements = {
    navigation: [
      { type: 'menu', icon: <MenuIcon className="h-8 w-8 mb-1 text-primary" />, label: 'Menu' },
      { type: 'footer', icon: <Footprints className="h-8 w-8 mb-1 text-primary" />, label: 'Footer' }
    ],
    structure: [
      { type: 'section', icon: <Layout className="h-8 w-8 mb-1 text-primary" />, label: 'Section' },
      { type: 'banner', icon: <Flag className="h-8 w-8 mb-1 text-primary" />, label: 'Bannière' },
      { type: 'columns', icon: <Columns className="h-8 w-8 mb-1 text-primary" />, label: 'Colonnes' },
      { type: 'features', icon: <Award className="h-8 w-8 mb-1 text-primary" />, label: 'Fonctionnalités' }
    ],
    basic: [
      { type: 'heading', icon: <Type className="h-4 w-4 text-primary" />, label: 'Titre' },
      { type: 'paragraph', icon: <FileText className="h-4 w-4 text-primary" />, label: 'Paragraphe' },
      { type: 'image', icon: <Image className="h-4 w-4 text-primary" />, label: 'Image' },
      { type: 'button', icon: <div className="h-4 w-4 bg-primary/80 rounded-sm"></div>, label: 'Bouton' },
      { type: 'video', icon: <Video className="h-4 w-4 text-primary" />, label: 'Vidéo' }
    ],
    commerce: [
      { type: 'products', icon: <ShoppingCart className="h-4 w-4 text-primary" />, label: 'Produits' },
      { type: 'pricing', icon: <AlertTriangle className="h-4 w-4 text-primary" />, label: 'Tarifs' }
    ],
    social: [
      { type: 'testimonials', icon: <MessageSquare className="h-4 w-4 text-primary" />, label: 'Témoignages' },
      { type: 'team', icon: <Users className="h-4 w-4 text-primary" />, label: 'Équipe' }
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
        <h3 className="px-2 mb-2 font-medium flex items-center justify-between">
          Navigation
          <TransportChevronsUpDown />
        </h3>
        <Card className="mx-2 mb-2 border border-dashed border-muted hover:border-primary/50 transition-colors">
          <CardContent className="p-2">
            <div className="grid grid-cols-2 gap-1">
              {elements.navigation.map(element => (
                <ElementItem
                  key={element.type}
                  icon={element.icon}
                  label={element.label}
                  className="p-3 text-center hover:bg-muted transition-colors"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-4">
        <h3 className="px-2 mb-2 font-medium flex items-center justify-between">
          Structure
          <TransportChevronsUpDown />
        </h3>
        <Card className="mx-2 mb-2 border border-dashed border-muted hover:border-primary/50 transition-colors">
          <CardContent className="p-2">
            <div className="grid grid-cols-2 gap-1">
              {elements.structure.map(element => (
                <ElementItem
                  key={element.type}
                  icon={element.icon}
                  label={element.label}
                  className="p-3 text-center hover:bg-muted transition-colors"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium flex items-center justify-between">
          Éléments Basiques
          <TransportChevronsUpDown />
        </h3>
        <div className="space-y-1 px-2">
          {elements.basic.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 flex items-center space-x-2 hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium flex items-center justify-between">
          E-commerce
          <TransportChevronsUpDown />
        </h3>
        <div className="space-y-1 px-2">
          {elements.commerce.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 flex items-center space-x-2 hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium flex items-center justify-between">
          Social
          <TransportChevronsUpDown />
        </h3>
        <div className="space-y-1 px-2">
          {elements.social.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 flex items-center space-x-2 hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium flex items-center justify-between">
          Formulaires
          <TransportChevronsUpDown />
        </h3>
        <div className="space-y-1 px-2">
          {elements.forms.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 flex items-center space-x-2 hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </div>

      <Separator className="my-4" />
      
      <div>
        <h3 className="px-2 mb-2 font-medium flex items-center justify-between">
          Intégrations
          <TransportChevronsUpDown />
        </h3>
        <div className="space-y-1 px-2">
          {elements.integrations.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 flex items-center space-x-2 hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
