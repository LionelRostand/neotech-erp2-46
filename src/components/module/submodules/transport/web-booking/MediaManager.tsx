
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Search, Upload, Image, Trash2, Edit2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MediaManager = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('uploaded');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock data for uploaded images
  const [uploadedImages, setUploadedImages] = useState([
    { id: 1, name: 'hero-background.jpg', url: '/images/car1.jpg', size: '1.2 MB', date: '2023-06-15' },
    { id: 2, name: 'compact-car.jpg', url: '/images/car2.jpg', size: '0.8 MB', date: '2023-06-14' },
    { id: 3, name: 'sedan.jpg', url: '/images/car3.jpg', size: '1.5 MB', date: '2023-06-10' },
    { id: 4, name: 'luxury-car.jpg', url: '/images/car4.jpg', size: '2.1 MB', date: '2023-06-08' },
    { id: 5, name: 'agency-paris.jpg', url: '/images/agency1.jpg', size: '1.8 MB', date: '2023-06-05' },
    { id: 6, name: 'agency-lyon.jpg', url: '/images/agency2.jpg', size: '1.6 MB', date: '2023-06-01' }
  ]);

  // Function for file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Process each file
      Array.from(e.target.files).forEach(file => {
        // Create a mock image object with local URL
        const newImage = {
          id: Date.now() + Math.random(),
          name: file.name,
          url: URL.createObjectURL(file), // Create a local object URL
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          date: new Date().toISOString().split('T')[0]
        };
        
        setUploadedImages(prev => [newImage, ...prev]);
      });
      
      toast({
        title: "Images téléversées",
        description: `${e.target.files.length} image(s) ont été téléversées avec succès.`,
        duration: 3000,
      });
      
      // Reset the file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteImage = (id: number) => {
    // Remove the image from the state
    setUploadedImages(uploadedImages.filter(image => image.id !== id));
    
    toast({
      title: "Image supprimée",
      description: "L'image a été supprimée avec succès.",
      duration: 3000,
    });
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-primary');
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary');
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a synthetic event for our handler
      const fileList = e.dataTransfer.files;
      const syntheticEvent = {
        target: {
          files: fileList,
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleFileUpload(syntheticEvent);
    }
  };

  // Filter images based on search term
  const filteredImages = uploadedImages.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Gestionnaire de médias</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Téléversez et gérez les images qui seront utilisées sur votre site de réservation.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="uploaded">Images téléversées</TabsTrigger>
          <TabsTrigger value="upload">Téléverser une image</TabsTrigger>
        </TabsList>

        <TabsContent value="uploaded" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher une image..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => setActiveTab('upload')}>
              <Upload className="h-4 w-4 mr-2" />
              Téléverser
            </Button>
          </div>

          {filteredImages.length === 0 ? (
            <div className="text-center py-8">
              <Image className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Aucune image trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {filteredImages.map(image => (
                <div key={image.id} className="border rounded overflow-hidden group relative">
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={image.url} 
                      alt={image.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // If image fails to load, show a placeholder
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                        e.currentTarget.style.padding = "20%";
                        e.currentTarget.style.boxSizing = "border-box";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button size="icon" variant="secondary" onClick={() => alert(`Éditer ${image.name}`)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate" title={image.name}>{image.name}</p>
                    <p className="text-xs text-muted-foreground">{image.size} • {image.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <h4 className="text-lg font-medium mb-1">Déposez vos fichiers ici</h4>
              <p className="text-sm text-muted-foreground mb-4">ou cliquez pour parcourir</p>
              <input 
                id="file-upload" 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload}
                multiple
              />
              <Button type="button" variant="outline" onClick={handleBrowseClick}>
                Parcourir les fichiers
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Informations importantes</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>Taille maximale: 5MB par image</li>
              <li>Formats acceptés: JPG, PNG, GIF, WEBP</li>
              <li>Résolution recommandée pour les images de fond: 1920x1080px minimum</li>
              <li>Résolution recommandée pour les images de véhicules: 800x600px minimum</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaManager;
