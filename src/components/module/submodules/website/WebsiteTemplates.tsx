
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
}

const WebsiteTemplates: React.FC = () => {
  const navigate = useNavigate();
  
  const templates: Template[] = [
    {
      id: 'transport-1',
      name: 'Transport Booking',
      description: 'Template pour réservation de transport avec formulaire intégré',
      thumbnail: 'transport-thumbnail.jpg',
      category: 'business'
    },
    {
      id: 'restaurant-1',
      name: 'Restaurant & Menu',
      description: 'Site pour restaurant avec menu interactif',
      thumbnail: 'restaurant-thumbnail.jpg',
      category: 'food'
    },
    {
      id: 'business-1',
      name: 'Business Landing',
      description: 'Template professionnel pour entreprise',
      thumbnail: 'business-thumbnail.jpg',
      category: 'business'
    },
    {
      id: 'portfolio-1',
      name: 'Portfolio Créatif',
      description: 'Showcase pour professionnels créatifs',
      thumbnail: 'portfolio-thumbnail.jpg',
      category: 'creative'
    },
    {
      id: 'ecommerce-1',
      name: 'Boutique en ligne',
      description: 'Template e-commerce avec catalogue de produits',
      thumbnail: 'ecommerce-thumbnail.jpg',
      category: 'ecommerce'
    },
    {
      id: 'blog-1',
      name: 'Blog Moderne',
      description: 'Template pour blog avec sections personnalisables',
      thumbnail: 'blog-thumbnail.jpg',
      category: 'content'
    }
  ];

  const handleViewTemplate = (templateId: string) => {
    navigate(`/modules/website/preview/templates/${templateId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Templates</h1>
        <p className="text-muted-foreground">
          Choisissez parmi notre collection de templates professionnels pour votre site
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {/* Placeholder for template thumbnail */}
              <div className="text-4xl font-bold text-muted-foreground opacity-30">
                {template.name.substring(0, 1)}
              </div>
            </div>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewTemplate(template.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Installer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebsiteTemplates;
