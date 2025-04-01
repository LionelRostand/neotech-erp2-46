
import React, { useState, useEffect } from 'react';

interface PreviewContentItem {
  id: string;
  type: string;
  content: string;
}

interface WebsitePreviewProps {
  previewMode?: boolean;
  initialContent?: PreviewContentItem[];
  customContent?: React.ReactNode;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ 
  previewMode = true,
  initialContent = [],
  customContent = null
}) => {
  const [content, setContent] = useState<PreviewContentItem[]>(initialContent);
  
  // Mise à jour du contenu lorsque initialContent change
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);
  
  return (
    <div className="website-preview w-full min-h-[400px] bg-white">
      <div className="preview-browser-header bg-gray-100 flex items-center px-3 py-2 border-b">
        <div className="flex space-x-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white rounded-md px-3 py-1 text-xs text-center w-64 truncate">
            https://monsite.lovable.app/
          </div>
        </div>
      </div>
      
      <div className="preview-content">
        {customContent ? (
          <div className="h-full">{customContent}</div>
        ) : content.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-3xl">🌐</span>
            </div>
            <h3 className="text-lg font-medium">Aperçu du site</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              {previewMode ? 
                "Ceci est une prévisualisation de votre site public. Les visiteurs verront cette version." : 
                "Ceci est un aperçu de votre site. Vous pouvez modifier le contenu en cliquant sur les éléments."}
            </p>
          </div>
        ) : (
          <div className="preview-content-items">
            {content.map((item) => (
              <div 
                key={item.id}
                className={`preview-item preview-item-${item.type}`}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsitePreview;
