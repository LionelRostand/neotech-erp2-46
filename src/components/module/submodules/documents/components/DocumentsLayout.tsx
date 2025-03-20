
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentFile } from '../../../documents/types/document-types';
import { DocumentsList } from '../../../documents/components/DocumentsList';

interface DocumentsLayoutProps {
  documents: DocumentFile[];
  loading: boolean;
  view: 'grid' | 'list';
  onSelect: (document: DocumentFile) => void;
  onDelete: (documentId: string) => void;
  selectedDocumentId?: string;
}

const DocumentsLayout: React.FC<DocumentsLayoutProps> = ({
  documents,
  loading,
  view,
  onSelect,
  onDelete,
  selectedDocumentId
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Mes documents</span>
          <Badge variant="outline" className="ml-2">
            {documents.length} fichier{documents.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
        <CardDescription>
          Gérez et organisez tous vos documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DocumentsList 
          documents={documents} 
          isLoading={loading}
          view={view}
          onSelect={onSelect}
          onDelete={onDelete}
          selected={selectedDocumentId}
        />
      </CardContent>
    </Card>
  );
};

export default DocumentsLayout;
