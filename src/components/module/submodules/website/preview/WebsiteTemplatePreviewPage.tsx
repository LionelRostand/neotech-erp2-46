
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TransportBookingTemplate from '../templates/TransportBookingTemplate';

const WebsiteTemplatePreviewPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleInstall = () => {
    toast({
      title: "Template installé !",
      description: "Le template a été ajouté à votre site web.",
      duration: 3000,
    });
    
    // Rediriger vers l'éditeur
    navigate('/modules/website/editor');
  };

  const renderTemplatePreview = () => {
    switch(templateId) {
      case 'transport-1':
        return <TransportBookingTemplate />;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/modules/website/templates')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux templates
          </Button>
          <h1 className="text-2xl font-bold">Aperçu du template</h1>
        </div>
        <Button onClick={handleInstall}>
          <Download className="h-4 w-4 mr-2" />
          Installer ce template
        </Button>
      </div>
      
      {loading ? (
        <div className="w-full h-[600px] bg-muted animate-pulse flex items-center justify-center">
          Chargement de l'aperçu...
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="bg-background border-b p-2 flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-muted-foreground">
              preview.votre-site.com
            </div>
            <div className="w-16"></div>
          </div>
          <div className="bg-white max-h-[800px] overflow-y-auto">
            {renderTemplatePreview()}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteTemplatePreviewPage;
