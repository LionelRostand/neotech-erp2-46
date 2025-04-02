
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WebsitePreview from './website-preview/WebsitePreview';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import TransportBookingTemplate from './templates/TransportBookingTemplate';
import RestaurantMenuTemplate from './templates/RestaurantMenuTemplate';

// Define the correct interface for the template content
interface PreviewTemplateContent {
  type: string;
  label: string;
  id: string;
}

const WebsiteTemplatePreview: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Sample content for preview
  const previewContent: PreviewTemplateContent[] = [
    { type: 'header', label: 'En-tête', id: 'header-1' },
    { type: 'text', label: 'Paragraphe', id: 'text-1' },
    { type: 'button', label: 'Bouton', id: 'button-1' }
  ];

  const renderTemplatePreview = () => {
    switch(templateId) {
      case 'transport-1':
        return <TransportBookingTemplate />;
      case 'restaurant-1':
        return <RestaurantMenuTemplate />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <h2 className="text-2xl font-bold">Aperçu non disponible</h2>
            <p className="text-muted-foreground mt-2">
              Le template demandé ({templateId}) n'est pas disponible en aperçu.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/modules/website/templates')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Aperçu du template</h1>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden h-[calc(100vh-200px)]">
        {renderTemplatePreview()}
      </div>
    </div>
  );
};

export default WebsiteTemplatePreview;
