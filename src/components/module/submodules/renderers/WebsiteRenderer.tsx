
import React from 'react';
import WebsitePages from '../website/WebsitePages';
import WebsiteTemplates from '../website/WebsiteTemplates';
import { SubModule } from '@/data/types/modules';

interface WebsiteRendererProps {
  submoduleId: string;
  submodule: SubModule;
}

export const renderWebsiteSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering website submodule:', submoduleId);
  
  switch (submoduleId) {
    case 'website-pages':
      return <WebsitePages />;
    case 'website-templates':
      return <WebsiteTemplates />;
    default:
      return <div>Contenu en cours de développement: {submodule.name}</div>;
  }
};
