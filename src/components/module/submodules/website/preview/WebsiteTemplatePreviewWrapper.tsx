
import React from 'react';
import { useParams } from 'react-router-dom';
import WebsitePreview from '../website-preview/WebsitePreview';

const WebsiteTemplatePreviewWrapper: React.FC = () => {
  const { templateId } = useParams();

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Aperçu du template</h1>
        <p className="text-muted-foreground">
          Prévisualisation du template {templateId}
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden h-[calc(100vh-200px)]">
        <WebsitePreview previewMode={true} activeTemplate={templateId} />
      </div>
    </div>
  );
};

export default WebsiteTemplatePreviewWrapper;
