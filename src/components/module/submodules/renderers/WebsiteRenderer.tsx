
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { SubModule } from '@/data/types/modules';
import WebsiteEditor from '../website/WebsiteEditor';
import WebsiteTemplates from '../website/WebsiteTemplates';
import WebsitePages from '../website/WebsitePages';
import WebsiteDesign from '../website/WebsiteDesign';
import WebsiteMedia from '../website/WebsiteMedia';
import WebsiteModules from '../website/WebsiteModules';
import WebsiteSettings from '../website/WebsiteSettings';
import WebsitePublic from '../website/WebsitePublic';
import WebsiteThemeEditor from '../website/WebsiteThemeEditor';
import WebsiteCMS from '../website/WebsiteCMS';

export const renderWebsiteSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'website-editor':
      return <WebsiteEditor />;
    case 'website-templates':
      return <WebsiteTemplates />;
    case 'website-pages':
      return <WebsitePages />;
    case 'website-design':
      return <WebsiteDesign />;
    case 'website-media':
      return <WebsiteMedia />;
    case 'website-modules':
      return <WebsiteModules />;
    case 'website-settings':
      return <WebsiteSettings />;
    case 'website-public':
      return <WebsitePublic />;
    case 'website-theme':
      return <WebsiteThemeEditor />;
    case 'website-cms':
      return <WebsiteCMS />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
