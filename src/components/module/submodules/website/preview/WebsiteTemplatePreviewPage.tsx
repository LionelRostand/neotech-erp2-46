
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TransportBookingTemplate from '../templates/TransportBookingTemplate';
import RestaurantMenuTemplate from '../templates/RestaurantMenuTemplate';

const WebsiteTemplatePreviewPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si le template est déjà installé
    const savedTemplates = localStorage.getItem('website-installed-templates');
    const installedTemplates = savedTemplates ? JSON.parse(savedTemplates) : [];
    setInstalled(installedTemplates.includes(templateId));
    
    // Simuler un chargement
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [templateId]);

  const handleInstall = () => {
    // Récupérer la liste des templates installés
    const savedTemplates = localStorage.getItem('website-installed-templates');
    const installedTemplates = savedTemplates ? JSON.parse(savedTemplates) : [];
    
    // Vérifier si déjà installé
    if (installedTemplates.includes(templateId)) {
      toast({
        title: "Déjà installé",
        description: "Ce template est déjà installé sur votre site.",
        duration: 3000,
      });
      return;
    }
    
    // Ajouter le template à la liste des templates installés
    const newInstalledTemplates = [...installedTemplates, templateId];
    localStorage.setItem('website-installed-templates', JSON.stringify(newInstalledTemplates));
    
    // Trouver le template pour l'ajouter au storage
    const templateData = {
      id: templateId,
      name: getTemplateName(templateId),
      description: getTemplateDescription(templateId)
    };
    localStorage.setItem(`website-template-${templateId}`, JSON.stringify(templateData));
    
    setInstalled(true);
    
    toast({
      title: "Template installé !",
      description: "Le template a été ajouté à votre site web.",
      duration: 3000,
    });
    
    // Rediriger vers l'éditeur
    setTimeout(() => navigate('/modules/website/editor'), 1500);
  };

  const getTemplateName = (id: string) => {
    switch(id) {
      case 'transport-1': return 'Transport Booking';
      case 'restaurant-1': return 'Restaurant & Menu';
      case 'business-1': return 'Business Landing';
      case 'portfolio-1': return 'Portfolio Créatif';
      case 'ecommerce-1': return 'Boutique en ligne';
      case 'blog-1': return 'Blog Moderne';
      default: return 'Template';
    }
  };
  
  const getTemplateDescription = (id: string) => {
    switch(id) {
      case 'transport-1': return 'Template pour réservation de transport avec formulaire intégré';
      case 'restaurant-1': return 'Site pour restaurant avec menu interactif';
      case 'business-1': return 'Template professionnel pour entreprise';
      case 'portfolio-1': return 'Showcase pour professionnels créatifs';
      case 'ecommerce-1': return 'Template e-commerce avec catalogue de produits';
      case 'blog-1': return 'Template pour blog avec sections personnalisables';
      default: return 'Description du template';
    }
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/modules/website/templates')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux templates
          </Button>
          <h1 className="text-2xl font-bold">Aperçu du template</h1>
        </div>
        <Button 
          onClick={handleInstall}
          disabled={installed}
          variant={installed ? "outline" : "default"}
        >
          <Download className="h-4 w-4 mr-2" />
          {installed ? "Déjà installé" : "Installer ce template"}
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
