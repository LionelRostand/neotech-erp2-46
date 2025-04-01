
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WebsiteTemplatePreview from '@/components/module/submodules/website/WebsiteTemplatePreview';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const WebsiteTemplatePreviewWrapper: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate('/modules/website/templates')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux templates
        </Button>
      </div>
      
      <WebsiteTemplatePreview />
    </div>
  );
};

export default WebsiteTemplatePreviewWrapper;
