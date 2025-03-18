
import { Globe, LayoutDashboard, Code, FileCode, PanelLeft, Palette, Image, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const websiteModule: AppModule = {
  id: 11,
  name: "Website",
  description: "Créez et gérez votre site web professionnel",
  href: "/modules/website",
  icon: createIcon(Globe),
  category: 'digital', // Added the category property
  submodules: [
    { id: "website-dashboard", name: "Tableau de bord", href: "/modules/website/dashboard", icon: createIcon(LayoutDashboard) },
    { id: "website-editor", name: "Éditeur", href: "/modules/website/editor", icon: createIcon(Code) },
    { id: "website-templates", name: "Templates", href: "/modules/website/templates", icon: createIcon(FileCode) },
    { id: "website-pages", name: "Pages", href: "/modules/website/pages", icon: createIcon(PanelLeft) },
    { id: "website-design", name: "Design", href: "/modules/website/design", icon: createIcon(Palette) },
    { id: "website-media", name: "Médias", href: "/modules/website/media", icon: createIcon(Image) },
    { id: "website-settings", name: "Paramètres", href: "/modules/website/settings", icon: createIcon(Settings) }
  ]
};
