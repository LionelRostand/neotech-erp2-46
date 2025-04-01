
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
}

interface TemplateSelectorProps {
  templates: Template[];
  activeTemplateId: string | null;
  onTemplateSelect: (templateId: string) => void;
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  templates, 
  activeTemplateId, 
  onTemplateSelect,
  onClose
}) => {
  const navigate = useNavigate();
  
  const handleNavigateToTemplates = () => {
    navigate('/modules/website/templates');
    onClose();
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle>Choisir un template</SheetTitle>
          <SheetDescription>
            Sélectionnez un template pour votre site web. Vous pouvez modifier et personnaliser le template après l'avoir choisi.
          </SheetDescription>
        </SheetHeader>
        
        <div className="my-6">
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore installé de templates.
              </p>
              <Button onClick={handleNavigateToTemplates}>
                Parcourir les templates
              </Button>
            </div>
          ) : (
            <RadioGroup value={activeTemplateId || ''} onValueChange={onTemplateSelect}>
              {templates.map(template => (
                <div key={template.id} className="mb-4">
                  <Card className={`overflow-hidden cursor-pointer hover:border-primary transition-colors ${activeTemplateId === template.id ? 'border-primary' : ''}`}>
                    <div className="flex items-stretch">
                      <div className="flex items-center justify-center px-4">
                        <RadioGroupItem value={template.id} id={template.id} />
                      </div>
                      <div className="flex-grow p-4">
                        <Label htmlFor={template.id} className="font-medium cursor-pointer">
                          {template.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
        
        <SheetFooter>
          <div className="flex w-full justify-between">
            <Button variant="outline" onClick={handleNavigateToTemplates}>
              Voir plus de templates
            </Button>
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TemplateSelector;
