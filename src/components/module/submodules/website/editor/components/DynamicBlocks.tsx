import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutGrid, 
  Image, 
  FormInput, 
  MessageSquare, 
  Rows, 
  SlidersHorizontal, 
  ChevronRight,
  AlertCircle,
  Radio,
  Mail,
  MapPin,
  Calendar,
  Play,
  SlidersVertical
} from 'lucide-react';

interface DynamicBlockProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export const blockCategories = [
  { 
    title: "Structure", 
    blocks: [
      {
        id: "section",
        title: "Section",
        icon: <LayoutGrid className="h-10 w-10 text-primary" />,
        description: "Conteneur flexible pour organiser votre contenu"
      },
      {
        id: "columns",
        title: "Colonnes",
        icon: <Rows className="h-10 w-10 text-primary rotate-90" />,
        description: "Disposer le contenu en colonnes adaptatives"
      },
      {
        id: "grid",
        title: "Grille",
        icon: <LayoutGrid className="h-10 w-10 text-primary" />,
        description: "Organisation en grille responsive"
      }
    ]
  },
  {
    title: "Contenus Média",
    blocks: [
      {
        id: "image",
        title: "Image",
        icon: <Image className="h-10 w-10 text-primary" />,
        description: "Une image avec options avancées"
      },
      {
        id: "video",
        title: "Vidéo",
        icon: <Play className="h-10 w-10 text-primary" />,
        description: "Intégration de vidéos YouTube, Vimeo ou personnalisées"
      },
      {
        id: "carousel",
        title: "Carrousel",
        icon: <SlidersVertical className="h-10 w-10 text-primary" />,
        description: "Diaporama d'images et contenus"
      }
    ]
  },
  {
    title: "Formulaires & Interactions",
    blocks: [
      {
        id: "contact-form",
        title: "Formulaire de contact",
        icon: <Mail className="h-10 w-10 text-primary" />,
        description: "Formulaire de contact personnalisable"
      },
      {
        id: "custom-form",
        title: "Formulaire personnalisé",
        icon: <FormInput className="h-10 w-10 text-primary" />,
        description: "Créez votre propre formulaire avec validation"
      },
      {
        id: "survey",
        title: "Sondage",
        icon: <Radio className="h-10 w-10 text-primary" />,
        description: "Créez des sondages interactifs"
      }
    ]
  },
  {
    title: "Contenus Dynamiques",
    blocks: [
      {
        id: "testimonials",
        title: "Témoignages",
        icon: <MessageSquare className="h-10 w-10 text-primary" />,
        description: "Avis et témoignages clients"
      },
      {
        id: "cta",
        title: "Appel à l'action",
        icon: <AlertCircle className="h-10 w-10 text-primary" />,
        description: "Boutons et bannières d'appel à l'action"
      },
      {
        id: "pricing",
        title: "Tableau de prix",
        icon: <SlidersHorizontal className="h-10 w-10 text-primary" />,
        description: "Affichage des tarifs et comparaison"
      }
    ]
  },
  {
    title: "Éléments d'information",
    blocks: [
      {
        id: "map",
        title: "Carte",
        icon: <MapPin className="h-10 w-10 text-primary" />,
        description: "Intégration d'une carte interactive"
      },
      {
        id: "calendar",
        title: "Calendrier",
        icon: <Calendar className="h-10 w-10 text-primary" />,
        description: "Affichage d'événements ou réservations"
      }
    ]
  }
];

const DynamicBlock: React.FC<DynamicBlockProps> = ({
  icon,
  title,
  description,
  onClick
}) => {
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-all hover:shadow-md" 
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-start">
        <div className="mr-4 mt-1">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground self-center" />
      </CardContent>
    </Card>
  );
};

export interface DynamicBlocksProps {
  onSelectBlock: (blockId: string) => void;
}

const DynamicBlocks: React.FC<DynamicBlocksProps> = ({ onSelectBlock }) => {
  return (
    <div className="space-y-6 px-4">
      {blockCategories.map((category, index) => (
        <div key={index} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wide">
            {category.title}
          </h3>
          <div className="space-y-2">
            {category.blocks.map((block) => (
              <DynamicBlock
                key={block.id}
                icon={block.icon}
                title={block.title}
                description={block.description}
                onClick={() => onSelectBlock(block.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DynamicBlocks;
