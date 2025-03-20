
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { DocumentFile } from '../../documents/types/document-types';
import { DocumentPreview } from '../../documents/components/DocumentPreview';
import { Cloud, File, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentSidebarProps {
  selectedDocument: DocumentFile | null;
  onPermissionsClick: () => void;
}

const DocumentSidebar: React.FC<DocumentSidebarProps> = ({ 
  selectedDocument, 
  onPermissionsClick 
}) => {
  return (
    <Card className="h-full">
      {selectedDocument ? (
        <>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base">
              <File className="h-5 w-5 mr-2" />
              {selectedDocument.name}
            </CardTitle>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedDocument.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="mr-1">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <DocumentPreview 
              document={selectedDocument} 
              onPermissionsClick={onPermissionsClick} 
            />
          </CardContent>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-12">
          <Cloud className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Aucun document sélectionné</h3>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
            Sélectionnez un document dans la liste pour afficher son aperçu et ses détails
          </p>
        </div>
      )}
    </Card>
  );
};

export default DocumentSidebar;
