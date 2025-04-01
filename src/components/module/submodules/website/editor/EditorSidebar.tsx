
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { websiteElements } from './constants/elements';
import ElementsSearch from './components/ElementsSearch';
import ElementsSection from './components/ElementsSection';

const EditorSidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term.toLowerCase());
  };

  return (
    <div className="h-full overflow-y-auto">
      <ElementsSearch onSearch={handleSearch} />
      
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
    </div>
  );
};

export default EditorSidebar;
