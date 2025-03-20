
import React from 'react';
import { SubModule } from '@/data/types/modules';
import DocumentsFiles from '../documents/DocumentsFiles';
import DocumentsArchive from '../documents/DocumentsArchive';
import DocumentsSearch from '../documents/DocumentsSearch';
import DocumentsSettings from '../documents/DocumentsSettings';

export const renderDocumentsSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'documents-files':
      return <DocumentsFiles />;
    
    case 'documents-archive':
      return <DocumentsArchive />;
    
    case 'documents-search':
      return <DocumentsSearch />;
    
    case 'documents-settings':
      return <DocumentsSettings />;
    
    default:
      return <div>Submodule {submodule.name} en cours de développement</div>;
  }
};
