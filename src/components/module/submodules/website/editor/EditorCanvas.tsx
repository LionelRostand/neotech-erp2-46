
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditorCanvasProps {
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onSelectElement: (element: any) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ viewMode, onSelectElement }) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<any[]>([]);
  
  const [isDirty, setIsDirty] = useState(false);
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Add a visual indicator for where the element will be placed
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const y = e.clientY - rect.top;
      const newIndex = findDropIndex(y);
      setDragOverIndex(newIndex);
    }
  };

  const findDropIndex = (y: number): number => {
    if (!canvasRef.current || elements.length === 0) return 0;
    
    // Get all element containers
    const elementContainers = canvasRef.current.querySelectorAll('.element-container');
    for (let i = 0; i < elementContainers.length; i++) {
      const rect = elementContainers[i].getBoundingClientRect();
      const elementMidpoint = rect.top + rect.height / 2;
      if (y < elementMidpoint) return i;
    }
    return elements.length;
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('elementType');
    
    if (elementType) {
      const newElement = createElementFromType(elementType);
      
      if (dragOverIndex !== null) {
        // Insert at specific position
        const newElements = [...elements];
        newElements.splice(dragOverIndex, 0, newElement);
        setElements(newElements);
      } else {
        // Add to end
        setElements([...elements, newElement]);
      }
      
      setIsDirty(true);
      setDragOverIndex(null);
      toast({
        description: `Élément ${elementType} ajouté avec succès.`,
      });
    }
  };

  const handleElementDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('elementIndex', index.toString());
    setDraggingElement(`element-${index}`);
    // Use a ghost image
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('bg-primary/20', 'p-4', 'rounded', 'text-sm');
    ghostElement.textContent = 'Déplacer l\'élément ici';
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 20, 20);
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };

  const handleElementDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('elementIndex'), 10);
    
    if (!isNaN(sourceIndex) && dragOverIndex !== null && sourceIndex !== dragOverIndex) {
      // Move element from sourceIndex to dragOverIndex
      const newElements = [...elements];
      const [movedElement] = newElements.splice(sourceIndex, 1);
      
      // If moving down, we need to adjust the insertion index
      const adjustedIndex = dragOverIndex > sourceIndex ? dragOverIndex - 1 : dragOverIndex;
      newElements.splice(adjustedIndex, 0, movedElement);
      
      setElements(newElements);
      setIsDirty(true);
      toast({
        description: "Élément déplacé avec succès.",
      });
    }
    
    setDraggingElement(null);
    setDragOverIndex(null);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('website-elements', JSON.stringify(elements));
      setIsDirty(false);
      toast({
        description: "Modifications enregistrées avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer les modifications.",
      });
      console.error("Save error:", error);
    }
  };

  const handlePublish = () => {
    try {
      localStorage.setItem('website-published', JSON.stringify(elements));
      toast({
        description: "Site web publié avec succès! Disponible sur votre domaine.",
        action: (
          <Button variant="outline" size="sm" onClick={() => window.open('/modules/website/public', '_blank')}>
            Voir le site
          </Button>
        )
      });
    } catch (error) {
      toast({
        variant: "destructive", 
        title: "Erreur de publication",
        description: "Une erreur est survenue lors de la publication du site.",
      });
      console.error("Publish error:", error);
    }
  };

  const handleDeleteElement = (elementId: string) => {
    const updatedElements = elements.filter(element => element.id !== elementId);
    setElements(updatedElements);
    setIsDirty(true);
    toast({
      description: "Élément supprimé avec succès.",
    });
  };

  // Chargement des éléments sauvegardés au démarrage
  useEffect(() => {
    try {
      const savedElements = localStorage.getItem('website-elements');
      if (savedElements) {
        setElements(JSON.parse(savedElements));
      }
    } catch (error) {
      console.error("Error loading saved elements:", error);
      toast({
        variant: "destructive",
        description: "Impossible de charger le contenu sauvegardé.",
      });
    }
  }, [toast]);

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
      case 'menu':
        content = `
          <nav class="p-4 bg-primary text-white">
            <div class="container mx-auto flex justify-between items-center">
              <div class="font-bold text-xl">Logo</div>
              <div class="hidden md:flex space-x-6">
                <a href="#" class="hover:opacity-80 transition-opacity">Accueil</a>
                <a href="#" class="hover:opacity-80 transition-opacity">Services</a>
                <a href="#" class="hover:opacity-80 transition-opacity">À Propos</a>
                <a href="#" class="hover:opacity-80 transition-opacity">Contact</a>
              </div>
              <div class="md:hidden">
                <button class="p-2">Menu</button>
              </div>
            </div>
          </nav>
        `;
        break;
      case 'banner':
        content = `
          <div class="bg-primary/90 text-white p-10 text-center relative overflow-hidden">
            <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?q=80&w=1200');"></div>
            <div class="relative z-10 space-y-4 max-w-4xl mx-auto">
              <h1 class="text-3xl md:text-5xl font-bold">Titre de votre bannière</h1>
              <p class="text-lg md:text-xl">Une description attrayante pour captiver vos visiteurs et les encourager à en savoir plus.</p>
              <div class="flex justify-center space-x-4 pt-4">
                <button class="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors">Découvrir</button>
                <button class="bg-transparent border border-white px-6 py-2 rounded-lg font-medium hover:bg-white/10 transition-colors">En savoir plus</button>
              </div>
            </div>
          </div>
        `;
        break;
      case 'footer':
        content = `
          <footer class="bg-gray-800 text-white p-8">
            <div class="container mx-auto">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 class="text-lg font-bold mb-4">À propos</h3>
                  <p class="text-gray-300">Une brève description de votre entreprise et de ses services. Ajoutez ici des informations importantes.</p>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-4">Liens rapides</h3>
                  <ul class="space-y-2 text-gray-300">
                    <li><a href="#" class="hover:text-white transition-colors">Accueil</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Services</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">À propos</a></li>
                    <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-4">Contact</h3>
                  <ul class="space-y-2 text-gray-300">
                    <li>Email: contact@example.com</li>
                    <li>Téléphone: +33 1 23 45 67 89</li>
                    <li>Adresse: 123 Rue des Exemples, 75000 Paris</li>
                  </ul>
                </div>
              </div>
              <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                <p>&copy; 2024 Votre Entreprise. Tous droits réservés.</p>
              </div>
            </div>
          </footer>
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
    <div className="flex flex-col h-full">
      <div className="flex justify-end gap-2 p-2 border-b">
        <Button 
          variant={isDirty ? "default" : "outline"} 
          size="sm"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-1" />
          Enregistrer
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handlePublish}
        >
          <Upload className="h-4 w-4 mr-1" />
          Publier
        </Button>
      </div>
      <div 
        className={`bg-white border rounded-lg shadow-sm overflow-auto flex-1 ${
          viewMode === 'mobile' ? 'max-w-[375px]' : viewMode === 'tablet' ? 'max-w-[768px]' : 'w-full'
        } mx-auto`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        ref={canvasRef}
      >
        <div className="min-h-screen">
          {elements.map((element, index) => (
            <div 
              key={element.id}
              id={`element-${index}`}
              className={`element-container relative group hover:outline-dashed hover:outline-primary/40 hover:outline-2 cursor-pointer ${
                draggingElement === `element-${index}` ? 'opacity-50' : ''
              } ${dragOverIndex === index ? 'border-t-2 border-primary' : ''}`}
              draggable
              onDragStart={(e) => handleElementDragStart(e, index)}
              onDrop={handleElementDrop}
            >
              <div 
                onClick={() => handleElementClick(element)}
                dangerouslySetInnerHTML={{ __html: element.content }}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteElement(element.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {dragOverIndex === elements.length && (
            <div className="border-t-2 border-primary"></div>
          )}
          
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
    </div>
  );
};

export default EditorCanvas;
