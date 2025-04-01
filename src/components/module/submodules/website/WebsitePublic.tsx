
import React, { useState, useEffect } from 'react';
import WebsitePreview from './website-preview/WebsitePreview';

interface PreviewContentItem {
  id: string;
  type: string;
  content: string;
}

const WebsitePublic = () => {
  const [publishedContent, setPublishedContent] = useState<PreviewContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const published = localStorage.getItem('website-published');
      if (published) {
        setPublishedContent(JSON.parse(published));
      }
    } catch (error) {
      console.error('Error loading published content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Site web public</h2>
      <p className="text-muted-foreground">
        Aperçu du site web tel qu'il apparaît aux visiteurs
      </p>
      
      {publishedContent.length > 0 ? (
        <WebsitePreview previewMode={true} initialContent={publishedContent} />
      ) : (
        <div className="text-center p-10 border border-dashed rounded-lg">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌐</span>
          </div>
          <h3 className="text-lg font-medium">Aucun contenu publié</h3>
          <p className="text-muted-foreground mt-2">
            Vous n'avez pas encore publié votre site web. Rendez-vous dans l'éditeur pour créer et publier du contenu.
          </p>
        </div>
      )}
    </div>
  );
};

export default WebsitePublic;
