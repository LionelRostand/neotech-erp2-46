
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface EditorCanvasProps {
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onSelectElement: (element: any) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ viewMode, onSelectElement }) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<any[]>([
    {
      id: 'header-1',
      type: 'header',
      content: '<div class="p-4 bg-primary/10"><h1 class="text-2xl font-bold">Mon Site Web</h1><p>Bienvenue sur mon site</p></div>'
    },
    {
      id: 'section-1',
      type: 'section',
      content: `
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4">Section Principale</h2>
          <p>Ceci est un exemple de section. Vous pouvez modifier ce contenu en cliquant dessus.</p>
          <div class="mt-4">
            <button class="bg-primary text-white px-4 py-2 rounded">En savoir plus</button>
          </div>
        </div>
      `
    },
    {
      id: 'image-1',
      type: 'image',
      content: '<div class="p-4"><img src="https://via.placeholder.com/800x400" class="w-full h-auto rounded" alt="Placeholder" /></div>'
    }
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('elementType');
    if (elementType) {
      const newElement = createElementFromType(elementType);
      setElements([...elements, newElement]);
      toast({
        description: `Élément ${elementType} ajouté avec succès.`,
      });
    }
  };

  const handleDeleteElement = (elementId: string) => {
    const updatedElements = elements.filter(element => element.id !== elementId);
    setElements(updatedElements);
  };

  const createElementFromType = (type: string) => {
    const id = `${type}-${Date.now()}`;
    let content = '';

    switch (type) {
      case 'heading':
        content = '<h2 class="text-xl font-bold p-4">Nouveau Titre</h2>';
        break;
      case 'paragraph':
        content = '<p class="p-4">Nouveau paragraphe de texte. Cliquez pour éditer.</p>';
        break;
      case 'image':
        content = '<div class="p-4"><img src="https://via.placeholder.com/800x400" class="w-full h-auto rounded" alt="Placeholder" /></div>';
        break;
      case 'button':
        content = '<div class="p-4"><button class="bg-primary text-white px-4 py-2 rounded">Bouton</button></div>';
        break;
      case 'section':
        content = `
          <section class="p-6 bg-muted/20 rounded">
            <h2 class="text-xl font-bold mb-2">Nouvelle Section</h2>
            <p>Contenu de la section...</p>
          </section>
        `;
        break;
      case 'video':
        content = '<div class="p-4 aspect-video bg-muted flex items-center justify-center rounded"><span>Vidéo Placeholder</span></div>';
        break;
      case 'columns':
        content = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div class="bg-muted/20 p-4 rounded">Colonne 1</div>
            <div class="bg-muted/20 p-4 rounded">Colonne 2</div>
          </div>
        `;
        break;
      case 'form':
        content = `
          <div class="p-6 bg-muted/10 rounded">
            <h3 class="text-lg font-medium mb-4">Formulaire de contact</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Nom</label>
                <input type="text" class="w-full border rounded p-2" placeholder="Votre nom" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" class="w-full border rounded p-2" placeholder="Votre email" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Message</label>
                <textarea class="w-full border rounded p-2" rows="3" placeholder="Votre message"></textarea>
              </div>
              <button class="bg-primary text-white px-4 py-2 rounded">Envoyer</button>
            </div>
          </div>
        `;
        break;
      default:
        content = `<div class="p-4 border border-dashed rounded">Élément ${type}</div>`;
    }

    return {
      id,
      type,
      content
    };
  };

  const handleElementClick = (element: any) => {
    onSelectElement(element);
  };

  return (
    <div 
      className={`bg-white border rounded-lg shadow-sm overflow-auto ${
        viewMode === 'mobile' ? 'max-w-[375px]' : viewMode === 'tablet' ? 'max-w-[768px]' : 'w-full'
      } mx-auto`}
      style={{ minHeight: '100%' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      ref={canvasRef}
    >
      <div className="min-h-screen">
        {elements.map((element) => (
          <div 
            key={element.id}
            className="relative hover:outline-dashed hover:outline-primary/40 hover:outline-2 cursor-pointer"
            onClick={() => handleElementClick(element)}
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        ))}
        
        {elements.length === 0 && (
          <div className="flex items-center justify-center p-10 h-96 text-muted-foreground">
            <div className="text-center">
              <p>Aucun élément dans la page</p>
              <p className="text-sm">Faites glisser des éléments depuis le panneau de gauche</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
