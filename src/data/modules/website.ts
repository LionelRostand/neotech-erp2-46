
import { Globe, Code, FileCode, PanelLeft, Palette, Image, Settings, Puzzle, Monitor, Brush, LayoutGrid, Search, ShoppingCart, Globe2 } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const websiteModule: AppModule = {
  id: 11,
  name: "Website",
  description: "Créez et gérez votre site web professionnel",
  href: "/modules/website",
  icon: createIcon(Globe),
  category: 'digital',
  submodules: [
    { id: "website-cms", name: "Gestion du Contenu (CMS)", href: "/modules/website/cms", icon: createIcon(LayoutGrid) },
    { id: "website-editor", name: "Éditeur", href: "/modules/website/editor", icon: createIcon(Code) },
    { id: "website-templates", name: "Templates", href: "/modules/website/templates", icon: createIcon(FileCode) },
    { id: "website-pages", name: "Pages", href: "/modules/website/pages", icon: createIcon(PanelLeft) },
    { id: "website-design", name: "Design", href: "/modules/website/design", icon: createIcon(Palette) },
    { id: "website-theme", name: "Thème & Apparence", href: "/modules/website/theme", icon: createIcon(Brush) },
    { id: "website-media", name: "Médias", href: "/modules/website/media", icon: createIcon(Image) },
    { id: "website-modules", name: "Modules", href: "/modules/website/modules", icon: createIcon(Puzzle) },
    { id: "website-ecommerce", name: "E-Commerce", href: "/modules/website/ecommerce", icon: createIcon(ShoppingCart) },
    { id: "website-seo", name: "SEO & Marketing", href: "/modules/website/seo", icon: createIcon(Search) },
    { id: "website-public", name: "Site public", href: "/modules/website/public", icon: createIcon(Monitor) },
    { id: "website-domains", name: "Domaines & Serveurs", href: "/modules/website/domains", icon: createIcon(Globe2) },
    { id: "website-settings", name: "Paramètres", href: "/modules/website/settings", icon: createIcon(Settings) }
  ]
};
