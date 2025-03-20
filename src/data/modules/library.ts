
import { Archive, BookOpen, Book, Users, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const libraryModule: AppModule = {
  id: 15,
  name: "Librairie",
  description: "Gestion des livres, catalogues, emprunts et retours",
  href: "/modules/library",
  icon: createIcon(BookOpen),
  category: 'services',
  submodules: [
    { 
      id: "library-books", 
      name: "Livres", 
      href: "/modules/library/books", 
      icon: createIcon(Book),
      description: "Gestion du catalogue de livres"
    },
    { 
      id: "library-catalog", 
      name: "Catalogue", 
      href: "/modules/library/catalog", 
      icon: createIcon(Archive),
      description: "Consultation du catalogue public"
    },
    { 
      id: "library-members", 
      name: "Adhérents", 
      href: "/modules/library/members", 
      icon: createIcon(Users),
      description: "Gestion des adhérents et des emprunts"
    },
    { 
      id: "library-settings", 
      name: "Paramètres", 
      href: "/modules/library/settings", 
      icon: createIcon(Settings),
      description: "Configuration de la librairie"
    }
  ]
};
