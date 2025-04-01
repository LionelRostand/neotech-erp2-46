
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import TransportBookingTemplate from '../templates/TransportBookingTemplate';
import RestaurantMenuTemplate from '../templates/RestaurantMenuTemplate';

export interface WebsiteElement {
  id: string;
  type: string;
  label: string;
  content?: string;
  props?: Record<string, any>;
}

interface WebsitePreviewProps {
  previewMode: boolean;
  activeTemplate?: string | null;
  initialContent?: WebsiteElement[];
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ previewMode, activeTemplate, initialContent = [] }) => {
  const [elements, setElements] = useState<WebsiteElement[]>(initialContent);

  // Configuration du drop target pour le drag and drop
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ELEMENT',
    drop: (item: any) => {
      handleDrop(item);
      return item;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  // Ajouter un élément déposé
  const handleDrop = (item: any) => {
    setElements(prev => [...prev, { ...item, id: `element-${Date.now()}` }]);
  };

  // Afficher le template actif
  const renderTemplate = () => {
    switch(activeTemplate) {
      case 'transport-1':
        return <TransportBookingTemplate />;
      case 'restaurant-1':
        return <RestaurantMenuTemplate />;
      case 'cms-preview':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Exemple de page CMS</h1>
            <div className="prose prose-lg max-w-none">
              <p>
                Ceci est un exemple de page créée avec notre éditeur CMS. 
                Vous pouvez ajouter des blocs de contenu, les personnaliser et y appliquer des animations.
              </p>
              
              <div className="bg-primary/10 p-4 rounded-md my-6">
                <h2 className="text-xl font-medium text-primary mb-2">Essayez notre outil de drag & drop</h2>
                <p>
                  Faites glisser des éléments depuis la barre latérale pour créer votre page facilement.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="border p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Fonctionnalité 1</h3>
                  <p>Description de la fonctionnalité avec texte explicatif.</p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Fonctionnalité 2</h3>
                  <p>Description de la fonctionnalité avec texte explicatif.</p>
                </div>
              </div>
              
              <blockquote>
                Notre CMS vous permet de créer des sites web professionnels sans aucune connaissance en programmation.
              </blockquote>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
            <h1 className="text-3xl font-bold mb-4">Mon site web</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Faites glisser des éléments depuis la barre latérale pour commencer à construire votre site.
            </p>
            
            {elements.length > 0 && (
              <div className="w-full max-w-md">
                {elements.map(el => (
                  <div key={el.id} className="p-2 mb-2 border rounded bg-white">
                    {el.type}: {el.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div 
      ref={drop}
      className={`w-full h-full overflow-y-auto border-2 ${isOver ? 'border-primary border-dashed' : 'border-transparent'}`}
    >
      {renderTemplate()}
      
      {elements.length > 0 && !activeTemplate && (
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">Éléments ajoutés:</h3>
          {elements.map(el => (
            <div key={el.id} className="p-2 mb-2 border rounded">
              {el.label} ({el.type})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebsitePreview;
