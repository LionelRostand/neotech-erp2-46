
import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { websiteElements } from './constants/elements';
import ElementsSearch from './components/ElementsSearch';
import ElementsSection from './components/ElementsSection';

interface Template {
  id: string;
  name: string;
  description: string;
}

interface EditorSidebarProps {
  installedTemplates?: Template[];
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ installedTemplates = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('elements');
  const [templateElements, setTemplateElements] = useState<any[]>([]);

  useEffect(() => {
    // Transformer les templates installés en éléments
    const elements = installedTemplates.map(template => ({
      type: `template-${template.id}`,
      label: template.name,
      icon: '📄',
      category: 'templates',
      draggable: true
    }));
    
    setTemplateElements(elements);
  }, [installedTemplates]);

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  return (
    <div className="h-full overflow-y-auto">
      <Tabs defaultValue="elements" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-2 py-2">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="elements">Éléments</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      
      <ElementsSearch onSearch={handleSearch} />
      
      {activeTab === 'elements' ? (
        <>
          <ElementsSection 
            title="Navigation" 
            elements={websiteElements.navigation}
            displayAsGrid={true} 
          />
          
          <ElementsSection 
            title="Structure" 
            elements={websiteElements.structure}
            displayAsGrid={true} 
          />
          
          <Separator className="my-4" />
          
          <ElementsSection 
            title="Éléments Basiques" 
            elements={websiteElements.basic} 
          />
          
          <Separator className="my-4" />
          
          <ElementsSection 
            title="E-commerce" 
            elements={websiteElements.commerce} 
          />
          
          <Separator className="my-4" />
          
          <ElementsSection 
            title="Social" 
            elements={websiteElements.social} 
          />
          
          <Separator className="my-4" />
          
          <ElementsSection 
            title="Formulaires" 
            elements={websiteElements.forms} 
          />

          <Separator className="my-4" />
          
          <ElementsSection 
            title="Intégrations" 
            elements={websiteElements.integrations} 
          />
        </>
      ) : (
        <>
          {templateElements.length > 0 ? (
            <ElementsSection 
              title="Templates installés" 
              elements={templateElements}
              displayAsGrid={false}
            />
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm">
                Aucun template installé. Visitez la section Templates pour en installer.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditorSidebar;
