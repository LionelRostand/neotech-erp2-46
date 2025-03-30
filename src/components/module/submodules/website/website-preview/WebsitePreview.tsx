
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Save, 
  Eye, 
  Copy, 
  Trash, 
  ArrowUp, 
  ArrowDown,
  Settings,
  Laptop,
  Smartphone,
  Tablet
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WebsitePreviewProps {
  previewMode?: boolean;
  initialContent?: any[];
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ 
  previewMode = false,
  initialContent = []
}) => {
  const { toast } = useToast();
  const [content, setContent] = useState<any[]>(initialContent);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Position state for the floating toolbar
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  
  const handleElementClick = (e: React.MouseEvent, element: any, index: number) => {
    if (previewMode) return;
    
    e.stopPropagation();
    setSelectedElement({ ...element, index });
    
    // Calculate position for toolbar
    const rect = e.currentTarget.getBoundingClientRect();
    setToolbarPosition({
      top: rect.top + window.scrollY - 40, // Position above the element
      left: rect.left + window.scrollX
    });
  };
  
  const handleInlineEdit = (e: React.MouseEvent, element: any, index: number) => {
    if (previewMode) return;
    
    e.stopPropagation();
    setEditingText(element.content);
    setSelectedElement({ ...element, index });
  };
  
  const saveTextEdit = () => {
    if (selectedElement && editingText !== null) {
      const updatedContent = [...content];
      updatedContent[selectedElement.index] = {
        ...updatedContent[selectedElement.index],
        content: editingText
      };
      
      setContent(updatedContent);
      setEditingText(null);
      
      toast({
        description: "Contenu sauvegardé",
      });
    }
  };
  
  const moveElement = (direction: 'up' | 'down') => {
    if (!selectedElement) return;
    
    const newIndex = direction === 'up' 
      ? Math.max(0, selectedElement.index - 1)
      : Math.min(content.length - 1, selectedElement.index + 1);
      
    if (newIndex !== selectedElement.index) {
      const updatedContent = [...content];
      const element = updatedContent[selectedElement.index];
      
      updatedContent.splice(selectedElement.index, 1);
      updatedContent.splice(newIndex, 0, element);
      
      setContent(updatedContent);
      setSelectedElement({ ...selectedElement, index: newIndex });
      
      toast({
        description: direction === 'up' ? "Élément déplacé vers le haut" : "Élément déplacé vers le bas",
      });
    }
  };
  
  const duplicateElement = () => {
    if (!selectedElement) return;
    
    const elementToDuplicate = content[selectedElement.index];
    const newElement = { 
      ...elementToDuplicate,
      id: `${elementToDuplicate.type}-${Date.now()}`
    };
    
    const updatedContent = [...content];
    updatedContent.splice(selectedElement.index + 1, 0, newElement);
    
    setContent(updatedContent);
    
    toast({
      description: "Élément dupliqué",
    });
  };
  
  const deleteElement = () => {
    if (!selectedElement) return;
    
    const updatedContent = content.filter((_, index) => index !== selectedElement.index);
    
    setContent(updatedContent);
    setSelectedElement(null);
    
    toast({
      description: "Élément supprimé",
    });
  };
  
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedElement(null);
      if (editingText !== null) {
        saveTextEdit();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [editingText, selectedElement]);

  return (
    <div className="relative w-full">
      {!previewMode && (
        <div className="border-b pb-2 mb-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button 
              variant={viewportMode === 'desktop' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewportMode('desktop')}
            >
              <Laptop className="h-4 w-4 mr-1" />
              Bureau
            </Button>
            <Button 
              variant={viewportMode === 'tablet' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewportMode('tablet')}
            >
              <Tablet className="h-4 w-4 mr-1" />
              Tablette
            </Button>
            <Button 
              variant={viewportMode === 'mobile' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewportMode('mobile')}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </Button>
          </div>
          <Button size="sm" onClick={() => toast({ description: "Page enregistrée" })}>
            <Save className="h-4 w-4 mr-1" />
            Enregistrer
          </Button>
        </div>
      )}
      
      {/* Viewport Container */}
      <div 
        className={`bg-white mx-auto border rounded-lg shadow-sm overflow-auto transition-all ${
          viewportMode === 'mobile' 
            ? 'max-w-[375px]' 
            : viewportMode === 'tablet' 
              ? 'max-w-[768px]' 
              : 'w-full'
        }`}
        style={{ minHeight: '60vh' }}
      >
        {/* Page Content */}
        <div className="min-h-screen">
          {content.map((element, index) => (
            <div 
              key={element.id}
              className={`relative ${!previewMode ? 'hover:outline hover:outline-dashed hover:outline-2 hover:outline-primary/40' : ''} ${
                selectedElement?.id === element.id ? 'outline outline-dashed outline-2 outline-primary' : ''
              }`}
              onClick={(e) => handleElementClick(e, element, index)}
              onDoubleClick={(e) => handleInlineEdit(e, element, index)}
            >
              {selectedElement?.id === element.id && editingText !== null ? (
                <div className="p-4">
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onBlur={saveTextEdit}
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" onClick={saveTextEdit}>
                      <Save className="h-4 w-4 mr-1" />
                      Sauvegarder
                    </Button>
                  </div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: element.content }} />
              )}
            </div>
          ))}
          
          {content.length === 0 && (
            <div className="flex items-center justify-center p-10 h-96 text-muted-foreground">
              <div className="text-center">
                <p>Aucun contenu dans la page</p>
                <p className="text-sm">Utilisez l'éditeur pour ajouter des éléments</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Floating toolbar for selected element */}
      {selectedElement && !previewMode && !editingText && (
        <div 
          className="absolute bg-white border rounded-md shadow-md flex items-center z-50"
          style={{
            top: `${toolbarPosition.top}px`,
            left: `${toolbarPosition.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button variant="ghost" size="icon" onClick={() => handleInlineEdit({ stopPropagation: () => {} } as any, selectedElement, selectedElement.index)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => moveElement('up')} disabled={selectedElement.index === 0}>
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => moveElement('down')} disabled={selectedElement.index === content.length - 1}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={duplicateElement}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {
            toast({
              description: "Paramètres de l'élément ouverts",
            });
          }}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={deleteElement}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default WebsitePreview;
