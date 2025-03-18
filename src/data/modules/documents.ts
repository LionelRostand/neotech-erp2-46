
import { FileText, File, FileCheck, Settings, FolderSearch } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const documentsModule: AppModule = {
  id: 16,
  name: "Documents",
  description: "Gestion électronique de documents, archivage et partage",
  href: "/modules/documents",
  icon: createIcon(FileText),
  category: 'communication', // Ajout de la catégorie
  submodules: [
    { id: "documents-files", name: "Fichiers", href: "/modules/documents/files", icon: createIcon(File) },
    { id: "documents-archive", name: "Archives", href: "/modules/documents/archive", icon: createIcon(FileCheck) },
    { id: "documents-search", name: "Recherche", href: "/modules/documents/search", icon: createIcon(FolderSearch) },
    { id: "documents-settings", name: "Paramètres", href: "/modules/documents/settings", icon: createIcon(Settings) }
  ]
};
