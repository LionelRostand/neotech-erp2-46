
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Eye, Download } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
}

const templates: Template[] = [
  {
    id: 'transport-1',
    name: 'Transport Booking',
    description: 'Template pour réservation de transport avec formulaire intégré',
    thumbnail: 'https://placehold.co/300x200/e4e4e7/71717a?text=Transport+Booking',
    category: 'transport'
  },
  {
    id: 'business-1',
    name: 'Business Landing',
    description: 'Template professionnel pour entreprise',
    thumbnail: 'https://placehold.co/300x200/e4e4e7/71717a?text=Business+Landing',
    category: 'business'
  },
  {
    id: 'portfolio-1',
    name: 'Portfolio Créatif',
    description: 'Showcase pour professionnels créatifs',
    thumbnail: 'https://placehold.co/300x200/e4e4e7/71717a?text=Portfolio',
    category: 'portfolio'
  },
];

const WebsiteTemplates: React.FC = () => {
  const navigate = useNavigate();

  const handlePreview = (templateId: string) => {
    navigate(`/modules/website/preview/templates/${templateId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Templates</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="aspect-video relative bg-muted">
              <img 
                src={template.thumbnail} 
                alt={template.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePreview(template.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Installer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebsiteTemplates;
