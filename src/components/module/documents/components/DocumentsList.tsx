
import React from 'react';
import { DocumentFile } from '../types/document-types';
import { DocumentsLoading } from './DocumentsLoading';
import { DocumentsEmptyState } from './DocumentsEmptyState';
import { DocumentGridItem } from './DocumentGridItem';
import { DocumentListItem } from './DocumentListItem';
import { HrDocument } from '@/hooks/useDocumentsData';

interface DocumentsListProps {
  documents: (DocumentFile | HrDocument)[];
  isLoading?: boolean;
  view?: 'grid' | 'list';
  onSelect?: (document: DocumentFile | HrDocument) => void;
  onDelete?: (documentId: string) => void;
  selected?: string;
}

export const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  isLoading = false,
  view = 'grid',
  onSelect = () => {},
  onDelete = () => {},
  selected
}) => {
  // Log for debugging
  console.log("DocumentsList - documents:", documents?.length || 0);
  
  // Loading state
  if (isLoading) {
    return <DocumentsLoading view={view} />;
  }
  
  // Empty state
  if (!documents || documents.length === 0) {
    return <DocumentsEmptyState />;
  }
  
  // Grid view
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {documents.map(document => (
          <DocumentGridItem
            key={document.id}
            document={document}
            selected={selected === document.id}
            onSelect={() => onSelect(document)}
            onDelete={() => onDelete(document.id)}
          />
        ))}
      </div>
    );
  }
  
  // List view
  return (
    <div className="space-y-2">
      {documents.map(document => (
        <DocumentListItem
          key={document.id}
          document={document}
          selected={selected === document.id}
          onSelect={() => onSelect(document)}
          onDelete={() => onDelete(document.id)}
        />
      ))}
    </div>
  );
};
