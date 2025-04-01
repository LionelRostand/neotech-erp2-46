
import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import TransportBookingTemplate from '../templates/TransportBookingTemplate';
import RestaurantMenuTemplate from '../templates/RestaurantMenuTemplate';

interface WebsitePreviewProps {
  previewMode: boolean;
  activeTemplate?: string | null;
  initialContent?: any[]; // Ajout de la propriété initialContent
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ previewMode, activeTemplate, initialContent = [] }) => {
  const [elements, setElements] = useState<any[]>(initialContent);

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
