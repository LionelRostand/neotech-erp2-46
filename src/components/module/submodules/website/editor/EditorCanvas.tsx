
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
          <div class="bg-gradient-to-r from-primary/90 to-primary/70 text-white p-10 text-center relative overflow-hidden">
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
      case 'features':
        content = `
          <section class="py-16">
            <div class="container mx-auto px-4">
              <h2 class="text-3xl font-bold text-center mb-12">Nos Fonctionnalités</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold mb-2">Fonctionnalité 1</h3>
                  <p class="text-gray-600">Description détaillée de cette fonctionnalité et de ses avantages pour vos utilisateurs.</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold mb-2">Fonctionnalité 2</h3>
                  <p class="text-gray-600">Description détaillée de cette fonctionnalité et de ses avantages pour vos utilisateurs.</p>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold mb-2">Fonctionnalité 3</h3>
                  <p class="text-gray-600">Description détaillée de cette fonctionnalité et de ses avantages pour vos utilisateurs.</p>
                </div>
              </div>
            </div>
          </section>
        `;
        break;
      case 'products':
        content = `
          <section class="py-12 bg-gray-50">
            <div class="container mx-auto px-4">
              <h2 class="text-3xl font-bold text-center mb-8">Nos Produits</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="h-48 bg-gray-200"></div>
                  <div class="p-4">
                    <h3 class="font-semibold text-lg mb-1">Produit 1</h3>
                    <p class="text-gray-600 text-sm mb-2">Catégorie</p>
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-primary">59,99 €</span>
                      <button class="bg-primary text-white px-3 py-1 rounded text-sm">Acheter</button>
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="h-48 bg-gray-200"></div>
                  <div class="p-4">
                    <h3 class="font-semibold text-lg mb-1">Produit 2</h3>
                    <p class="text-gray-600 text-sm mb-2">Catégorie</p>
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-primary">49,99 €</span>
                      <button class="bg-primary text-white px-3 py-1 rounded text-sm">Acheter</button>
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="h-48 bg-gray-200"></div>
                  <div class="p-4">
                    <h3 class="font-semibold text-lg mb-1">Produit 3</h3>
                    <p class="text-gray-600 text-sm mb-2">Catégorie</p>
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-primary">39,99 €</span>
                      <button class="bg-primary text-white px-3 py-1 rounded text-sm">Acheter</button>
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="h-48 bg-gray-200"></div>
                  <div class="p-4">
                    <h3 class="font-semibold text-lg mb-1">Produit 4</h3>
                    <p class="text-gray-600 text-sm mb-2">Catégorie</p>
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-primary">29,99 €</span>
                      <button class="bg-primary text-white px-3 py-1 rounded text-sm">Acheter</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        `;
        break;
      case 'pricing':
        content = `
          <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
              <h2 class="text-3xl font-bold text-center mb-3">Nos Tarifs</h2>
              <p class="text-center text-gray-600 max-w-2xl mx-auto mb-10">Choisissez le plan qui correspond le mieux à vos besoins.</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="bg-gray-50 p-6 text-center">
                    <h3 class="text-xl font-bold">Basique</h3>
                    <div class="mt-3 flex items-center justify-center">
                      <span class="text-4xl font-bold">19€</span>
                      <span class="text-gray-500 ml-2">/mois</span>
                    </div>
                  </div>
                  <div class="p-6">
                    <ul class="space-y-3">
                      <li class="flex items-center">
                        <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Fonctionnalité basique 1</span>
                      </li>
                      <li class="flex items-center">
                        <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Fonctionnalité basique 2</span>
                      </li>
                      <li class="flex items-center">
                        <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Fonctionnalité basique 3</span>
                      </li>
                    </ul>
                    <button class="mt-6 w-full bg-primary text-white py-2 rounded-md">Choisir</button>
                  </div>
                </div>
                <div class="border rounded-lg overflow-hidden shadow-lg relative">
                  <div class="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg">Populaire</div>
                  <div class="bg-primary bg-opacity-10 p-6 text-center">
                    <h3 class="text-xl font-bold text-primary">Standard</h3>
                    <div class="mt-3 flex items-center justify-center">
                      <span class="text-4xl font-bold">49€</span>
                      <span class="text-gray-500 ml-2">/mois</span>
                    </div>
                  </div>
                  <div class="p-6">
                    <ul class="space-y-3">
                      <li class="flex items-center">
                        <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Toutes les fonctionnalités basiques</span>
                      </li>
                      <li class="flex items-center">
                        <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Fonctionnalité standard 1</span>
                      </li>
                      <li class="flex items-center">
                        <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Fonctionnalité standard 2</span>
                      </li>
                    </ul>
                    <button class="mt-6 w-full bg-primary text-white py-2 rounded-md">Choisir</button>
                  </div>
                </div>
                <div class="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div class="bg-gray-50 p-6 text-center">
                    <h3 class="text-xl font-bold">Premium</h3>
                    <div class="mt-3 flex items-center justify-center">
                      <span class="text-4xl font-bold">99€</span>
                      <span class="text-gray-500 ml-2">/mois</span>
                    </div>
                  </div>
                  <div class="p-6">
                    <ul class="space-y-3">
                      <li class="flex items-center">
                        <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Toutes les fonctionnalités standard</span>
                      </li>
                      <li class="flex items-center">
                        <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Fonctionnalité premium 1</span>
                      </li>
                      <li class="flex items-center">
                        <svg class="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Support prioritaire</span>
                      </li>
                    </ul>
                    <button class="mt-6 w-full bg-primary text-white py-2 rounded-md">Choisir</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        `;
        break;
      case 'testimonials':
        content = `
          <section class="py-16 bg-gray-50">
            <div class="container mx-auto px-4">
              <h2 class="text-3xl font-bold text-center mb-12">Témoignages Clients</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-lg shadow-md">
                  <div class="flex items-center mb-4">
                    <div class="h-12 w-12 rounded-full bg-gray-300 mr-4"></div>
                    <div>
                      <h4 class="font-semibold">Client 1</h4>
                      <p class="text-sm text-gray-600">PDG, Entreprise</p>
                    </div>
                  </div>
                  <p class="italic text-gray-700">"Ce produit a transformé notre façon de travailler. Je ne peux plus m'en passer et le recommande vivement à tous mes collègues."</p>
                  <div class="flex mt-3 text-yellow-400">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                  <div class="flex items-center mb-4">
                    <div class="h-12 w-12 rounded-full bg-gray-300 mr-4"></div>
                    <div>
                      <h4 class="font-semibold">Client 2</h4>
                      <p class="text-sm text-gray-600">Directeur Marketing</p>
                    </div>
                  </div>
                  <p class="italic text-gray-700">"Une solution intuitive et puissante qui a permis d'améliorer significativement notre productivité. Le support client est également excellent."</p>
                  <div class="flex mt-3 text-yellow-400">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                  <div class="flex items-center mb-4">
                    <div class="h-12 w-12 rounded-full bg-gray-300 mr-4"></div>
                    <div>
                      <h4 class="font-semibold">Client 3</h4>
                      <p class="text-sm text-gray-600">Responsable IT</p>
                    </div>
                  </div>
                  <p class="italic text-gray-700">"L'intégration a été simple et rapide. La solution répond parfaitement à nos besoins et le prix est très raisonnable par rapport à la valeur apportée."</p>
                  <div class="flex mt-3 text-yellow-400">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </section>
        `;
        break;
      case 'team':
        content = `
          <section class="py-16 bg-white">
            <div class="container mx-auto px-4">
              <h2 class="text-3xl font-bold text-center mb-12">Notre Équipe</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="text-center">
                  <div class="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 class="font-bold text-lg">Nom Prénom</h3>
                  <p class="text-primary mb-2">PDG & Fondateur</p>
                  <p class="text-sm text-gray-600 mb-4">Courte description du rôle et de l'expertise de cette personne.</p>
                  <div class="flex justify-center space-x-3">
                    <a href="#" class="text-gray-500 hover:text-primary">
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    <a href="#" class="text-gray-500 hover:text-primary">
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                  </div>
                </div>
                <div class="text-center">
                  <div class="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 class="font-bold text-lg">Nom Prénom</h3>
                  <p class="text-primary mb-2">Directeur Technique</p>
                  <p class="text-sm text-gray-600 mb-4">Courte description du rôle et de l'expertise de cette personne.</p>
                  <div class="flex justify-center space-x-3">
                    <a href="#" class="text-gray-500 hover:text-primary">
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    <a href="#" class="text-gray-500 hover:text-primary">
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                  </div>
                </div>
                <div class="text-center">
                  <div class="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 class="font-bold text-lg">Nom Prénom</h3>
                  <p class="text-primary mb-2">Directeur Marketing</p>
                  <p class="text-sm text-gray-600 mb-4">Courte description du rôle et de l'expertise de cette personne.</p>
                  <div class="flex justify-center space-x-3">
                    <a href="#" class="text-gray-500 hover:text-primary">
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    <a href="#" class="text-gray-500 hover:text-primary">
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                  </div>
                </div>
                <div class="text-center">
                  <div class="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <h3 class="font-bold text-lg">Nom Prénom</h3>
                  <p class="text-primary mb-2">Responsable Commercial</p>
                  <p class="text-sm text-gray-600 mb-4">Courte description du rôle et de l'expertise de cette personne.</p>
                  <div class="flex justify-center space-x-3">
                    <a href="#" class="text-gray-500 hover:text-primary">
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    <a href="#" class="text-gray-500 hover:text-primary">
                      <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
