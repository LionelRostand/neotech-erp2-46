
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
    toast({
      description: "Élément supprimé avec succès.",
    });
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
      case 'transport-booking':
        content = `
          <div class="transport-booking-widget p-4">
            <div class="bg-slate-900 text-white p-6 rounded-lg overflow-hidden relative">
              <div style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1599037779235-c3740ba54b89?q=80&w=1200); background-size: cover; background-position: center; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;"></div>
              <div class="relative z-10">
                <h2 class="text-2xl font-bold mb-4">Réservez votre véhicule</h2>
                <div class="bg-white text-slate-900 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium mb-1">Type de service</label>
                      <select class="w-full border rounded p-2">
                        <option>Transfert aéroport</option>
                        <option>Transport à l'heure</option>
                        <option>Aller simple</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">Date & Heure</label>
                      <input type="text" class="w-full border rounded p-2" placeholder="25/07/2023 14:30" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">Lieu de prise en charge</label>
                      <input type="text" class="w-full border rounded p-2" placeholder="Adresse de départ..." />
                    </div>
                    <div>
                      <label class="block text-sm font-medium mb-1">Passagers</label>
                      <select class="w-full border rounded p-2">
                        <option>1 personne</option>
                        <option>2 personnes</option>
                        <option>3 personnes</option>
                        <option>4+ personnes</option>
                      </select>
                    </div>
                  </div>
                  <button class="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded font-medium">Réserver</button>
                </div>
              </div>
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
    onSelectElement({...element, onDelete: () => handleDeleteElement(element.id)});
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
