
import React from 'react';
import { createIcon } from '@/data/types/modules';
import { 
  LayoutGrid, Columns, Rows, Text, Heading, Image, 
  Square as ButtonIcon, FormInput, MessageSquare, Mail, Phone, ShoppingCart, CreditCard, Tag, 
  MapPin, Twitter, Facebook, Instagram, Youtube, Share2, Upload, Video,
  Calendar, Clock, Users, List
} from 'lucide-react';

export interface ElementDefinition {
  type: string;
  label: string;
  icon: React.ReactNode;
  category: string;
  draggable: boolean;
}

export const websiteElements = {
  navigation: [
    { type: 'navbar', label: 'Barre de navigation', icon: createIcon(Rows), category: 'navigation', draggable: true },
    { type: 'menu', label: 'Menu', icon: createIcon(List), category: 'navigation', draggable: true },
    { type: 'footer', label: 'Pied de page', icon: createIcon(Rows), category: 'navigation', draggable: true }
  ],
  structure: [
    { type: 'section', label: 'Section', icon: createIcon(LayoutGrid), category: 'structure', draggable: true },
    { type: 'columns', label: 'Colonnes', icon: createIcon(Columns), category: 'structure', draggable: true },
    { type: 'rows', label: 'Lignes', icon: createIcon(Rows), category: 'structure', draggable: true },
  ],
  basic: [
    { type: 'heading', label: 'Titre', icon: createIcon(Heading), category: 'basic', draggable: true },
    { type: 'text', label: 'Texte', icon: createIcon(Text), category: 'basic', draggable: true },
    { type: 'image', label: 'Image', icon: createIcon(Image), category: 'basic', draggable: true },
    { type: 'button', label: 'Bouton', icon: createIcon(ButtonIcon), category: 'basic', draggable: true },
    { type: 'video', label: 'Vidéo', icon: createIcon(Video), category: 'basic', draggable: true },
  ],
  commerce: [
    { type: 'product', label: 'Produit', icon: createIcon(ShoppingCart), category: 'commerce', draggable: true },
    { type: 'price', label: 'Prix', icon: createIcon(Tag), category: 'commerce', draggable: true },
    { type: 'checkout', label: 'Paiement', icon: createIcon(CreditCard), category: 'commerce', draggable: true }
  ],
  social: [
    { type: 'twitter', label: 'Twitter', icon: createIcon(Twitter), category: 'social', draggable: true },
    { type: 'facebook', label: 'Facebook', icon: createIcon(Facebook), category: 'social', draggable: true },
    { type: 'instagram', label: 'Instagram', icon: createIcon(Instagram), category: 'social', draggable: true },
    { type: 'youtube', label: 'Youtube', icon: createIcon(Youtube), category: 'social', draggable: true },
    { type: 'share', label: 'Partage', icon: createIcon(Share2), category: 'social', draggable: true }
  ],
  forms: [
    { type: 'form', label: 'Formulaire', icon: createIcon(FormInput), category: 'forms', draggable: true },
    { type: 'input', label: 'Champ texte', icon: createIcon(FormInput), category: 'forms', draggable: true },
    { type: 'contact', label: 'Contact', icon: createIcon(MessageSquare), category: 'forms', draggable: true }
  ],
  integrations: [
    { type: 'map', label: 'Carte', icon: createIcon(MapPin), category: 'integrations', draggable: true },
    { type: 'calendar', label: 'Calendrier', icon: createIcon(Calendar), category: 'integrations', draggable: true },
    { type: 'upload', label: 'Téléversement', icon: createIcon(Upload), category: 'integrations', draggable: true }
  ],
  templates: [
    // Les templates seront chargés dynamiquement
  ]
};

export const getAllElements = (): ElementDefinition[] => {
  return [
    ...websiteElements.navigation,
    ...websiteElements.structure,
    ...websiteElements.basic,
    ...websiteElements.commerce,
    ...websiteElements.social,
    ...websiteElements.forms,
    ...websiteElements.integrations
  ];
};
