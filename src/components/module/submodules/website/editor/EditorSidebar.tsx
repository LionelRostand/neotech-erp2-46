
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heading1,
  Heading2,
  Text,
  Image,
  Video,
  Link,
  Layout,
  LayoutGrid,
  FormInput,
  ListOrdered,
  ListChecks,
  Square,
  Table,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  FileText,
  ShoppingCart,
  Star,
  Share2,
  UserCircle,
  MenuSquare
} from 'lucide-react';
import ElementItem from './ElementItem';

const EditorSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"components" | "blocks">("components");
  
  return (
    <div className="w-64 border-r border-border h-full flex flex-col bg-background">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-sm font-medium">Éléments</h2>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "components" | "blocks")} className="w-[160px]">
          <TabsList className="grid w-full grid-cols-2 h-7">
            <TabsTrigger value="components" className="text-xs py-0.5">Composants</TabsTrigger>
            <TabsTrigger value="blocks" className="text-xs py-0.5">Blocs</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {activeTab === "components" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-3">Basiques</h3>
              <div className="grid grid-cols-2 gap-2">
                <ElementItem icon={<Heading1 size={16} />} label="Titre" />
                <ElementItem icon={<Heading2 size={16} />} label="Sous-titre" />
                <ElementItem icon={<Text size={16} />} label="Paragraphe" />
                <ElementItem icon={<Image size={16} />} label="Image" />
                <ElementItem icon={<Video size={16} />} label="Vidéo" />
                <ElementItem icon={<Link size={16} />} label="Lien" />
                <ElementItem icon={<Square size={16} />} label="Bouton" />
                <ElementItem icon={<ListOrdered size={16} />} label="Liste" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-3">Structure</h3>
              <div className="grid grid-cols-2 gap-2">
                <ElementItem icon={<LayoutGrid size={16} />} label="Section" />
                <ElementItem icon={<Layout size={16} />} label="Conteneur" />
                <ElementItem icon={<LayoutGrid size={16} />} label="Colonnes" />
                <ElementItem icon={<MenuSquare size={16} />} label="Menu" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-3">Formulaires</h3>
              <div className="grid grid-cols-2 gap-2">
                <ElementItem icon={<FormInput size={16} />} label="Champ texte" />
                <ElementItem icon={<ListChecks size={16} />} label="Case à cocher" />
                <ElementItem icon={<Square size={16} />} label="Bouton envoi" />
                <ElementItem icon={<FileText size={16} />} label="Formulaire" />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-3">Contact</h3>
              <div className="grid grid-cols-2 gap-2">
                <ElementItem icon={<MapPin size={16} />} label="Adresse" />
                <ElementItem icon={<Phone size={16} />} label="Téléphone" />
                <ElementItem icon={<Mail size={16} />} label="Email" />
                <ElementItem icon={<Clock size={16} />} label="Horaires" />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "blocks" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-3">En-têtes</h3>
              <div className="grid grid-cols-1 gap-2">
                <ElementItem icon={<MenuSquare size={16} />} label="En-tête avec navigation" />
                <ElementItem icon={<Image size={16} />} label="En-tête avec bannière" />
                <ElementItem icon={<Layout size={16} />} label="En-tête centré" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-3">Sections</h3>
              <div className="grid grid-cols-1 gap-2">
                <ElementItem icon={<LayoutGrid size={16} />} label="Grille de cartes" />
                <ElementItem icon={<Image size={16} />} label="Image avec texte" />
                <ElementItem icon={<Star size={16} />} label="Témoignages" />
                <ElementItem icon={<Calendar size={16} />} label="Événements" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-3">Commerce</h3>
              <div className="grid grid-cols-1 gap-2">
                <ElementItem icon={<ShoppingCart size={16} />} label="Liste de produits" />
                <ElementItem icon={<ShoppingCart size={16} />} label="Produit vedette" />
                <ElementItem icon={<ShoppingCart size={16} />} label="Panier" />
              </div>
            </div>
            
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-3">Pieds de page</h3>
              <div className="grid grid-cols-1 gap-2">
                <ElementItem icon={<Layout size={16} />} label="Pied de page simple" />
                <ElementItem icon={<Layout size={16} />} label="Pied de page avec liens" />
                <ElementItem icon={<Layout size={16} />} label="Pied de page complet" />
              </div>
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button variant="outline" size="sm" className="w-full">
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default EditorSidebar;
