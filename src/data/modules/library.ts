
import { Archive, BookOpen, Book, Users, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const libraryModule: AppModule = {
  id: 15,
  name: "Librairie",
  description: "Gestion des livres, catalogues, emprunts et retours",
  href: "/modules/library",
  icon: createIcon(BookOpen),
  submodules: [
    { id: "library-books", name: "Livres", href: "/modules/library/books", icon: createIcon(Book) },
    { id: "library-catalog", name: "Catalogue", href: "/modules/library/catalog", icon: createIcon(Archive) },
    { id: "library-members", name: "Adhérents", href: "/modules/library/members", icon: createIcon(Users) },
    { id: "library-settings", name: "Paramètres", href: "/modules/library/settings", icon: createIcon(Settings) }
  ]
};
