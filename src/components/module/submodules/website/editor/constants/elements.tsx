
import React from 'react';
import {
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

export interface ElementDefinition {
  type: string;
  icon: React.ReactNode;
  label: string;
}

export interface ElementsGroup {
  [key: string]: ElementDefinition[];
}

export const websiteElements: ElementsGroup = {
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
